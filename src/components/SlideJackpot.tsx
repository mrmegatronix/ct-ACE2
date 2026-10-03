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
      className="w-full h-full flex flex-col justify-between px-12 py-7 max-w-[1920px] mx-auto select-none will-change-[transform,opacity]"
    >
      {/* Top Venue Identifier Pill */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-center shrink-0"
      >
        <div className="flex items-center gap-4 bg-gradient-to-r from-black/90 via-[#1C1A14]/95 to-black/90 border-2 border-[#D4AF37] px-10 py-2.5 rounded-full shadow-[0_0_35px_rgba(212,175,55,0.35)] backdrop-blur-md metallic-sheen-sweep">
          <Trophy className="w-8 h-8 text-[#D4AF37] animate-pulse" />
          <span className="text-2xl font-black font-outfit tracking-[0.25em] uppercase text-[#F3E5AB] whitespace-nowrap">
            COASTERS TAVERN • PROGRESSIVE CASH PRIZE POOL
          </span>
          <Trophy className="w-8 h-8 text-[#D4AF37] animate-pulse" />
        </div>
      </motion.div>

      {/* Main Colossal Jackpot Showcase Card */}
      <motion.div
        variants={itemVariants}
        className="flex-1 my-3 bg-gradient-to-b from-[#1C1A14] via-[#121215] to-[#0A0A0A] border-4 border-[#D4AF37] rounded-3xl p-6 shadow-[0_0_70px_rgba(212,175,55,0.35)] flex flex-col items-center justify-center text-center relative overflow-hidden metallic-sheen-sweep"
      >
        {/* Ambient Pulsing Glow Blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F59E0B]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Jackpot Header Label */}
        <div className="flex items-center gap-3">
          <Flame className="w-10 h-10 text-amber-400 animate-pulse" />
          <span className="text-4xl lg:text-5xl uppercase font-black tracking-widest text-amber-300 font-outfit whitespace-nowrap">
            CURRENT ACCUMULATED JACKPOT
          </span>
          <Flame className="w-10 h-10 text-amber-400 animate-pulse" />
        </div>

        {/* Colossal 200px Jackpot Number */}
        <div className="text-[170px] lg:text-[200px] font-black tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF] via-[#FCE49E] to-[#D4AF37] drop-shadow-[0_0_50px_rgba(212,175,55,0.9)] my-1 font-bebas whitespace-nowrap animate-metallic-text leading-none">
          ${data.jackpot.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

        {/* Target Starting Jackpot Headline */}
        <p className="text-3xl lg:text-4xl font-black text-white uppercase tracking-wider whitespace-nowrap font-outfit mt-1">
          DRAWS RESUME WHEN POT REACHES:{" "}
          <span className="text-amber-300 underline underline-offset-8">
            ${data.targetJackpot.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
          </span>
        </p>

        {/* Wide Progress Bar towards $500 Target */}
        <div className="w-full max-w-[1400px] mt-5 mb-1">
          <div className="flex justify-between text-2xl font-black text-[#F3E5AB] uppercase mb-2 font-outfit whitespace-nowrap">
            <span>{progressPercent}% ACCUMULATED (${data.jackpot.toFixed(2)} / ${data.targetJackpot.toFixed(2)})</span>
            <span className="text-amber-300">
              TARGET DATE: {drawTarget.weekday.toUpperCase()} {data.resumeDateStr} ({drawTarget.timeStr})
            </span>
          </div>
          <div className="w-full h-8 bg-black/90 rounded-full border-2 border-neutral-700 overflow-hidden p-1 shadow-inner">
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
        className="grid grid-cols-3 gap-6 shrink-0"
      >
        {/* Tile 1: Weekly Pot Growth Rate */}
        <div className="bg-gradient-to-r from-[#171510]/95 to-[#100F0D]/95 border-2 border-[#D4AF37]/70 rounded-2xl p-6 flex items-center gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.8)] metallic-sheen-sweep">
          <div className="w-20 h-20 rounded-2xl bg-[#D4AF37]/25 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <TrendingUp className="w-12 h-12 text-amber-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xl font-black text-amber-300 uppercase tracking-widest font-outfit whitespace-nowrap">
              WEEKLY POT ACCUMULATION
            </span>
            <span className="text-6xl font-black font-bebas text-white tracking-wider drop-shadow-md whitespace-nowrap leading-none mt-1 animate-metallic-text">
              +$100.00
            </span>
            <span className="text-lg font-bold text-neutral-300 uppercase tracking-wider font-outfit mt-1 whitespace-nowrap">
              ADDED EVERY DRAW NIGHT
            </span>
          </div>
        </div>

        {/* Tile 2: Odds of Winning */}
        <div className="bg-gradient-to-r from-[#171510]/95 to-[#100F0D]/95 border-2 border-[#D4AF37]/70 rounded-2xl p-6 flex items-center gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.8)] metallic-sheen-sweep">
          <div className="w-20 h-20 rounded-2xl bg-[#D4AF37]/25 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <ShieldCheck className="w-12 h-12 text-[#D4AF37]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xl font-black text-[#D4AF37] uppercase tracking-widest font-outfit whitespace-nowrap">
              STARTING ODDS OF WINNING
            </span>
            <span className="text-6xl font-black font-bebas text-white tracking-wider drop-shadow-md whitespace-nowrap leading-none mt-1 animate-metallic-text">
              1 IN 52
            </span>
            <span className="text-lg font-bold text-neutral-300 uppercase tracking-wider font-outfit mt-1 whitespace-nowrap">
              52 SEALED CARDS IN PLAY
            </span>
          </div>
        </div>

        {/* Tile 3: Draw Status */}
        <div className="bg-gradient-to-r from-[#171510]/95 to-[#100F0D]/95 border-2 border-[#D4AF37]/70 rounded-2xl p-6 flex items-center gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.8)] metallic-sheen-sweep">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <AlertTriangle className="w-12 h-12 text-amber-400 animate-pulse" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xl font-black text-amber-300 uppercase tracking-widest font-outfit whitespace-nowrap">
              CURRENT DRAW STATUS
            </span>
            <span className="text-6xl font-black font-bebas text-amber-300 tracking-wider drop-shadow-md whitespace-nowrap leading-none mt-1">
              PAUSED
            </span>
            <span className="text-lg font-bold text-neutral-300 uppercase tracking-wider font-outfit mt-1 whitespace-nowrap">
              RESUMES AT $500 POOL
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
