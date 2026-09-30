# Chase the Ace (ct-ACE2) - Reproduction & Architecture Guide

Comprehensive blueprint and technical documentation to recreate the **Chase the Ace** gamified digital signage display application from scratch.

---

## 1. Project Overview & Operational Context
* **Platform:** Digital Signage Application designed for 1080p displays (1920x1080) running in a venue/hospitality setting.
* **Core Functionality:** Cycles between 3 key informational slides (Game Deck, Resumption Countdown, Hall of Winners), renders dynamic floating card particle effects, tracks New Zealand timezone draw schedules, supports full keyboard and remote controls, and syncs live data from Google Sheets CSV.
* **Timezone Localization:** `Pacific/Auckland` (NZST / NZDT).
* **Venue Draw Mechanism:** Physical playing cards are locked inside a venue cabinet; winning ticket holders draw manually from the locked cabinet once the jackpot threshold is reached.
* **Current Business Logic:** Jackpot was won on 26/09/2026 ($2,700). Draw play is paused while the pot builds by +$100 on each Tuesday/Saturday draw date without card draws. Card draws officially resume when the pot hits **$500.00** on **Tuesday, 13 October 2026 at 5:30 PM NZDT**.

---

## 2. Technology Stack & Dependencies

### Core Frameworks
* **Runtime / Bundler:** Vite 8+ with `@vitejs/plugin-react`
* **UI Framework:** React 19 + TypeScript
* **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`), `tw-animate-css`
* **Component Primitives:** Radix UI (`@radix-ui/react-popover`, `@radix-ui/react-avatar`, `@radix-ui/react-toggle`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-toolbar`)
* **Motion & Graphics:** `framer-motion` (v13+), `canvas-confetti`
* **Icons:** `lucide-react`
* **Typography:** Google Fonts (`Playfair Display`, `Bebas Neue`, `Outfit`, `Inter`)

### Initial Scaffold Command
Scaffold using shadcn preset `b4Df7KAV7A`:
```bash
pnpm dlx shadcn@latest init --preset b4Df7KAV7A --base radix --template vite --pointer
```

### Install Required Dependencies
```bash
pnpm add framer-motion canvas-confetti lucide-react tw-animate-css
pnpm add -D @types/canvas-confetti
```

---

## 3. Directory & File Structure
```
ct-ACE2/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD to GitHub Pages
├── public/
│   ├── .nojekyll                   # Prevents GitHub Pages Jekyll filtering
│   ├── admin.html                  # Standalone BroadcastChannel admin panel
│   ├── data.csv                    # Local fallback CSV tracker
│   ├── logo.png                    # Coasters Tavern venue brand logo
│   ├── preview.html                # Multi-slide 1080p surveillance grid monitor
│   └── remote.html                 # Mobile-friendly remote control interface
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── badge.tsx           # Radix/Tailwind status badges
│   │   │   └── card.tsx            # Radix/Tailwind card containers
│   │   ├── AceParticlesCanvas.tsx  # 60fps ♠ Ace card particle backdrop
│   │   ├── ControlsOverlay.tsx     # HUD, idle indicator & shortcut guide modal
│   │   ├── SlideCountdown.tsx      # Slide 2: Resumption countdown with blinking colons
│   │   ├── SlideGameDeck.tsx       # Slide 1: 52-card 13x4 3D flip card grid & rules
│   │   ├── SlideHallOfWinners.tsx  # Slide 3: Authentic champions showcase
│   │   └── TopHeader.tsx           # Fixed top header with brand logo & NZ clock
│   ├── services/
│   │   ├── dataService.ts          # Google Sheets CSV fetcher, parser & real data
│   │   └── nzTime.ts               # Pacific/Auckland draw calculator & 3 AM wipe
│   ├── types.ts                    # TypeScript data definitions
│   ├── App.tsx                     # Master slideshow orchestrator & event bus
│   ├── index.css                   # Tailwind v4 theme tokens, font utilities & animations
│   └── main.tsx                    # React application entry point
├── index.html                      # HTML root with Google Fonts injection
├── package.json                    # Dependencies & scripts
└── vite.config.ts                  # Vite config with base: "./" and path aliases
```

---

## 4. Key Configuration Files

### `vite.config.ts`
Ensures relative paths for GitHub Pages subpath deployment:
```ts
import { fileURLToPath, URL } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
```

### `index.html`
Includes Google Fonts and 1080p fixed viewport constraints:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Chase the Ace - Digital Signage Display</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700;900&family=Outfit:wght@400;600;700;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#0A0A0A] text-white overflow-hidden select-none m-0 p-0">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `src/index.css`
Font theme tokens mapped for Tailwind v4:
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@theme inline {
    --font-mono: 'JetBrains Mono Variable', monospace;
    --font-heading: 'Lora Variable', serif;
    --font-bebas: 'Bebas Neue', sans-serif;
    --font-playfair: 'Playfair Display', serif;
    --font-outfit: 'Outfit', 'Inter', sans-serif;
}
```

---

## 5. Architectural Components & Logic

### A. New Zealand Timezone & Countdown Math (`src/services/nzTime.ts`)
* Uses `Intl.DateTimeFormat` with `timeZone: "Pacific/Auckland"`.
* Draw schedule targets:
  * **Tuesday:** 5:30 PM (17:30) NZST/NZDT
  * **Saturday:** 6:30 PM (18:30) NZST/NZDT
* Automatically targets whichever deadline is next in the future. Once passed, rolls over immediately.
* **Resumption Target:** When `isGameplayPaused` is true, targets Tuesday, 13 October 2026 at 5:30 PM NZDT.
* **Anti-Leak Refresh Valve:** Sets a daily timeout targeting exactly 3:00 AM NZ local time to execute `window.location.reload(true)`.

### B. Data Fetching & Parsing Engine (`src/services/dataService.ts`)
* **Endpoint:** Published Google Sheets CSV (`GOOGLE_SHEETS_CSV_URL`).
* **Fallback:** Local `public/data.csv`.
* **Polling:** Automatically re-fetched every 5 minutes in `App.tsx`.
* **CSV Schema Mapping:**
  * Index 0: `EVENT`
  * Index 1: `DRAW DATE`
  * Index 2: `DRAW DAY`
  * Index 3: `CARDS FLIPPED`
  * Index 4: `WINNING CHANCE %`
  * Index 5: `COMMENT` ("GAME START $500")
  * Index 6: `JACKPOT + $100`
  * Index 7: `WINNING TICKET NUMBER`
  * Index 8: `NAME OF WINNER`
  * Index 9: `CARD DRAWN`
* **Real Winner Data Only:** Contains no fabricated names. Displays confirmed recent champion:
  * Name: `Lucky Winner`
  * Jackpot: `$2,700`
  * Date: `26/09/2026 (SATURDAY)`
  * Event: `#52`
  * Card: `Ace of Spades ♠`

