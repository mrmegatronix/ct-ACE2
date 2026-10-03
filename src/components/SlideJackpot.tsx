import React from "react";
import type { SignageData, DrawTarget } from "../types";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Flame, Trophy, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";

interface SlideJackpotProps {
  data: SignageData;
  drawTarget: DrawTarget;
}

export const SlideJackpot: React.FC<SlideJackpotProps> = ({ data, drawTarget }) => {
  const shouldReduceMotion = useReducedMotion();
  const progressPercent = Math.min(100, Math.round((data.jackpot / data.targetJackpot) * 100));

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
    exit: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.97,
      transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] as const },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full h-full flex flex-col justify-between py-1 sm:py-2 md:py-4 max-w-[1920px] mx-auto select-none will-change-[transform,opacity] overflow-hidden"
    >
      {/* Top Venue Identifier Pill */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-center shrink-0"
      >
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 bg-gradient-to-r from-black/90 via-[#1C1A14]/95 to-black/90 border sm:border-2 border-[#D4AF37] px-3 sm:px-6 md:px-8 py-1 sm:py-1.5 md:py-2 rounded-full shadow-[0_0_35px_rgba(212,175,55,0.35)] backdrop-blur-md metallic-sheen-sweep">
          <Trophy className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-[#D4AF37] animate-pulse" />
          <span className="text-[11px] sm:text-sm md:text-lg lg:text-xl xl:text-2xl font-black font-outfit tracking-wider md:tracking-[0.25em] uppercase text-[#F3E5AB] whitespace-nowrap">
            COASTERS TAVERN • PROGRESSIVE CASH PRIZE POOL
          </span>
          <Trophy className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-[#D4AF37] animate-pulse" />
        </div>
      </motion.div>

      {/* Main Colossal Jackpot Showcase Card */}
      <motion.div
        variants={itemVariants}
        className="flex-1 min-h-0 my-1.5 sm:my-2 md:my-3 bg-gradient-to-b from-[#1C1A14] via-[#121215] to-[#0A0A0A] border-2 sm:border-4 border-[#D4AF37] rounded-2xl sm:rounded-3xl p-2 sm:p-4 md:p-6 shadow-[0_0_70px_rgba(212,175,55,0.35)] flex flex-col items-center justify-center text-center relative overflow-hidden metallic-sheen-sweep"
      >
        {/* Ambient Pulsing Glow Blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F59E0B]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Jackpot Header Label */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Flame className="w-5 h-5 sm:w-7 sm:h-7 md:w-10 md:h-10 text-amber-400 animate-pulse" />
          <span className="text-xs sm:text-lg md:text-2xl lg:text-4xl xl:text-5xl uppercase font-black tracking-wider sm:tracking-widest text-amber-300 font-outfit whitespace-nowrap">
            CURRENT ACCUMULATED JACKPOT
          </span>
          <Flame className="w-5 h-5 sm:w-7 sm:h-7 md:w-10 md:h-10 text-amber-400 animate-pulse" />
        </div>

        {/* Colossal Dynamic Jackpot Number (fluid with viewport height and width) */}
        <div
          style={{ fontSize: "clamp(3rem, 14vh, 12rem)" }}
          className="font-black tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF] via-[#FCE49E] to-[#D4AF37] drop-shadow-[0_0_50px_rgba(212,175,55,0.9)] my-0.5 font-bebas whitespace-nowrap animate-metallic-text leading-none shrink-0"
        >
          ${data.jackpot.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

        {/* Target Starting Jackpot Headline */}
        <p className="text-[11px] sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-black text-white uppercase tracking-wider whitespace-nowrap font-outfit mt-0.5 shrink-0">
          DRAWS RESUME WHEN POT REACHES:{" "}
          <span className="text-amber-300 underline underline-offset-4 sm:underline-offset-8">
            ${data.targetJackpot.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
          </span>
        </p>

        {/* Wide Progress Bar towards $500 Target */}
        <div className="w-full max-w-[1400px] mt-1.5 sm:mt-2 md:mt-4 mb-0.5 shrink-0">
          <div className="flex justify-between items-center text-[10px] sm:text-xs md:text-base lg:text-xl font-black text-[#F3E5AB] uppercase mb-1 font-outfit whitespace-nowrap">
            <span>{progressPercent}% ACCUMULATED (${data.jackpot.toFixed(2)} / ${data.targetJackpot.toFixed(2)})</span>
            <span className="text-amber-300">
              TARGET: {drawTarget.weekday.toUpperCase()} {data.resumeDateStr} ({drawTarget.timeStr})
            </span>
          </div>
          <div className="w-full h-3 sm:h-5 md:h-7 bg-black/90 rounded-full border border-neutral-700 overflow-hidden p-0.5 sm:p-1 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FFE082] to-[#F59E0B] rounded-full transition-all duration-500 shadow-[0_0_25px_rgba(212,175,55,1)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Bottom 3 High Impact Metric Tiles */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-3 gap-1.5 sm:gap-3 md:gap-6 shrink-0"
      >
        {/* Tile 1: Weekly Pot Growth Rate */}
        <div className="bg-gradient-to-r from-[#171510]/95 to-[#100F0D]/95 border sm:border-2 border-[#D4AF37]/70 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 lg:p-4 flex items-center gap-2 sm:gap-2.5 lg:gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.8)] metallic-sheen-sweep min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-[#D4AF37]/25 border sm:border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-8 lg:h-8 text-amber-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-xs md:text-sm lg:text-base font-black text-amber-300 uppercase tracking-tight sm:tracking-normal font-outfit whitespace-nowrap">
              WEEKLY ACCUMULATION
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black font-bebas text-white tracking-wider drop-shadow-md whitespace-nowrap leading-none mt-0.5 animate-metallic-text">
              +$100.00
            </span>
            <span className="text-[8px] sm:text-[9px] md:text-xs font-bold text-neutral-300 uppercase tracking-tight sm:tracking-normal font-outfit mt-0.5 whitespace-nowrap">
              ADDED EVERY DRAW NIGHT
            </span>
          </div>
        </div>

        {/* Tile 2: Odds of Winning */}
        <div className="bg-gradient-to-r from-[#171510]/95 to-[#100F0D]/95 border sm:border-2 border-[#D4AF37]/70 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 lg:p-4 flex items-center gap-2 sm:gap-2.5 lg:gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.8)] metallic-sheen-sweep min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-[#D4AF37]/25 border sm:border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 lg:w-8 lg:h-8 text-[#D4AF37]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-xs md:text-sm lg:text-base font-black text-[#D4AF37] uppercase tracking-tight sm:tracking-normal font-outfit whitespace-nowrap">
              ODDS OF WINNING
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black font-bebas text-white tracking-wider drop-shadow-md whitespace-nowrap leading-none mt-0.5 animate-metallic-text">
              1 IN 52
            </span>
            <span className="text-[8px] sm:text-[9px] md:text-xs font-bold text-neutral-300 uppercase tracking-tight sm:tracking-normal font-outfit mt-0.5 whitespace-nowrap">
              52 SEALED CARDS IN PLAY
            </span>
          </div>
        </div>

        {/* Tile 3: Draw Status */}
        <div className="bg-gradient-to-r from-[#171510]/95 to-[#100F0D]/95 border sm:border-2 border-[#D4AF37]/70 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 lg:p-4 flex items-center gap-2 sm:gap-2.5 lg:gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.8)] metallic-sheen-sweep min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-amber-500/20 border sm:border-2 border-amber-500 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-8 lg:h-8 text-amber-400 animate-pulse" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-xs md:text-sm lg:text-base font-black text-amber-300 uppercase tracking-tight sm:tracking-normal font-outfit whitespace-nowrap">
              DRAW STATUS
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black font-bebas text-amber-300 tracking-wider drop-shadow-md whitespace-nowrap leading-none mt-0.5">
              PAUSED
            </span>
            <span className="text-[8px] sm:text-[9px] md:text-xs font-bold text-neutral-300 uppercase tracking-tight sm:tracking-normal font-outfit mt-0.5 whitespace-nowrap">
              RESUMES AT $500 POOL
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
