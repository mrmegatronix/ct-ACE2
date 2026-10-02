import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Crown, Sparkles, Shield, Flame } from "lucide-react";

interface SlideIntroProps {
  jackpot: number;
  targetJackpot: number;
  isGameplayPaused: boolean;
  resumeDateStr?: string;
  onStartClick?: () => void;
}

export const SlideIntro: React.FC<SlideIntroProps> = ({
  jackpot,
  targetJackpot,
  isGameplayPaused,
  onStartClick,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
    exit: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.98,
      transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0] as const },
    },
  };

  const topBadgeVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const heroCardEntranceVariants: Variants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.92, y: shouldReduceMotion ? 0 : 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18, scale: shouldReduceMotion ? 1 : 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const bottomTilesVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <motion.div
      onClick={onStartClick}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative w-full h-full flex flex-col items-center justify-between px-12 py-10 max-w-[1920px] mx-auto select-none overflow-hidden cursor-pointer will-change-[transform,opacity]"
    >
      {/* Dynamic Background Rays & Radial Energy Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Giant Rotating Golden Light Rays */}
        <div className="w-[1400px] h-[1400px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.18)_0%,rgba(245,158,11,0.06)_40%,transparent_70%)] blur-2xl animate-[pulse_4s_easeInOut_infinite]" />
        <div className="absolute w-[1100px] h-[1100px] rounded-full border border-[#D4AF37]/20 animate-[spin_100s_linear_infinite]" />
        <div className="absolute w-[800px] h-[800px] rounded-full border border-[#D4AF37]/30 border-dashed animate-[spin_60s_linear_infinite_reverse]" />
      </div>

      {/* Top Banner: Venue Credential */}
      <motion.div
        variants={topBadgeVariants}
        className="relative z-10 flex items-center gap-4 bg-gradient-to-r from-black/80 via-[#181611]/90 to-black/80 border-2 border-[#D4AF37]/60 px-8 py-3 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.3)] backdrop-blur-md will-change-[transform,opacity]"
      >
        <Crown className="w-6 h-6 text-[#D4AF37] animate-pulse" />
        <span className="text-sm font-black font-outfit tracking-[0.3em] uppercase text-[#F3E5AB] whitespace-nowrap">
          COASTERS TAVERN • OFFICIAL DIGITAL SIGNAGE
        </span>
        <Sparkles className="w-5 h-5 text-amber-400" />
      </motion.div>

      {/* Center Cinematic Stage: 3D Floating Hero Card & Giant Title */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center max-w-[1500px]">
        {/* Floating 3D Ace of Spades Card with Entrance Animation */}
        <motion.div
          variants={heroCardEntranceVariants}
          className="relative [perspective:1200px] mb-6 will-change-[transform,opacity]"
        >
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [-12, 12, -12],
                    rotateY: [-10, 10, -10],
                    rotateX: [6, -6, 6],
                  }
            }
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
          <div className="relative w-44 h-64 rounded-2xl p-1 bg-gradient-to-b from-[#FFE082] via-[#D4AF37] to-[#78540B] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.5)] transform-gpu">
            {/* Inner Card Face */}
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#1A1813] via-[#0E0E10] to-[#1F1B12] border border-[#D4AF37]/80 flex flex-col items-center justify-between p-3 relative overflow-hidden">
              {/* Foil Sweep Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

              {/* Corner Indices */}
              <div className="w-full flex justify-between items-start leading-none font-outfit">
                <div className="flex flex-col items-center text-[#F3E5AB]">
                  <span className="text-2xl font-black">A</span>
                  <span className="text-lg text-[#D4AF37]">♠</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]/50" />
              </div>

              {/* Center Giant Ace Emblem */}
              <div className="relative flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#D4AF37]/25 to-transparent border border-[#D4AF37]/60 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                  <span className="text-5xl text-[#F3E5AB] drop-shadow-[0_0_15px_rgba(212,175,55,0.9)] leading-none select-none">
                    ♠
                  </span>
                </div>
              </div>

              {/* Bottom Inverted Indices */}
              <div className="w-full flex justify-between items-end leading-none font-outfit rotate-180">
                <div className="flex flex-col items-center text-[#F3E5AB]">
                  <span className="text-2xl font-black">A</span>
                  <span className="text-lg text-[#D4AF37]">♠</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]/50" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

        {/* Giant "WOW" Factor Title */}
        <motion.div
          variants={titleVariants}
          className="flex flex-col items-center will-change-[transform,opacity]"
        >
          {/* Subheader Lead */}
          <div className="flex items-center gap-4 mb-2">
            <div className="h-0.5 w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <h2 className="text-3xl lg:text-4xl font-black font-outfit tracking-[0.35em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FCE49E] via-[#FFFFFF] to-[#FCE49E] drop-shadow-[0_2px_15px_rgba(212,175,55,0.6)] whitespace-nowrap">
              CHASE THE
            </h2>
            <div className="h-0.5 w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          {/* Colossal Main Word: ACE */}
          <h1 className="text-8xl lg:text-[140px] xl:text-[160px] font-black font-outfit tracking-[0.1em] uppercase leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-[#FCE49E] to-[#C99726] drop-shadow-[0_10px_40px_rgba(212,175,55,0.7)] whitespace-nowrap flex items-center gap-4 my-1">
            <span>ACE</span>
            <span className="text-[#D4AF37] drop-shadow-[0_0_35px_rgba(212,175,55,0.9)] animate-pulse">
              ♠
            </span>
          </h1>

          {/* High Impact Subtitle */}
          <p className="text-xl lg:text-2xl font-bold font-outfit uppercase tracking-[0.25em] text-[#F3E5AB] mt-3 whitespace-nowrap drop-shadow-md">
            FIND THE ACE OF SPADES • WIN THE CASH JACKPOT
          </p>
        </motion.div>
      </div>

      {/* Bottom Live Jackpot & Status Showcase */}
      <motion.div
        variants={bottomTilesVariants}
        className="relative z-10 w-full max-w-[1500px] grid grid-cols-3 gap-6 will-change-[transform,opacity]"
      >
        {/* Tile 1: Jackpot Pool */}
        <div className="bg-gradient-to-r from-[#171510]/90 to-[#0F0E0B]/90 border-2 border-[#D4AF37]/50 rounded-2xl p-4 flex items-center gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
            <Flame className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-amber-300 uppercase tracking-widest font-outfit">
              {isGameplayPaused ? "CURRENT BUILDING POT" : "ACTIVE JACKPOT"}
            </span>
            <span className="text-4xl font-black font-bebas text-white tracking-wider drop-shadow-[0_0_15px_rgba(212,175,55,0.5)] whitespace-nowrap leading-none mt-1">
              ${jackpot.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Tile 2: Target / Resumption */}
        <div className="bg-gradient-to-r from-[#171510]/90 to-[#0F0E0B]/90 border-2 border-[#D4AF37]/50 rounded-2xl p-4 flex items-center gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
            <Shield className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-[#D4AF37] uppercase tracking-widest font-outfit">
              GAMEPLAY RESUMPTION
            </span>
            <span className="text-2xl font-black font-outfit text-[#F3E5AB] tracking-wide whitespace-nowrap leading-tight mt-0.5">
              ${targetJackpot}.00 MINIMUM POOL
            </span>
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider font-outfit">
              BUILDS +$100 EACH DRAW DATE
            </span>
          </div>
        </div>

        {/* Tile 3: Draw Mechanism */}
        <div className="bg-gradient-to-r from-[#171510]/90 to-[#0F0E0B]/90 border-2 border-[#D4AF37]/50 rounded-2xl p-4 flex items-center gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
            <Crown className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-neutral-400 uppercase tracking-widest font-outfit">
              DRAW PROCEDURE
            </span>
            <span className="text-2xl font-black font-outfit text-white tracking-wide whitespace-nowrap leading-tight mt-0.5">
              52 CARDS SEALED DECK
            </span>
            <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider font-outfit">
              DRAWN MANUALLY FROM LOCKED VENUE CABINET
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