### C. Canvas Ace Confetti Particles (`src/components/AceParticlesCanvas.tsx`)
* Custom HTML5 canvas rendering floating and gently falling ♠ Ace of Spades cards with randomized rotations, drifts, and alpha fades.
* Locked to 60fps with low CPU/GPU footprint suitable for 24/7 TV hardware.

### D. Slide Rotation Matrix
1. **Slide 1 (`SlideGameDeck.tsx`):**
   * 52-card sealed deck arranged in a 13-column x 4-row grid.
   * 3D card flip preview interaction upon touch/click.
   * Prominent building pot readout (`$100.00`) and progress bar toward `$500.00`.
   * Clear venue rules specifying manual card draws from the venue's locked cabinet.
2. **Slide 2 (`SlideCountdown.tsx`):**
   * Fullscreen high-impact countdown clock (Days, Hours, Minutes, Seconds).
   * Blinking colon separators (`:`) pulsed every second.
   * `Bebas Neue` large numerical displays.
   * Game resumption date banner (13 October 2026).
3. **Slide 3 (`SlideHallOfWinners.tsx`):**
   * "Hall of Master Ace Chasers" honoring historical winners.
   * Features real $2,700 jackpot winner and future trophy placeholders.

### E. Signage Controls & Keyboard Shortcuts (`ControlsOverlay.tsx` & `App.tsx`)
Shortcuts are disabled when typing in `input`, `textarea`, or `select` elements:
* `ArrowLeft`: Previous slide (`prevSlide()`)
* `ArrowRight`: Next slide (`nextSlide()`)
* `ArrowUp`: Restart module (reset to slide 0)
* `ArrowDown`: Skip to next module
* `Spacebar`: Toggle pause/unpause
* `0`: Toggle lock freeze (slide progression freezes, background animations continue)
* `1` to `9`: Set slide display duration (10s to 90s)
* `a` / `A`: Open Admin Panel (`/admin.html`)
* `r` / `R`: Open Remote Page (`/remote.html`)
* `p` / `P`: Open Multi-Slide Preview Monitor (`/preview.html`)
* **Interaction Delay:** Pauses slide rotation for 20 seconds of idle time upon any user touch or keypress.

### F. Multi-Slide Surveillance Preview Monitor (`public/preview.html`)
* Provides an operations monitoring dashboard showing all 3 slides simultaneously at 16:9 aspect ratio.
* Uses URL query parameters supported by `App.tsx`:
  * `/?slide=0&hideControls=1`
  * `/?slide=1&hideControls=1`
  * `/?slide=2&hideControls=1`

---

## 6. GitHub Pages Deployment Workflow

### `.github/workflows/deploy.yml`
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["master"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10
          run_install: false

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build app
        run: pnpm build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 7. Step-by-Step Recreation Runbook
1. Initialize repository and clone:
   ```bash
   git init ct-ACE2
   cd ct-ACE2
   ```
2. Scaffold shadcn + Vite:
   ```bash
   pnpm dlx shadcn@latest init --preset b4Df7KAV7A --base radix --template vite --pointer
   pnpm add framer-motion canvas-confetti lucide-react tw-animate-css
   pnpm add -D @types/canvas-confetti
   ```
3. Copy static assets to `public/`:
   * `logo.png` (Venue brand logo)
   * `data.csv` (Local tracker fallback)
   * `admin.html`, `remote.html`, `preview.html`, `.nojekyll`
4. Implement TypeScript models in `src/types.ts`.
5. Implement New Zealand timezone calculations in `src/services/nzTime.ts`.
6. Implement CSV fetching and parsing in `src/services/dataService.ts`.
7. Implement slide components (`SlideGameDeck.tsx`, `SlideCountdown.tsx`, `SlideHallOfWinners.tsx`).
8. Implement background particle canvas (`AceParticlesCanvas.tsx`) and header (`TopHeader.tsx`).
9. Wire state machine, keyboard controls, and 20s idle handler in `src/App.tsx`.
10. Test and verify 1080p display:
    ```bash
    pnpm dev
    pnpm build
    ```
11. Deploy to GitHub Pages via GitHub Actions:
    ```bash
    git add .
    git commit -m "feat: complete chase the ace digital signage application"
    gh repo create ct-ACE2 --public --source=. --remote=origin --push
    gh api -X POST /repos/:owner/ct-ACE2/pages -f build_type=workflow
    git push origin master
    ```
