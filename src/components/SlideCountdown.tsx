import React, { useState, useEffect } from "react";
import { getCountdown } from "../services/nzTime";
import type { CountdownState } from "../types";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Calendar, AlertTriangle, ShieldCheck } from "lucide-react";

interface SlideCountdownProps {
  jackpot: number;
  targetJackpot: number;
  isGameplayPaused: boolean;
  resumeDateStr?: string;
}

export const SlideCountdown: React.FC<SlideCountdownProps> = ({
  jackpot,
  targetJackpot,
  isGameplayPaused,
}) => {
  const [countdown, setCountdown] = useState<CountdownState>(
    getCountdown(new Date(), isGameplayPaused)
  );
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(new Date(), isGameplayPaused));
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameplayPaused]);

  const format2 = (num: number) => String(num).padStart(2, "0");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
    exit: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.96,
      transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] as const },
    },
  };

  const badgeVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const digitVariants: Variants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.88, y: shouldReduceMotion ? 0 : 25 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const footerVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full h-full flex flex-col items-center justify-center px-10 py-4 max-w-[1920px] mx-auto select-none relative overflow-hidden will-change-[transform,opacity]"
    >
      {/* Background Decorative Rings */}
      <div className="absolute w-[900px] h-[900px] rounded-full border border-[#D4AF37]/15 pointer-events-none animate-[spin_120s_linear_infinite]" />
      <div className="absolute w-[700px] h-[700px] rounded-full border-2 border-[#D4AF37]/25 border-dashed pointer-events-none animate-[spin_70s_linear_infinite_reverse]" />

      {/* Main Glassmorphic Container with Metallic Sheen */}
      <div className="w-full max-w-[1550px] bg-gradient-to-b from-[#141418]/95 via-[#0D0D10]/95 to-[#08080A]/95 border-2 border-[#D4AF37] rounded-[36px] p-10 flex flex-col items-center text-center shadow-[0_0_80px_rgba(212,175,55,0.3)] relative overflow-hidden metallic-sheen-sweep">
        {/* Top Metallic Gold Glow Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_20px_#D4AF37]" />

        {/* Target Badge */}
        {isGameplayPaused ? (
          <motion.div
            variants={badgeVariants}
            className="flex items-center gap-3.5 bg-amber-950/90 border-2 border-amber-500/80 px-10 py-3 rounded-full mb-4 shadow-[0_0_30px_rgba(245,158,11,0.35)] will-change-[transform,opacity] metallic-sheen-sweep"
          >
            <AlertTriangle className="w-7 h-7 text-amber-400 animate-pulse" />
            <span className="text-2xl font-black tracking-widest text-amber-200 uppercase font-outfit whitespace-nowrap">
              RESUMPTION TARGET: TUESDAY 13 OCTOBER 2026 • 5:30 PM NZDT
            </span>
          </motion.div>
        ) : (
          <motion.div
            variants={badgeVariants}
            className="flex items-center gap-3.5 bg-[#1C1A14]/90 border-2 border-[#D4AF37]/80 px-10 py-3 rounded-full mb-4 shadow-[0_0_30px_rgba(212,175,55,0.35)] will-change-[transform,opacity] metallic-sheen-sweep"
          >
            <Calendar className="w-7 h-7 text-[#D4AF37] animate-pulse" />
            <span className="text-2xl font-black tracking-widest text-[#F3E5AB] uppercase whitespace-nowrap font-outfit">
              OFFICIAL NEXT DRAW: {countdown.target.weekday.toUpperCase()} AT {countdown.target.timeStr} NZDT
            </span>
          </motion.div>
        )}

        <motion.div variants={titleVariants} className="flex flex-col items-center will-change-[transform,opacity]">
          <h2 className="text-7xl lg:text-8xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF] via-[#FCE49E] to-[#D4AF37] drop-shadow-[0_4px_25px_rgba(212,175,55,0.6)] whitespace-nowrap font-playfair animate-metallic-text leading-tight">
            {isGameplayPaused ? "GAME PLAY RESUMES IN" : "DRAW STARTS IN"}
          </h2>

          <p className="text-2xl font-black text-[#F3E5AB] uppercase tracking-widest mt-1 whitespace-nowrap font-outfit drop-shadow-md">
            CARD DRAWS RESUME AT $500 STARTING JACKPOT • DRAWN MANUALLY FROM LOCKED CABINET
          </p>
        </motion.div>

        {/* Countdown Display with BLINKING COLONS & Metallic Sheen */}
        <div className="flex items-center justify-center gap-6 my-7">
          {/* Days */}
          <motion.div variants={digitVariants} className="flex flex-col items-center will-change-[transform,opacity]">
            <div className="w-60 h-48 bg-gradient-to-b from-[#221F18] to-[#12110D] border-2 border-[#D4AF37] rounded-3xl flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.9),inset_0_0_25px_rgba(212,175,55,0.25)] metallic-sheen-sweep">
              <span className="text-[135px] font-normal font-bebas text-transparent bg-clip-text bg-gradient-to-b from-white to-[#FCE49E] drop-shadow-[0_0_30px_rgba(212,175,55,0.6)] leading-none pt-3 animate-metallic-text">
                {format2(countdown.days)}
              </span>
            </div>
            <span className="text-2xl font-black tracking-[0.2em] uppercase text-[#D4AF37] mt-3 font-outfit">
              DAYS
            </span>
          </motion.div>

          {/* Blinking Colon 1 */}
          <div className="text-9xl font-bold text-[#D4AF37] animate-[pulse_1s_infinite] pb-12 select-none font-bebas drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]">
            :
          </div>

          {/* Hours */}
          <motion.div variants={digitVariants} className="flex flex-col items-center will-change-[transform,opacity]">
            <div className="w-60 h-48 bg-gradient-to-b from-[#221F18] to-[#12110D] border-2 border-[#D4AF37] rounded-3xl flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.9),inset_0_0_25px_rgba(212,175,55,0.25)] metallic-sheen-sweep">
              <span className="text-[135px] font-normal font-bebas text-transparent bg-clip-text bg-gradient-to-b from-white to-[#FCE49E] drop-shadow-[0_0_30px_rgba(212,175,55,0.6)] leading-none pt-3 animate-metallic-text">
                {format2(countdown.hours)}
              </span>
            </div>
            <span className="text-2xl font-black tracking-[0.2em] uppercase text-[#D4AF37] mt-3 font-outfit">
              HOURS
            </span>
          </motion.div>

          {/* Blinking Colon 2 */}
          <div className="text-9xl font-bold text-[#D4AF37] animate-[pulse_1s_infinite] pb-12 select-none font-bebas drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]">
            :
          </div>

          {/* Minutes */}
          <motion.div variants={digitVariants} className="flex flex-col items-center will-change-[transform,opacity]">
            <div className="w-60 h-48 bg-gradient-to-b from-[#221F18] to-[#12110D] border-2 border-[#D4AF37] rounded-3xl flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.9),inset_0_0_25px_rgba(212,175,55,0.25)] metallic-sheen-sweep">
              <span className="text-[135px] font-normal font-bebas text-transparent bg-clip-text bg-gradient-to-b from-white to-[#FCE49E] drop-shadow-[0_0_30px_rgba(212,175,55,0.6)] leading-none pt-3 animate-metallic-text">
                {format2(countdown.minutes)}
              </span>
            </div>
            <span className="text-2xl font-black tracking-[0.2em] uppercase text-[#D4AF37] mt-3 font-outfit">
              MINUTES
            </span>
          </motion.div>

          {/* Blinking Colon 3 */}
          <div className="text-9xl font-bold text-[#D4AF37] animate-[pulse_1s_infinite] pb-12 select-none font-bebas drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]">
            :
          </div>

          {/* Seconds */}
          <motion.div variants={digitVariants} className="flex flex-col items-center will-change-[transform,opacity]">
            <div className="w-60 h-48 bg-gradient-to-b from-[#262013] to-[#151208] border-2 border-[#D4AF37] rounded-3xl flex items-center justify-center shadow-[0_0_45px_rgba(212,175,55,0.5),inset_0_0_30px_rgba(212,175,55,0.3)] metallic-sheen-sweep">
              <span className="text-[135px] font-normal font-bebas text-transparent bg-clip-text bg-gradient-to-b from-white via-[#FFF] to-[#FCE49E] drop-shadow-[0_0_35px_rgba(212,175,55,0.8)] leading-none pt-3 animate-metallic-text">
                {format2(countdown.seconds)}
              </span>
            </div>
            <span className="text-2xl font-black tracking-[0.2em] uppercase text-[#F3E5AB] mt-3 font-outfit">
              SECONDS
            </span>
          </motion.div>
        </div>

        {/* Clean High-Impact Footer */}
        <motion.div
          variants={footerVariants}
          className="w-full flex items-center justify-between border-t-2 border-[#D4AF37]/35 pt-5 mt-2 px-4 will-change-[transform,opacity]"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-white uppercase tracking-wider font-outfit whitespace-nowrap">
                POT BUILDS +$100 EACH DRAW DAY UNTIL $500 POOL IS REACHED
              </h4>
              <p className="text-base text-neutral-300 font-bold uppercase tracking-wider font-outfit whitespace-nowrap mt-0.5">
                CURRENT ACCUMULATED: ${jackpot.toLocaleString("en-NZ", { minimumFractionDigits: 2 })} • TARGET: ${targetJackpot}.00
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm font-extrabold text-neutral-300 uppercase tracking-widest block font-outfit">
              DRAW PROCEDURE
            </span>
            <span className="text-3xl font-black text-[#F3E5AB] uppercase font-bebas tracking-wider whitespace-nowrap">
              7 SHELVES IN LOCKED VENUE CABINET
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
