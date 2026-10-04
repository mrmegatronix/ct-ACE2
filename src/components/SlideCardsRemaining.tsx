import React from "react";
import type { SignageData } from "../types";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Lock, History, Pin, Sparkles, ShieldCheck } from "lucide-react";

interface SlideCardsRemainingProps {
  data: SignageData;
}

export const SlideCardsRemaining: React.FC<SlideCardsRemainingProps> = ({ data }) => {
  const shouldReduceMotion = useReducedMotion();
  const remaining = data.remainingCards;
  const flipped = data.flippedCards;
  const oddsStr = data.isGameplayPaused ? "1 IN 52" : `1 IN ${remaining}`;

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
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
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
      {/* Top Vault Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between bg-gradient-to-r from-black/90 via-[#1C1A14]/95 to-black/90 border-2 border-[#D4AF37] px-10 py-4 rounded-2xl shadow-[0_0_35px_rgba(212,175,55,0.35)] backdrop-blur-md shrink-0 metallic-sheen-sweep"
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <Lock className="w-9 h-9" />
          </div>
          <div>
            <h2 className="text-4xl lg:text-5xl font-black font-outfit uppercase tracking-wider text-white">
              THE CARD VAULT <span className="text-[#D4AF37]">♠ CARDS REMAINING</span>
            </h2>
            <p className="text-xl font-black font-outfit uppercase tracking-widest text-[#F3E5AB] mt-0.5">
              LIVE REAL-TIME VENUE CARD INVENTORY
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-[#2A2415] to-[#14120D] border-2 border-[#D4AF37] px-8 py-3 rounded-full shadow-[0_0_25px_rgba(212,175,55,0.35)] flex items-center gap-3">
            <span className="text-xl font-black text-amber-300 uppercase tracking-widest font-outfit">
              ODDS OF ACE:
            </span>
            <span className="text-4xl font-black font-bebas text-white tracking-wider leading-none animate-metallic-text">
              {oddsStr}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Content Showcase: 3D Fanned Cards + Giant Statistics */}
      <div className="flex-1 flex items-center justify-between gap-14 my-4 min-h-0">
        {/* Left: 3D Fanned Cards Hero in ct-ace2 Style */}
        <motion.div
          variants={itemVariants}
          className="relative w-[440px] h-[410px] flex items-center justify-center shrink-0"
        >
          {/* Ambient Glow behind cards */}
          <div className="absolute w-[380px] h-[380px] rounded-full bg-[#D4AF37]/20 blur-3xl pointer-events-none animate-pulse" />

          {/* Left Fanned Card (52 Total) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={shouldReduceMotion ? { rotate: -14, x: -70 } : { rotate: [-14, -11, -14], x: [-70, -60, -70] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="w-[230px] h-[322px] rounded-2xl bg-gradient-to-b from-[#201C12] via-[#121215] to-[#0A0A0C] border-2 border-[#D4AF37]/50 shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex flex-col justify-between p-4 opacity-75 metallic-sheen-sweep origin-bottom-center"
            >
              <div className="flex justify-between items-start leading-none font-bebas text-4xl text-[#D4AF37]/80">
                <span>52</span>
                <span className="text-2xl">♠</span>
              </div>
              <div className="text-center font-outfit font-black text-lg tracking-widest text-[#94A3B8] uppercase">
                TOTAL DECK
              </div>
              <div className="flex justify-between items-end leading-none font-bebas text-4xl text-[#D4AF37]/80 rotate-180">
                <span>52</span>
                <span className="text-2xl">♠</span>
              </div>
            </motion.div>
          </div>

          {/* Right Fanned Card (Flipped / Missed) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={shouldReduceMotion ? { rotate: 14, x: 70 } : { rotate: [14, 11, 14], x: [70, 60, 70] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="w-[230px] h-[322px] rounded-2xl bg-gradient-to-b from-[#251A0A] via-[#151208] to-[#0A0A0C] border-2 border-amber-500/60 shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex flex-col justify-between p-4 opacity-80 metallic-sheen-sweep origin-bottom-center"
            >
              <div className="flex justify-between items-start leading-none font-bebas text-4xl text-amber-400">
                <span>#{flipped}</span>
                <span className="text-2xl">♠</span>
              </div>
              <div className="text-center font-outfit font-black text-lg tracking-widest text-amber-300 uppercase">
                MISSED
              </div>
              <div className="flex justify-between items-end leading-none font-bebas text-4xl text-amber-400 rotate-180">
                <span>#{flipped}</span>
                <span className="text-2xl">♠</span>
              </div>
            </motion.div>
          </div>

          {/* Center Master Card: 2.5:3.5 Ratio Ace of Spades + Coasters Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [-6, 6, -6] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="z-20 shrink-0 w-[260px] h-[364px] rounded-2xl p-1.5 bg-gradient-to-b from-[#FFE082] via-[#D4AF37] to-[#78540B] shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(212,175,55,0.5)] flex flex-col justify-between overflow-hidden metallic-sheen-sweep"
            >
              <div className="w-full h-full rounded-[16px] bg-gradient-to-br from-[#1C1A14] via-[#0E0E10] to-[#252012] border-2 border-[#D4AF37] flex flex-col justify-between p-4 relative overflow-hidden">
                {/* Top Corner Indices */}
                <div className="w-full flex justify-between items-start leading-none font-outfit z-10">
                  <div className="flex flex-col items-center leading-none text-[#F3E5AB]">
                    <span className="text-5xl font-black font-bebas text-transparent bg-clip-text bg-gradient-to-b from-white via-[#FFF] to-[#FCE49E] drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]">
                      A
                    </span>
                    <span className="text-3xl text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.9)] -mt-1">
                      ♠
                    </span>
                  </div>
                  <span className="text-xs font-black text-[#D4AF37] border border-[#D4AF37]/60 px-2 py-0.5 rounded-md bg-black/60 uppercase tracking-widest">
                    ACE
                  </span>
                </div>

                {/* Perfectly Centered Coasters Tavern Logo Emblem */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-28 h-28 rounded-full bg-black/90 border-2 border-[#D4AF37] p-1.5 shadow-[0_0_30px_rgba(212,175,55,0.7)] flex items-center justify-center overflow-hidden">
                    <img
                      src="./logo.png"
                      alt="Coasters Tavern"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Bottom Inverted Indices */}
                <div className="w-full flex justify-between items-end leading-none font-outfit z-10">
                  <span className="text-xs font-black text-[#D4AF37]/80 uppercase tracking-widest">
                    CHASE THE ACE
                  </span>
                  <div className="flex flex-col items-center leading-none text-[#F3E5AB] rotate-180">
                    <span className="text-5xl font-black font-bebas text-transparent bg-clip-text bg-gradient-to-b from-white via-[#FFF] to-[#FCE49E]">
                      A
                    </span>
                    <span className="text-3xl text-[#D4AF37] -mt-1">
                      ♠
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right: Giant Vault Statistics in 20m Readable Typography */}
        <motion.div
          variants={itemVariants}
          className="flex-1 flex flex-col justify-center gap-7 pl-4"
        >
          {/* Colossal 240px Remaining Numeral */}
          <div className="flex items-baseline gap-8 leading-none">
            <span className="text-[220px] lg:text-[250px] font-black font-bebas text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF] via-[#FCE49E] to-[#D4AF37] drop-shadow-[0_0_60px_rgba(212,175,55,0.85)] tracking-normal leading-none animate-metallic-text">
              {remaining}
            </span>
            <div className="flex flex-col justify-center">
              <span className="text-5xl lg:text-6xl font-black font-outfit uppercase tracking-wider text-white whitespace-nowrap">
                CARDS REMAINING
              </span>
              <span className="text-2xl lg:text-3xl font-black font-outfit uppercase tracking-widest text-[#F3E5AB] mt-2 whitespace-nowrap">
                SEALED IN LOCKED VENUE CABINET
              </span>
            </div>
          </div>

          {/* 2 Big Stat Cards */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-[1050px]">
            {/* Stat Tile 1: Flipped / Missed Cards */}
            <div className="bg-gradient-to-r from-[#1A160E]/95 to-[#12100A]/95 border-2 border-amber-500/70 rounded-2xl p-7 flex items-center gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.8)] metallic-sheen-sweep">
              <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <History className="w-12 h-12" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-5xl lg:text-6xl font-black font-bebas text-amber-400 tracking-wider whitespace-nowrap leading-none">
                  {flipped} CARDS
                </span>
                <span className="text-xl font-black text-neutral-300 uppercase tracking-wider font-outfit mt-1 whitespace-nowrap">
                  FLIPPED (MISSED)
                </span>
              </div>
            </div>

            {/* Stat Tile 2: Starting Deck Size */}
            <div className="bg-gradient-to-r from-[#181611]/95 to-[#100F0D]/95 border-2 border-[#D4AF37]/70 rounded-2xl p-7 flex items-center gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.8)] metallic-sheen-sweep">
              <div className="w-20 h-20 rounded-2xl bg-[#D4AF37]/25 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                <Pin className="w-12 h-12 text-[#D4AF37]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-5xl lg:text-6xl font-black font-bebas text-white tracking-wider whitespace-nowrap leading-none">
                  52 CARDS
                </span>
                <span className="text-xl font-black text-neutral-300 uppercase tracking-wider font-outfit mt-1 whitespace-nowrap">
                  FULL STARTING DECK
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Live Card Inventory Footer */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-black/90 via-[#1C1A14]/90 to-black/90 border-2 border-[#D4AF37]/50 rounded-2xl px-10 py-4 flex items-center justify-between text-2xl text-neutral-200 font-black uppercase tracking-wider font-outfit shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.8)] metallic-sheen-sweep"
      >
        <div className="flex items-center gap-4 text-[#D4AF37]">
          <Sparkles className="w-8 h-8 text-[#D4AF37] animate-pulse" />
          <span>LIVE CARD INVENTORY • LOCKED IN VENUE CABINET</span>
        </div>
        <div className="flex items-center gap-3 text-amber-300">
          <ShieldCheck className="w-7 h-7 text-amber-400" />
          <span className="tracking-widest">UPDATED AFTER EACH DRAW SESSION</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
