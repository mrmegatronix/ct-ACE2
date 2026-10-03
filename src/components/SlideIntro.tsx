import React, { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Crown, Sparkles, Shield, Flame, Layers } from "lucide-react";

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
  const [isFlippedManual, setIsFlippedManual] = useState(false);

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

  const topBadgeVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : -25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const heroCardEntranceVariants: Variants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.85, y: shouldReduceMotion ? 0 : 25 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25, scale: shouldReduceMotion ? 1 : 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const bottomTilesVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <motion.div
      onClick={onStartClick}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative w-full h-full flex flex-col items-center justify-between px-12 py-8 max-w-[1920px] mx-auto select-none overflow-hidden cursor-pointer will-change-[transform,opacity]"
    >
      {/* Dynamic Background Rays & Radial Energy Bloom */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Giant Pulsing Golden Ambient Glow */}
        <div className="w-[1400px] h-[1400px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.22)_0%,rgba(245,158,11,0.08)_40%,transparent_70%)] blur-3xl animate-[pulse_3.5s_easeInOut_infinite]" />
        
        {/* Sacred Geometry Rotating Rings */}
        <div className="absolute w-[1200px] h-[1200px] rounded-full border border-[#D4AF37]/25 animate-[spin_80s_linear_infinite]" />
        <div className="absolute w-[950px] h-[950px] rounded-full border-2 border-[#D4AF37]/35 border-dashed animate-[spin_50s_linear_infinite_reverse]" />
        <div className="absolute w-[700px] h-[700px] rounded-full border border-amber-400/20 animate-[spin_30s_linear_infinite]" />

        {/* Ambient Floating Suit Particles */}
        <div className="absolute top-20 left-40 text-4xl text-[#D4AF37]/30 animate-bounce select-none">♠</div>
        <div className="absolute top-36 right-48 text-3xl text-red-500/25 animate-pulse select-none">♥</div>
        <div className="absolute bottom-40 left-52 text-3xl text-red-500/25 animate-pulse select-none">♦</div>
        <div className="absolute bottom-32 right-40 text-4xl text-[#D4AF37]/30 animate-bounce select-none">♣</div>
      </div>

      {/* Top Banner: Venue Credential */}
      <motion.div
        variants={topBadgeVariants}
        className="relative z-10 flex items-center gap-4 bg-gradient-to-r from-black/90 via-[#1C1A14]/95 to-black/90 border-2 border-[#D4AF37] px-9 py-3 rounded-full shadow-[0_0_35px_rgba(212,175,55,0.35)] backdrop-blur-md will-change-[transform,opacity] metallic-sheen-sweep"
      >
        <Crown className="w-7 h-7 text-[#D4AF37] animate-pulse" />
        <span className="text-base font-black font-outfit tracking-[0.35em] uppercase text-[#F3E5AB] whitespace-nowrap">
          COASTERS TAVERN • OFFICIAL DIGITAL SIGNAGE
        </span>
        <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
      </motion.div>

      {/* Center Cinematic Stage: 3D Flipping Hero Card & Colossal Title */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center max-w-[1600px]">
        {/* Floating 3D Card with Automatic Flip showing Front (Ace) & Rear (Coasters Logo) */}
        <motion.div
          variants={heroCardEntranceVariants}
          className="relative [perspective:1400px] mb-5 will-change-[transform,opacity]"
          onClick={(e) => {
            e.stopPropagation();
            setIsFlippedManual((prev) => !prev);
          }}
          title="Click to flip Ace card"
        >
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [-14, 14, -14],
                    rotateY: isFlippedManual ? 180 : [-15, 15, -15],
                    rotateX: [6, -6, 6],
                    rotateZ: [-2, 2, -2],
                  }
            }
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-48 h-72 relative [transform-style:preserve-3d] cursor-pointer group"
          >
            {/* FRONT FACE: Golden Colossal Ace of Spades */}
            <div className="absolute inset-0 w-full h-full rounded-2xl p-1 bg-gradient-to-b from-[#FFE082] via-[#D4AF37] to-[#78540B] shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(212,175,55,0.6)] [backface-visibility:hidden] metallic-sheen-sweep">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#1A1813] via-[#0E0E10] to-[#221D12] border border-[#D4AF37] flex flex-col items-center justify-between p-3.5 relative overflow-hidden">
                {/* Specular Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />

                {/* Top Corner Indices */}
                <div className="w-full flex justify-between items-start leading-none font-outfit">
                  <div className="flex flex-col items-center text-[#F3E5AB]">
                    <span className="text-3xl font-black">A</span>
                    <span className="text-xl text-[#D4AF37]">♠</span>
                  </div>
                  <span className="text-[10px] font-black text-[#D4AF37] border border-[#D4AF37]/60 px-1.5 py-0.5 rounded bg-black/60 font-outfit uppercase">
                    ACE
                  </span>
                </div>

                {/* Center Giant Gilded Ace of Spades */}
                <div className="relative flex flex-col items-center justify-center my-auto">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-b from-[#D4AF37]/30 to-transparent border-2 border-[#D4AF37] flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.6)]">
                    <span className="text-6xl text-[#F3E5AB] drop-shadow-[0_0_20px_rgba(212,175,55,1)] leading-none select-none animate-pulse">
                      ♠
                    </span>
                  </div>
                </div>

                {/* Bottom Inverted Indices */}
                <div className="w-full flex justify-between items-end leading-none font-outfit rotate-180">
                  <div className="flex flex-col items-center text-[#F3E5AB]">
                    <span className="text-3xl font-black">A</span>
                    <span className="text-xl text-[#D4AF37]">♠</span>
                  </div>
                  <span className="text-[9px] font-black text-[#D4AF37]/80 font-outfit uppercase">
                    CHASE THE ACE
                  </span>
                </div>
              </div>
            </div>

            {/* REAR FACE: Official Coasters Tavern Deck Graphic */}
            <div className="absolute inset-0 w-full h-full rounded-2xl p-1 bg-gradient-to-b from-[#FFE082] via-[#D4AF37] to-[#78540B] shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(212,175,55,0.6)] [backface-visibility:hidden] [transform:rotateY(180deg)] metallic-sheen-sweep">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#1C1912] via-[#0E0E10] to-[#252012] border border-[#D4AF37] flex flex-col items-center justify-between p-3.5 relative overflow-hidden">
                <div className="w-full flex justify-between items-center text-xs font-black text-[#D4AF37] font-bebas">
                  <span>#CT-ACE</span>
                  <span>♠</span>
                </div>

                {/* Big Centered Coasters Logo */}
                <div className="flex flex-col items-center justify-center my-auto">
                  <div className="w-20 h-20 rounded-full bg-black/90 border-2 border-[#D4AF37] p-1 shadow-[0_0_25px_rgba(212,175,55,0.7)] flex items-center justify-center overflow-hidden">
                    <img
                      src="./logo.png"
                      alt="Coasters Tavern"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-black text-[#F3E5AB] tracking-widest uppercase font-outfit mt-2">
                    COASTERS TAVERN
                  </span>
                </div>

                <div className="w-full flex justify-between items-center text-xs font-black text-[#D4AF37] font-bebas rotate-180">
                  <span>#CT-ACE</span>
                  <span>♠</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Colossal Main Title: CHASE THE ACE */}
        <motion.div
          variants={titleVariants}
          className="flex flex-col items-center will-change-[transform,opacity]"
        >
          <h1 className="text-7xl lg:text-[115px] xl:text-[135px] font-black font-outfit tracking-wider uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF] via-[#FCE49E] to-[#D4AF37] drop-shadow-[0_10px_45px_rgba(212,175,55,0.8)] whitespace-nowrap flex items-center gap-6 my-2 animate-metallic-text">
            <span>CHASE THE</span>
            <span className="text-[#D4AF37] drop-shadow-[0_0_40px_rgba(212,175,55,1)] animate-pulse">
              ♠
            </span>
            <span>ACE</span>
          </h1>

          {/* High Impact Subtitle */}
          <p className="text-2xl lg:text-3xl font-black font-outfit uppercase tracking-[0.3em] text-[#F3E5AB] mt-2 whitespace-nowrap drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
            FIND THE ACE OF SPADES • WIN THE CASH JACKPOT
          </p>
        </motion.div>
      </div>

      {/* Bottom Live Jackpot & Status Showcase */}
      <motion.div
        variants={bottomTilesVariants}
        className="relative z-10 w-full max-w-[1550px] grid grid-cols-3 gap-6 will-change-[transform,opacity]"
      >
        {/* Tile 1: Jackpot Pool */}
        <div className="bg-gradient-to-r from-[#1A1711]/95 to-[#0F0E0B]/95 border-2 border-[#D4AF37] rounded-2xl p-5 flex items-center gap-5 shadow-[0_12px_35px_rgba(0,0,0,0.85)] backdrop-blur-md metallic-sheen-sweep">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/25 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <Flame className="w-9 h-9 text-amber-400 animate-pulse" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-amber-300 uppercase tracking-widest font-outfit">
              {isGameplayPaused ? "CURRENT BUILDING POT" : "ACTIVE JACKPOT"}
            </span>
            <span className="text-5xl font-black font-bebas text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF] to-[#FCE49E] tracking-wider drop-shadow-[0_0_20px_rgba(212,175,55,0.6)] whitespace-nowrap leading-none mt-1 animate-metallic-text">
              ${jackpot.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Tile 2: Target / Resumption */}
        <div className="bg-gradient-to-r from-[#1A1711]/95 to-[#0F0E0B]/95 border-2 border-[#D4AF37] rounded-2xl p-5 flex items-center gap-5 shadow-[0_12px_35px_rgba(0,0,0,0.85)] backdrop-blur-md metallic-sheen-sweep">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/25 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <Shield className="w-9 h-9 text-[#D4AF37]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-[#D4AF37] uppercase tracking-widest font-outfit">
              GAMEPLAY RESUMPTION
            </span>
            <span className="text-3xl font-black font-outfit text-white tracking-wide whitespace-nowrap leading-tight mt-0.5">
              ${targetJackpot}.00 MINIMUM POOL
            </span>
            <span className="text-sm text-neutral-300 font-bold uppercase tracking-wider font-outfit">
              BUILDS +$100 EACH DRAW DATE
            </span>
          </div>
        </div>

        {/* Tile 3: Draw Mechanism & 7 Cabinet Shelves */}
        <div className="bg-gradient-to-r from-[#1A1711]/95 to-[#0F0E0B]/95 border-2 border-[#D4AF37] rounded-2xl p-5 flex items-center gap-5 shadow-[0_12px_35px_rgba(0,0,0,0.85)] backdrop-blur-md metallic-sheen-sweep">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/25 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <Layers className="w-9 h-9 text-[#D4AF37]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-neutral-300 uppercase tracking-widest font-outfit">
              DRAW PROCEDURE
            </span>
            <span className="text-3xl font-black font-outfit text-white tracking-wide whitespace-nowrap leading-tight mt-0.5">
              7 CABINET SHELVES
            </span>
            <span className="text-sm text-[#D4AF37] font-bold uppercase tracking-wider font-outfit">
              52 CARDS SEALED IN LOCKED VENUE CABINET
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
