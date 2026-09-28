import { useState, useEffect, useRef, useCallback } from "react";
import type { SignageData } from "./types";
import { fetchSignageData } from "./services/dataService";
import { getNextDrawTarget, setupDailyRefreshValve } from "./services/nzTime";
import { AceParticlesCanvas } from "./components/AceParticlesCanvas";
import { TopHeader } from "./components/TopHeader";
import { SlideGameDeck } from "./components/SlideGameDeck";
import { SlideCountdown } from "./components/SlideCountdown";
import { SlideHallOfWinners } from "./components/SlideHallOfWinners";
import { ControlsOverlay } from "./components/ControlsOverlay";
import { motion, AnimatePresence } from "framer-motion";

export function App() {
  const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const slideParam = urlParams ? urlParams.get("slide") : null;
  const parsedSlide = slideParam !== null ? parseInt(slideParam, 10) : NaN;
  const isFixedParam = !isNaN(parsedSlide);
  const hideControls = urlParams ? (urlParams.get("hideControls") === "1" || urlParams.get("hideControls") === "true") : false;

  const [data, setData] = useState<SignageData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(isFixedParam ? parsedSlide : 0);
  const totalSlides = 3;

  const [slideDurationSec, setSlideDurationSec] = useState(20);
  const [isPaused, setIsPaused] = useState(isFixedParam);
  const [isLocked, setIsLocked] = useState(isFixedParam);

  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [idleCountdownSec, setIdleCountdownSec] = useState(0);
  const interactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadData = useCallback(async () => {
    try {
      const result = await fetchSignageData();
      setData(result);
    } catch (err) {
      console.error("Failed to load signage data:", err);
    }
  }, []);

  useEffect(() => {
    loadData();
    const pollInterval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(pollInterval);
  }, [loadData]);

  useEffect(() => {
    return setupDailyRefreshValve();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const restartModule = useCallback(() => {
    setCurrentSlide(0);
  }, []);

  const skipModule = useCallback(() => {
    nextSlide();
  }, [nextSlide]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const toggleLock = useCallback(() => {
    setIsLocked((prev) => !prev);
  }, []);

  const registerUserActivity = useCallback(() => {
    if (isLocked) return;

    setIsUserInteracting(true);
    setIdleCountdownSec(20);

    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    countdownIntervalRef.current = setInterval(() => {
      setIdleCountdownSec((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    interactionTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
      setIdleCountdownSec(0);
    }, 20000);
  }, [isLocked]);

  useEffect(() => {
    if (isFixedParam || isPaused || isLocked || isUserInteracting) {
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
      return;
    }

    slideTimerRef.current = setTimeout(() => {
      nextSlide();
    }, slideDurationSec * 1000);

    return () => {
      if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
    };
  }, [isFixedParam, currentSlide, slideDurationSec, isPaused, isLocked, isUserInteracting, nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      registerUserActivity();

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          prevSlide();
          break;
        case "ArrowRight":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowUp":
          e.preventDefault();
          restartModule();
          break;
        case "ArrowDown":
          e.preventDefault();
          skipModule();
          break;
        case " ":
        case "Spacebar":
          e.preventDefault();
          togglePause();
          break;
        case "0":
          e.preventDefault();
          toggleLock();
          break;
        case "a":
        case "A":
          e.preventDefault();
          window.open("/admin.html", "_blank");
          break;
        case "r":
        case "R":
          e.preventDefault();
          window.open("/remote.html", "_blank");
          break;
        case "p":
        case "P":
          e.preventDefault();
          window.open("/preview.html", "_blank");
          break;
        default:
          if (e.key >= "1" && e.key <= "9") {
            e.preventDefault();
            const duration = parseInt(e.key, 10) * 10;
            setSlideDurationSec(duration);
            if (slideTimerRef.current) clearTimeout(slideTimerRef.current);
            slideTimerRef.current = setTimeout(nextSlide, duration * 1000);
          }
          break;
      }
    };

    const handlePointerDown = () => {
      registerUserActivity();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [
    prevSlide,
    nextSlide,
    restartModule,
    skipModule,
    togglePause,
    toggleLock,
    registerUserActivity,
  ]);

  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("ct_ace_signage_channel");
      bc.onmessage = (event) => {
        const { action, value } = event.data || {};
        switch (action) {
          case "next":
            nextSlide();
            break;
          case "prev":
            prevSlide();
            break;
          case "slide":
            if (typeof value === "number") setCurrentSlide(value % totalSlides);
            break;
          case "togglePause":
            togglePause();
            break;
          case "toggleLock":
            toggleLock();
            break;
          case "setDuration":
            if (typeof value === "number") setSlideDurationSec(value);
            break;
          case "reload":
            window.location.reload();
            break;
        }
      };
    } catch (e) {
      console.warn("BroadcastChannel not supported", e);
    }

    return () => {
      if (bc) bc.close();
    };
  }, [nextSlide, prevSlide, togglePause, toggleLock, totalSlides]);

  const isGameplayPaused = data?.isGameplayPaused ?? true;
  const targetJackpot = data?.targetJackpot ?? 500;
  const resumeDateStr = data?.resumeDateStr ?? "13/10/2026";
  const drawTarget = getNextDrawTarget(new Date(), isGameplayPaused);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A0A0A] text-white flex flex-col font-sans select-none">
      <AceParticlesCanvas />

      <TopHeader
        jackpot={data?.jackpot || 100}
        targetJackpot={targetJackpot}
        isGameplayPaused={isGameplayPaused}
        resumeDateStr={resumeDateStr}
        drawTarget={drawTarget}
        activeSlideIndex={currentSlide}
        totalSlides={totalSlides}
        isPaused={isPaused}
        isLocked={isLocked}
        currentDurationSec={slideDurationSec}
        onLogoClick={() => setCurrentSlide(0)}
      />

      <main className="relative z-10 w-full flex-1 pt-[104px] pb-6 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {currentSlide === 0 && (
            <motion.div
              key="slide-deck"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full h-full flex items-center justify-center"
            >
              <SlideGameDeck
                data={
                  data || {
                    jackpot: 100,
                    targetJackpot: 500,
                    isGameplayPaused: true,
                    resumeDateStr: "13/10/2026",
                    remainingCards: 52,
                    flippedCards: 0,
                    winningChance: "0.00%",
                    cards: Array.from({ length: 52 }, (_, i) => ({
                      id: i + 1,
                      cardNumber: i + 1,
                      isFlipped: false,
                    })),
                    winners: [],
                    lastUpdated: new Date(),
                  }
                }
                drawTarget={drawTarget}
              />
            </motion.div>
          )}

          {currentSlide === 1 && (
            <motion.div
              key="slide-countdown"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full h-full flex items-center justify-center"
            >
              <SlideCountdown
                jackpot={data?.jackpot || 100}
                targetJackpot={targetJackpot}
                isGameplayPaused={isGameplayPaused}
                resumeDateStr={resumeDateStr}
              />
            </motion.div>
          )}

          {currentSlide === 2 && (
            <motion.div
              key="slide-winners"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full h-full flex items-center justify-center"
            >
              <SlideHallOfWinners winners={data?.winners || []} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!hideControls && (
        <ControlsOverlay
          isPaused={isPaused}
          isLocked={isLocked}
          slideDurationSec={slideDurationSec}
          idleCountdownSec={idleCountdownSec}
          isUserInteracting={isUserInteracting}
          onPrev={prevSlide}
          onNext={nextSlide}
          onTogglePause={togglePause}
          onToggleLock={toggleLock}
        />
      )}
    </div>
  );
}

export default App;
