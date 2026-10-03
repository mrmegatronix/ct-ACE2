import { useState, useEffect, useRef, useCallback } from "react";
import type { SignageData } from "./types";
import { fetchSignageData } from "./services/dataService";
import { getNextDrawTarget, setupDailyRefreshValve } from "./services/nzTime";
import { AceParticlesCanvas } from "./components/AceParticlesCanvas";
import { TopHeader } from "./components/TopHeader";
import { SlideIntro } from "./components/SlideIntro";
import { SlideCardCabinet } from "./components/SlideCardCabinet";
import { SlideCardsRemaining } from "./components/SlideCardsRemaining";
import { SlideJackpot } from "./components/SlideJackpot";
import { SlideRules } from "./components/SlideRules";
import { SlideCountdown } from "./components/SlideCountdown";
import { SlideHallOfWinners } from "./components/SlideHallOfWinners";
import { ControlsOverlay } from "./components/ControlsOverlay";
import { SlideProgressBar } from "./components/SlideProgressBar";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";

export function App() {
  const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const slideParam = urlParams ? urlParams.get("slide") : null;
  const parsedSlide = slideParam !== null ? parseInt(slideParam, 10) : NaN;
  const isFixedParam = !isNaN(parsedSlide);
  const hideControls = urlParams ? (urlParams.get("hideControls") === "1" || urlParams.get("hideControls") === "true") : false;

  const [data, setData] = useState<SignageData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(isFixedParam ? parsedSlide : 0);
  const [direction, setDirection] = useState(1);
  const totalSlides = 7;
  const shouldReduceMotion = useReducedMotion();

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
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const restartModule = useCallback(() => {
    setDirection(-1);
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
          window.open(`${import.meta.env.BASE_URL}admin.html`, "_blank");
          break;
        case "r":
        case "R":
          e.preventDefault();
          window.open(`${import.meta.env.BASE_URL}remote.html`, "_blank");
          break;
        case "p":
        case "P":
          e.preventDefault();
          window.open(`${import.meta.env.BASE_URL}preview.html`, "_blank");
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
            if (typeof value === "number") {
              const target = value % totalSlides;
              setDirection(target >= currentSlide ? 1 : -1);
              setCurrentSlide(target);
            }
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
  }, [nextSlide, prevSlide, togglePause, toggleLock, totalSlides, currentSlide]);

  const isGameplayPaused = data?.isGameplayPaused ?? true;
  const targetJackpot = data?.targetJackpot ?? 500;
  const resumeDateStr = data?.resumeDateStr ?? "13/10/2026";
  const drawTarget = getNextDrawTarget(new Date(), isGameplayPaused);

  const activeData: SignageData = data || {
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
  };

  const slideVariants: Variants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir > 0 ? 80 : -80,
      scale: shouldReduceMotion ? 1 : 0.94,
      filter: shouldReduceMotion ? "none" : "blur(6px)",
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.55,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir > 0 ? -60 : 60,
      scale: shouldReduceMotion ? 1 : 0.95,
      filter: shouldReduceMotion ? "none" : "blur(4px)",
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.35,
        ease: [0.7, 0, 0.84, 0] as const,
      },
    }),
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A0A0A] text-white flex flex-col font-sans select-none">
      <AceParticlesCanvas />

      {currentSlide !== 0 && (
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
          onLogoClick={() => {
            setDirection(-1);
            setCurrentSlide(0);
          }}
        />
      )}

      <main className={`relative z-10 w-full flex-1 ${currentSlide === 0 ? "pt-0 pb-0" : "pt-20 sm:pt-24 lg:pt-28 pb-2 sm:pb-3"} px-2 sm:px-4 md:px-8 lg:px-12 flex items-center justify-center overflow-hidden min-h-0`}>
        <AnimatePresence mode="wait" custom={direction}>
          {currentSlide === 0 && (
            <motion.div
              key="slide-intro"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full flex items-center justify-center will-change-[transform,opacity]"
            >
              <SlideIntro
                jackpot={data?.jackpot || 100}
                targetJackpot={targetJackpot}
                isGameplayPaused={isGameplayPaused}
                resumeDateStr={resumeDateStr}
                onStartClick={nextSlide}
              />
            </motion.div>
          )}

          {currentSlide === 1 && (
            <motion.div
              key="slide-cabinet"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full flex items-center justify-center will-change-[transform,opacity]"
            >
              <SlideCardCabinet
                data={activeData}
                drawTarget={drawTarget}
              />
            </motion.div>
          )}

          {currentSlide === 2 && (
            <motion.div
              key="slide-cards-remaining"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full flex items-center justify-center will-change-[transform,opacity]"
            >
              <SlideCardsRemaining
                data={activeData}
              />
            </motion.div>
          )}

          {currentSlide === 3 && (
            <motion.div
              key="slide-jackpot"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full flex items-center justify-center will-change-[transform,opacity]"
            >
              <SlideJackpot
                data={activeData}
                drawTarget={drawTarget}
              />
            </motion.div>
          )}

          {currentSlide === 4 && (
            <motion.div
              key="slide-rules"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full flex items-center justify-center will-change-[transform,opacity]"
            >
              <SlideRules
                data={activeData}
              />
            </motion.div>
          )}

          {currentSlide === 5 && (
            <motion.div
              key="slide-countdown"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full flex items-center justify-center will-change-[transform,opacity]"
            >
              <SlideCountdown
                jackpot={activeData.jackpot}
                targetJackpot={targetJackpot}
                isGameplayPaused={isGameplayPaused}
                resumeDateStr={resumeDateStr}
              />
            </motion.div>
          )}

          {currentSlide === 6 && (
            <motion.div
              key="slide-winners"
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full flex items-center justify-center will-change-[transform,opacity]"
            >
              <SlideHallOfWinners winners={activeData.winners || []} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <SlideProgressBar
        currentSlide={currentSlide}
        slideDurationSec={slideDurationSec}
        isPaused={isPaused}
        isLocked={isLocked}
        isFixedParam={isFixedParam}
        isUserInteracting={isUserInteracting}
      />

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
