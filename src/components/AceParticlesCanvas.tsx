import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  aspectRatio: number; // width to height ratio of small card
  isMiniCard: boolean; // either mini ♠ playing card or floating ♠ spade glyph
  swing: number;
  swingSpeed: number;
}

export const AceParticlesCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1920);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 1080);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 1920;
      height = canvas.height = canvas.parentElement?.clientHeight || 1080;
    };
    window.addEventListener("resize", handleResize);

    // Particle count tuned for 1080p 60fps performance
    const PARTICLE_COUNT = 32;
    const particles: Particle[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 16 + Math.random() * 26,
        speedY: 0.35 + Math.random() * 0.75,
        speedX: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: 0.12 + Math.random() * 0.28,
        aspectRatio: 1.4,
        isMiniCard: Math.random() > 0.45,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: 0.01 + Math.random() * 0.02,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.swing += p.swingSpeed;
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.swing) * 0.4;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 60) {
          p.y = -60;
          p.x = Math.random() * width;
        }
        if (p.x < -60) p.x = width + 60;
        if (p.x > width + 60) p.x = -60;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.isMiniCard) {
          // Render floating Ace of Spades card
          const w = p.size;
          const h = p.size * p.aspectRatio;

          // Card shadow
          ctx.shadowColor = "rgba(212, 175, 55, 0.25)";
          ctx.shadowBlur = 8;

          // Card body - dark metallic card with gold border
          ctx.fillStyle = "rgba(18, 18, 20, 0.85)";
          ctx.strokeStyle = "rgba(212, 175, 55, 0.7)";
          ctx.lineWidth = 1.2;

          ctx.beginPath();
          if (typeof (ctx as unknown as { roundRect?: Function }).roundRect === "function") {
            ctx.roundRect(-w / 2, -h / 2, w, h, 4);
          } else {
            ctx.rect(-w / 2, -h / 2, w, h);
          }
          ctx.fill();
          ctx.stroke();

          // Subtle gold inner trim
          ctx.strokeStyle = "rgba(212, 175, 55, 0.25)";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          if (typeof (ctx as unknown as { roundRect?: Function }).roundRect === "function") {
            ctx.roundRect(-w / 2 + 2, -h / 2 + 2, w - 4, h - 4, 2);
          } else {
            ctx.rect(-w / 2 + 2, -h / 2 + 2, w - 4, h - 4);
          }
          ctx.stroke();

          // Center ♠ Spade
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#D4AF37";
          ctx.font = `bold ${Math.round(w * 0.45)}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("♠", 0, 1);

          // Top corner "A"
          ctx.font = `bold ${Math.round(w * 0.22)}px sans-serif`;
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.fillText("A", -w / 2 + 5, -h / 2 + 8);
        } else {
          // Floating gold Ace Spade glyph
          ctx.shadowColor = "rgba(212, 175, 55, 0.4)";
          ctx.shadowBlur = 10;
          ctx.fillStyle = "#D4AF37";
          ctx.font = `${Math.round(p.size * 1.1)}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("♠", 0, 0);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ opacity: 0.95 }}
    />
  );
};
