/**
 * ct-ACE2 UI/UX Automated Audit Engine
 * Evaluates 1080p viewport containment, text wrapping, font rendering,
 * spacing collisions, and mandatory UI protocol rules (blinking colons, etc.).
 */

(function (global) {
  'use strict';

  const VIEWPORT_WIDTH = 1920;
  const VIEWPORT_HEIGHT = 1080;

  function isVisible(el) {
    if (!el || !(el instanceof Element)) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;
    return true;
  }

  function getElementSelector(el) {
    if (!el || !(el instanceof Element)) return '';
    if (el.id) return '#' + el.id;
    let path = [];
    while (el && el.nodeType === Node.ELEMENT_NODE) {
      let selector = el.nodeName.toLowerCase();
      if (el.id) {
        selector = '#' + el.id;
        path.unshift(selector);
        break;
      } else {
        let sibling = el;
        let nth = 1;
        while ((sibling = sibling.previousElementSibling)) {
          if (sibling.nodeName.toLowerCase() === selector) nth++;
        }
        if (el.className && typeof el.className === 'string') {
          const classes = el.className.trim().split(/\s+/).filter(c => c && !c.startsWith('active')).slice(0, 2);
          if (classes.length) selector += '.' + classes.join('.');
        }
        if (nth > 1) selector += `:nth-of-type(${nth})`;
      }
      path.unshift(selector);
      el = el.parentElement;
      if (path.length >= 4) break;
    }
    return path.join(' > ');
  }

  function getTextSummary(el) {
    return (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
  }

  // Check 1: 1080p Viewport Boundary Containment
  function checkViewportBounds(container, contextName, options = {}) {
    const violations = [];
    if (!container) return violations;
    const isDocScroll = options.allowVerticalScroll || false;
    const targetWidth = options.targetWidth || VIEWPORT_WIDTH;
    const targetHeight = options.targetHeight || VIEWPORT_HEIGHT;

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
      acceptNode(node) {
        if (!isVisible(node)) return NodeFilter.FILTER_REJECT;
        // Skip root containers that span full viewport intentionally
        if (node === document.documentElement || node === document.body || node.id === 'display-container' || node.classList.contains('slide-pane')) {
          return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let current;
    while ((current = walker.nextNode())) {
      const rect = current.getBoundingClientRect();
      
      // Ignore background decorative layers designed to bleed
      if (current.classList.contains('bg-stars') || current.classList.contains('bg-glow-layer') || current.classList.contains('ambient-bg') || current.tagName === 'CANVAS') {
        continue;
      }

      // Check bounds
      const horizontallyExceeded = rect.left < -1 || rect.right > targetWidth + 1;
      const verticallyExceeded = !isDocScroll && (rect.top < -1 || rect.bottom > targetHeight + 1);

      if (horizontallyExceeded || verticallyExceeded) {
        violations.push({
          severity: 'CRITICAL',
          category: 'VIEWPORT_BOUNDARY',
          context: contextName,
          selector: getElementSelector(current),
          elementText: getTextSummary(current),
          message: `Element overflows viewport [left: ${Math.round(rect.left)}, top: ${Math.round(rect.top)}, right: ${Math.round(rect.right)}, bottom: ${Math.round(rect.bottom)}]`,
          rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
          suggestedFix: 'Clamp width/height or adjust margin/padding to remain strictly within screen boundaries.'
        });
      }
    }
    return violations;
  }

  // Check 2: Container Overflow & Silent Clipping
  function checkContainerOverflow(container, contextName) {
    const violations = [];
    if (!container) return violations;

    const elements = container.querySelectorAll('*');
    for (const el of elements) {
      if (!isVisible(el)) continue;
      // Skip intentionally scrolling elements in admin
      if (el.classList.contains('scrollable-table') || el.classList.contains('admin-table-wrap') || el.classList.contains('scrollable')) continue;

      const style = window.getComputedStyle(el);
      const isOverflowHidden = style.overflow === 'hidden' || style.overflowX === 'hidden' || style.overflowY === 'hidden';

      // Check scrollWidth > clientWidth
      if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
        violations.push({
          severity: isOverflowHidden ? 'WARNING' : 'CRITICAL',
          category: 'HORIZONTAL_OVERFLOW',
          context: contextName,
          selector: getElementSelector(el),
          elementText: getTextSummary(el),
          message: `Horizontal content overflow: scrollWidth (${el.scrollWidth}px) > clientWidth (${el.clientWidth}px)${isOverflowHidden ? ' [CLIPPED SILENTLY]' : ''}`,
          suggestedFix: 'Add white-space: nowrap with reduced font-size or expand container clientWidth.'
        });
      }

      // Check scrollHeight > clientHeight (excluding flex auto-height wrappers)
      if (style.height !== 'auto' && style.maxHeight !== 'none' && el.scrollHeight > el.clientHeight + 2 && el.clientHeight > 0) {
        violations.push({
          severity: isOverflowHidden ? 'WARNING' : 'CRITICAL',
          category: 'VERTICAL_OVERFLOW',
          context: contextName,
          selector: getElementSelector(el),
          elementText: getTextSummary(el),
          message: `Vertical content overflow: scrollHeight (${el.scrollHeight}px) > clientHeight (${el.clientHeight}px)${isOverflowHidden ? ' [CLIPPED SILENTLY]' : ''}`,
          suggestedFix: 'Reduce internal padding or child font-size/height.'
        });
      }

      // Check child element clipping/spilling past parent right edge
      const parent = el.parentElement;
      if (parent && parent !== document.body && parent !== document.documentElement && isVisible(parent)) {
        const parentStyle = window.getComputedStyle(parent);
        const parentRect = parent.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        // If parent has explicit or max width (like .slide1-sidebar, .gold-panel)
        if (parentRect.width > 0 && elRect.width > 0 && (parentStyle.maxWidth !== 'none' || parentStyle.overflow === 'hidden' || parent.classList.contains('slide1-sidebar') || parent.classList.contains('slide1-header-block'))) {
          if (elRect.right > parentRect.right + 2 || elRect.left < parentRect.left - 2) {
            violations.push({
              severity: 'CRITICAL',
              category: 'CONTAINER_EDGE_CLIPPING',
              context: contextName,
              selector: getElementSelector(el),
              elementText: getTextSummary(el),
              message: `Element overflows parent container [child right: ${Math.round(elRect.right)}px > parent right: ${Math.round(parentRect.right)}px]`,
              suggestedFix: 'Reduce font-size, reduce letter-spacing, or add max-width: 100% with text-overflow: ellipsis.'
            });
          }
        }
      }
    }
    return violations;
  }

  // Check 3: Text Wrapping Heuristics
  function checkTextWrapping(container, contextName) {
    const violations = [];
    if (!container) return violations;

    // Dedicated single-line headings and badge elements that MUST NOT line-wrap
    const noWrapSelectors = [
      '.sheen-text',
      '.slide-header-title',
      '.slide-header-subtitle',
      '.hero-title-main',
      '.hero-subtitle-bar',
      '.dynamic-draw-date',
      '.dynamic-date-pill',
      '.status-pill',
      '.badge',
      '.rules-badge',
      '.jackpot-pill',
      '.slide1-subtitle'
    ];

    const targets = container.querySelectorAll(noWrapSelectors.join(', '));
    for (const el of targets) {
      if (!isVisible(el)) continue;
      // Skip if element has child block structures or is an intentionally stacked title
      if (el.querySelector('p, div, table, ul, ol') || el.classList.contains('slide1-title') || el.closest('.slide1-title')) continue;

      const text = (el.textContent || '').trim();
      if (!text) continue;

      // Check text node line count via range client rects
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = range.getClientRects();

      if (rects.length > 1) {
        // Multi-line detected
        const style = window.getComputedStyle(el);
        if (style.whiteSpace !== 'nowrap') {
          violations.push({
            severity: 'CRITICAL',
            category: 'TEXT_WRAPPING',
            context: contextName,
            selector: getElementSelector(el),
            elementText: getTextSummary(el),
            message: `Text unintentionally wrapped across ${rects.length} lines: "${getTextSummary(el)}"`,
            suggestedFix: 'Apply white-space: nowrap and reduce font-size or letter-spacing.'
          });
        }
      }
    }

    return violations;
  }

  // Check 4: Font & Typography Loading
  function checkFontsLoaded() {
    const violations = [];
    const requiredFonts = [
      'Outfit',
      'Inter',
      'Bebas Neue',
      'Oswald'
    ];

    const loadedFamilies = new Set();
    try {
      document.fonts.forEach(face => {
        loadedFamilies.add(face.family.replace(/['"]/g, '').trim().toLowerCase());
      });
    } catch (_) {}

    for (const font of requiredFonts) {
      const isLoaded = loadedFamilies.has(font.toLowerCase()) || 
        document.fonts.check(`16px "${font}"`) || 
        document.fonts.check(`700 16px "${font}"`);

      if (!isLoaded) {
        violations.push({
          severity: 'WARNING',
          category: 'FONT_LOADING',
          context: 'DOCUMENT',
          selector: 'document.fonts',
          elementText: font,
          message: `Required font "${font}" is not verified as loaded in document.fonts.`,
          suggestedFix: 'Check Google Fonts <link> tags or font-family fallback declarations.'
        });
      }
    }
    return violations;
  }

  // Check 4b: Font Family Consistency & Disallowed Fonts
  function checkFontFamilyConsistency(container, contextName) {
    const violations = [];
    if (!container) return violations;

    const disallowedSerifFonts = ['cinzel', 'playfair display', 'times new roman', 'times', 'georgia', 'garamond', 'serif'];
    const elements = container.querySelectorAll('*');

    for (const el of elements) {
      if (!isVisible(el)) continue;
      const text = (el.textContent || '').trim();
      if (!text) continue; // Only inspect elements presenting text

      const style = window.getComputedStyle(el);
      const computedFont = (style.fontFamily || '').toLowerCase();

      // Check if computed font explicitly uses serif or disallowed serif font families
      for (const disallowed of disallowedSerifFonts) {
        // Match word boundaries for "serif" so "sans-serif" is NOT flagged
        const isMatched = disallowed === 'serif' 
          ? /(^|,\s*)serif(\s*,|$)/i.test(computedFont)
          : computedFont.includes(disallowed);

        if (isMatched) {
          violations.push({
            severity: 'CRITICAL',
            category: 'FONT_FAMILY_MISMATCH',
            context: contextName,
            selector: getElementSelector(el),
            elementText: getTextSummary(el),
            message: `Disallowed font "${disallowed}" detected in font-family: "${style.fontFamily}". Serif fonts do not match the project's modern sans-serif typography system.`,
            suggestedFix: "Replace with 'Outfit' for titles/headings/subtitles or 'Inter' for body/UI."
          });
          break;
        }
      }
    }
    return violations;
  }

  // Check 5: Mandatory Clock Blinking Colons Protocol
  function checkClockBlinkingColons(container, contextName) {
    const violations = [];
    if (!container) return violations;

    const clockContainers = container.querySelectorAll(
      '#hero-clock-slide, #banner-clock, #cd-digits, .clock-digits, .countdown-clock, #main-clock'
    );

    for (const clock of clockContainers) {
      if (!isVisible(clock)) continue;

      // Find colon elements or colon character
      const colons = clock.querySelectorAll('.clock-colon, .colon, [data-colon]');
      if (colons.length === 0) {
        // Check if textContent has ':' without dedicated animated element
        if (clock.textContent.includes(':')) {
          violations.push({
            severity: 'CRITICAL',
            category: 'BLINKING_COLON_RULE',
            context: contextName,
            selector: getElementSelector(clock),
            elementText: getTextSummary(clock),
            message: 'Clock contains colon character without dedicated blinking colon element.',
            suggestedFix: 'Wrap colon in <span class="clock-colon">:</span> with opacity blink animation.'
          });
        }
      } else {
        for (const colon of colons) {
          const style = window.getComputedStyle(colon);
          const animName = style.animationName;
          const animDur = parseFloat(style.animationDuration);
          if (!animName || animName === 'none' || animDur <= 0) {
            violations.push({
              severity: 'CRITICAL',
              category: 'BLINKING_COLON_RULE',
              context: contextName,
              selector: getElementSelector(colon),
              elementText: colon.textContent,
              message: `Clock colon lacks active CSS animation (animation-name: "${animName}", duration: ${animDur}s).`,
              suggestedFix: 'Add CSS animation: blink-colon 1s infinite steps(1, start);'
            });
          }
        }
      }
    }
    return violations;
  }

  // Check 6: Sibling Element Collision (AABB)
  function checkSiblingCollisions(container, contextName) {
    const violations = [];
    if (!container) return violations;

    // Check sibling children in key layouts
    const panels = container.querySelectorAll('.gold-panel, .slide-header-block, #countdown-main-stage, .rules-grid, .status-grid');
    for (const parent of panels) {
      if (!isVisible(parent)) continue;
      const children = Array.from(parent.children).filter(isVisible);
      for (let i = 0; i < children.length; i++) {
        for (let j = i + 1; j < children.length; j++) {
          const a = children[i];
          const b = children[j];
          const styleA = window.getComputedStyle(a);
          const styleB = window.getComputedStyle(b);
          // Skip absolute/fixed positioned items intended to layer
          if (styleA.position === 'absolute' || styleB.position === 'absolute') continue;

          const rectA = a.getBoundingClientRect();
          const rectB = b.getBoundingClientRect();

          // AABB collision test with 1px buffer
          const collides = !(
            rectA.right <= rectB.left + 1 ||
            rectA.left >= rectB.right - 1 ||
            rectA.bottom <= rectB.top + 1 ||
            rectA.top >= rectB.bottom - 1
          );

          if (collides && rectA.width > 0 && rectB.width > 0 && rectA.height > 0 && rectB.height > 0) {
            violations.push({
              severity: 'WARNING',
              category: 'SIBLING_COLLISION',
              context: contextName,
              selector: `${getElementSelector(a)} <-> ${getElementSelector(b)}`,
              elementText: `${getTextSummary(a)} | ${getTextSummary(b)}`,
              message: `In-flow siblings overlap each other: A[${Math.round(rectA.left)},${Math.round(rectA.top)},${Math.round(rectA.width)}x${Math.round(rectA.height)}] vs B[${Math.round(rectB.left)},${Math.round(rectB.top)},${Math.round(rectB.width)}x${Math.round(rectB.height)}]`,
              suggestedFix: 'Adjust flex gap, margin, or layout flow to prevent collision.'
            });
          }
        }
      }
    }
    return violations;
  }

  // Audit Single Slide
  function auditSlide(slideIndex) {
    const slideId = `slide-${slideIndex}`;
    const slideEl = document.getElementById(slideId);
    const contextName = `Slide ${slideIndex} (#${slideId})`;

    if (!slideEl) {
      return [{
        severity: 'CRITICAL',
        category: 'MISSING_SLIDE',
        context: contextName,
        selector: '#' + slideId,
        message: `Slide element #${slideId} not found in DOM.`
      }];
    }

    const violations = [];
    violations.push(...checkViewportBounds(slideEl, contextName));
    violations.push(...checkContainerOverflow(slideEl, contextName));
    violations.push(...checkTextWrapping(slideEl, contextName));
    violations.push(...checkFontFamilyConsistency(slideEl, contextName));
    violations.push(...checkClockBlinkingColons(slideEl, contextName));
    violations.push(...checkSiblingCollisions(slideEl, contextName));
    return violations;
  }

  // Audit Static / Non-slide Page
  function auditPage(pageName) {
    const contextName = pageName || document.title || 'Page';
    const violations = [];
    violations.push(...checkFontsLoaded());
    violations.push(...checkViewportBounds(document.body, contextName, { allowVerticalScroll: true, targetWidth: window.innerWidth }));
    violations.push(...checkContainerOverflow(document.body, contextName));
    violations.push(...checkTextWrapping(document.body, contextName));
    violations.push(...checkFontFamilyConsistency(document.body, contextName));
    violations.push(...checkClockBlinkingColons(document.body, contextName));
    violations.push(...checkSiblingCollisions(document.body, contextName));

    return {
      timestamp: new Date().toISOString(),
      pageName,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      violations,
      summary: {
        totalViolations: violations.length,
        critical: violations.filter(v => v.severity === 'CRITICAL').length,
        warning: violations.filter(v => v.severity === 'WARNING').length
      }
    };
  }

  // Audit All Slides Iteratively
  async function auditAllSlides(options = {}) {
    const delay = options.delayMs || 300;
    const totalSlides = typeof window.totalSlides === 'number' ? window.totalSlides : 9;
    const report = {
      timestamp: new Date().toISOString(),
      viewport: { width: window.innerWidth, height: window.innerHeight },
      totalSlides,
      fontStatus: checkFontsLoaded(),
      slideReports: [],
      summary: { totalViolations: 0, critical: 0, warning: 0 }
    };

    const originalSlide = typeof window.currentSlide === 'number' ? window.currentSlide : 0;

    for (let i = 0; i < totalSlides; i++) {
      if (typeof window.showSlide === 'function') {
        window.showSlide(i);
        await new Promise(r => setTimeout(r, delay));
      }
      const violations = auditSlide(i);
      report.slideReports.push({
        slideIndex: i,
        slideId: `slide-${i}`,
        violations
      });
      for (const v of violations) {
        report.summary.totalViolations++;
        if (v.severity === 'CRITICAL') report.summary.critical++;
        else if (v.severity === 'WARNING') report.summary.warning++;
      }
    }

    // Restore original slide
    if (typeof window.showSlide === 'function') {
      window.showSlide(originalSlide);
    }

    return report;
  }

  // Format Report as GitHub Markdown
  function formatMarkdownReport(report) {
    const lines = [];
    lines.push('# ct-ACE2 UI/UX Audit Report');
    lines.push(`* **Execution Time:** ${report.timestamp}`);
    lines.push(`* **Viewport:** ${report.viewport.width}px × ${report.viewport.height}px (Target: 1920×1080)`);
    lines.push(`* **Total Slides Evaluated:** ${report.totalSlides}`);
    lines.push(`* **Total Violations:** ${report.summary.totalViolations} (Critical: ${report.summary.critical}, Warnings: ${report.summary.warning})\n`);

    if (report.fontStatus && report.fontStatus.length > 0) {
      lines.push('## Font Loading Status');
      for (const fontViolation of report.fontStatus) {
        lines.push(`- **[${fontViolation.severity}]** ${fontViolation.message}`);
      }
      lines.push('');
    }

    lines.push('## Slide-by-Slide Audit Findings\n');
    for (const slide of report.slideReports) {
      lines.push(`### Slide ${slide.slideIndex} (\`${slide.slideId}\`)`);
      if (slide.violations.length === 0) {
        lines.push('- **STATUS: PASS** - No layout, text-wrapping, overflow, or rule violations detected.\n');
      } else {
        lines.push(`- **STATUS: ${slide.violations.some(v => v.severity === 'CRITICAL') ? 'FAIL (CRITICAL)' : 'WARNING'}** (${slide.violations.length} issue${slide.violations.length > 1 ? 's' : ''}):`);
        for (const v of slide.violations) {
          lines.push(`  * **[${v.severity}] ${v.category}**: \`${v.selector}\``);
          lines.push(`    - *Message:* ${v.message}`);
          if (v.elementText) lines.push(`    - *Text:* "${v.elementText}"`);
          if (v.suggestedFix) lines.push(`    - *Suggested Fix:* ${v.suggestedFix}`);
        }
        lines.push('');
      }
    }

    return lines.join('\n');
  }

  // Expose on global window object
  const ACE_AUDIT = {
    auditSlide,
    auditPage,
    auditAllSlides,
    checkFontsLoaded,
    checkFontFamilyConsistency,
    checkViewportBounds,
    checkContainerOverflow,
    checkTextWrapping,
    checkClockBlinkingColons,
    checkSiblingCollisions,
    formatMarkdownReport
  };

  global.ACE_AUDIT = ACE_AUDIT;

  // Auto-init keybind 'T' for in-browser audit if in window
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', function (e) {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.key === 't' || e.key === 'T') {
        console.log('[ACE_AUDIT] Running full UI/UX audit across all slides...');
        ACE_AUDIT.auditAllSlides({ delayMs: 200 }).then(report => {
          console.log('[ACE_AUDIT] Audit Complete:', report);
          console.log(ACE_AUDIT.formatMarkdownReport(report));
        });
      }
    });

    // Check URL query param ?audit=true
    if (typeof URLSearchParams !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('audit') === 'true') {
        window.addEventListener('load', () => {
          setTimeout(() => {
            ACE_AUDIT.auditAllSlides({ delayMs: 250 }).then(report => {
              console.log(ACE_AUDIT.formatMarkdownReport(report));
            });
          }, 800);
        });
      }
    }
  }

})(typeof window !== 'undefined' ? window : globalThis);
