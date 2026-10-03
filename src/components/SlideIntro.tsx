import React, { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Shield, Flame, Layers, AlertTriangle } from "lucide-react";

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
    hidden: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.6,
      y: shouldReduceMotion ? 0 : 50,
      filter: shouldReduceMotion ? "none" : "blur(18px) brightness(2.5)",
    },
    visible: {
      opacity: 1,
      scale: [0.6, 1.05, 1],
      y: [50, -6, 0],
      filter: ["blur(18px) brightness(2.5)", "blur(0px) brightness(1.2)", "blur(0px) brightness(1)"],
      transition: {
        duration: 1.35,
        ease: [0.16, 1, 0.3, 1] as const,
        times: [0, 0.7, 1],
      },
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
        <div className="absolute w-[1200px] h-[1200px] rounded-full border border-[#D4AF37]/25 animate-[spin_140s_linear_infinite]" />
        <div className="absolute w-[950px] h-[950px] rounded-full border-2 border-[#D4AF37]/35 border-dashed animate-[spin_90s_linear_infinite_reverse]" />
        <div className="absolute w-[700px] h-[700px] rounded-full border border-amber-400/20 animate-[spin_60s_linear_infinite]" />

        {/* Ambient Floating Suit Particles */}
        <div className="absolute top-20 left-40 text-4xl text-[#D4AF37]/30 animate-bounce select-none">♠</div>
        <div className="absolute top-36 right-48 text-3xl text-red-500/25 animate-pulse select-none">♥</div>
        <div className="absolute bottom-40 left-52 text-3xl text-red-500/25 animate-pulse select-none">♦</div>
        <div className="absolute bottom-32 right-40 text-4xl text-[#D4AF37]/30 animate-bounce select-none">♣</div>
      </div>

      {/* Top Banner: Gameplay Paused Pill Box */}
      <motion.div
        variants={topBadgeVariants}
        className="relative z-10 flex items-center gap-4 bg-gradient-to-r from-black/95 via-[#1E190E]/95 to-black/95 border-2 border-amber-500/80 px-10 py-3.5 rounded-full shadow-[0_0_35px_rgba(245,158,11,0.4)] backdrop-blur-md will-change-[transform,opacity] metallic-sheen-sweep"
      >
        <AlertTriangle className="w-9 h-9 text-amber-400 animate-pulse shrink-0" />
        <span className="text-xl sm:text-2xl lg:text-3xl font-black font-outfit tracking-widest uppercase text-amber-300 whitespace-nowrap drop-shadow-[0_2px_12px_rgba(245,158,11,0.7)]">
          ⚠️ CURRENT GAMEPLAY IS TEMPORARILY PAUSED • RESUMES AT $500 POOL ⚠️
        </span>
        <AlertTriangle className="w-9 h-9 text-amber-400 animate-pulse shrink-0" />
      </motion.div>

      {/* Center Cinematic Stage: 3D Flipping Hero Card & Colossal Title */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center max-w-[1700px]">
        {/* Floating 3D Card with Automatic Flip showing Front (Ace) & Rear (Coasters Logo) */}
        <motion.div
          variants={heroCardEntranceVariants}
          className="relative [perspective:1400px] mb-6 will-change-[transform,opacity]"
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
                    y: [-16, 16, -16],
                    rotateY: isFlippedManual ? 180 : [-15, 15, -15],
                    rotateX: [6, -6, 6],
                    rotateZ: [-2, 2, -2],
                  }
            }
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-72 h-[410px] lg:w-80 lg:h-[450px] relative [transform-style:preserve-3d] cursor-pointer group"
          >
            {/* FRONT FACE: Golden Colossal Ace of Spades */}
            <div className="absolute inset-0 w-full h-full rounded-3xl p-1.5 bg-gradient-to-b from-[#FFE082] via-[#D4AF37] to-[#78540B] shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_60px_rgba(212,175,55,0.7)] [backface-visibility:hidden] metallic-sheen-sweep">
              <div className="w-full h-full rounded-[20px] bg-gradient-to-br from-[#1A1813] via-[#0E0E10] to-[#221D12] border-2 border-[#D4AF37] flex flex-col items-center justify-between p-4 relative overflow-hidden">
                {/* Specular Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />

                {/* Top Corner Indices */}
                <div className="w-full flex justify-between items-start leading-none font-outfit">
                  <div className="flex flex-col items-center text-[#F3E5AB]">
                    <span className="text-5xl font-black">A</span>
                    <span className="text-3xl text-[#D4AF37]">♠</span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-[#D4AF37] border-2 border-[#D4AF37]/60 px-2.5 py-1 rounded-lg bg-black/60 font-outfit uppercase tracking-wider">
                    ACE
                  </span>
                </div>

                {/* Center Giant Gilded Ace of Spades */}
                <div className="relative flex flex-col items-center justify-center my-auto">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-b from-[#D4AF37]/30 to-transparent border-2 border-[#D4AF37] flex items-center justify-center shadow-[0_0_45px_rgba(212,175,55,0.8)]">
                    <span className="text-8xl sm:text-9xl text-[#F3E5AB] drop-shadow-[0_0_30px_rgba(212,175,55,1)] leading-none select-none animate-pulse">
                      ♠
                    </span>
                  </div>
                </div>

                {/* Bottom Inverted Indices */}
                <div className="w-full flex justify-between items-end leading-none font-outfit rotate-180">
                  <div className="flex flex-col items-center text-[#F3E5AB]">
                    <span className="text-5xl font-black">A</span>
                    <span className="text-3xl text-[#D4AF37]">♠</span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-[#D4AF37]/80 font-outfit uppercase tracking-wider">
                    CHASE THE ACE
                  </span>
                </div>
              </div>
            </div>

            {/* REAR FACE: Official Coasters Tavern Deck Graphic */}
            <div className="absolute inset-0 w-full h-full rounded-3xl p-1.5 bg-gradient-to-b from-[#FFE082] via-[#D4AF37] to-[#78540B] shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_60px_rgba(212,175,55,0.7)] [backface-visibility:hidden] [transform:rotateY(180deg)] metallic-sheen-sweep">
              <div className="w-full h-full rounded-[20px] bg-gradient-to-br from-[#1C1912] via-[#0E0E10] to-[#252012] border-2 border-[#D4AF37] flex flex-col items-center justify-between p-4 relative overflow-hidden">
                <div className="w-full flex justify-between items-center text-sm font-black text-[#D4AF37] font-bebas">
                  <span>#CT-ACE</span>
                  <span className="text-lg">♠</span>
                </div>

                {/* Big Centered Coasters Logo */}
                <div className="flex flex-col items-center justify-center my-auto">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-black/90 border-2 border-[#D4AF37] p-2 shadow-[0_0_35px_rgba(212,175,55,0.8)] flex items-center justify-center overflow-hidden">
                    <img
                      src="./logo.png"
                      alt="Coasters Tavern"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-lg sm:text-xl font-black text-[#F3E5AB] tracking-widest uppercase font-outfit mt-2">
                    COASTERS TAVERN
                  </span>
                </div>

                <div className="w-full flex justify-between items-center text-sm font-black text-[#D4AF37] font-bebas rotate-180">
                  <span>#CT-ACE</span>
                  <span className="text-lg">♠</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Colossal Main Title: ♠ CHASE ♠ THE ♠ ACE ♠ */}
        <motion.div
          variants={titleVariants}
          className="flex flex-col items-center will-change-[transform,opacity]"
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[112px] font-black font-outfit tracking-wider uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF] via-[#FCE49E] to-[#D4AF37] drop-shadow-[0_10px_50px_rgba(212,175,55,0.9)] whitespace-nowrap flex items-center justify-center gap-3 sm:gap-6 my-2 animate-metallic-text">
            <span className="animate-spade-loop text-5xl sm:text-6xl lg:text-8xl">♠</span>
            <span>CHASE</span>
            <span className="animate-spade-loop text-5xl sm:text-6xl lg:text-8xl" style={{ animationDelay: "1.5s" }}>♠</span>
            <span>THE</span>
            <span className="animate-spade-loop text-5xl sm:text-6xl lg:text-8xl" style={{ animationDelay: "3s" }}>♠</span>
            <span>ACE</span>
            <span className="animate-spade-loop text-5xl sm:text-6xl lg:text-8xl" style={{ animationDelay: "4.5s" }}>♠</span>
          </h1>

          {/* High Impact Subtitle */}
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black font-outfit uppercase tracking-[0.25em] text-[#F3E5AB] mt-1 whitespace-nowrap drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
            FIND THE ACE OF SPADES • WIN THE CASH JACKPOT
          </p>
        </motion.div>
      </div>

      {/* Bottom Live Jackpot & Status Showcase */}
      <motion.div
        variants={bottomTilesVariants}
        className="relative z-10 w-full max-w-[1720px] grid grid-cols-3 gap-5 will-change-[transform,opacity]"
      >
        {/* Tile 1: Jackpot Pool */}
        <div className="bg-gradient-to-r from-[#1A1711]/95 to-[#0F0E0B]/95 border-2 border-[#D4AF37] rounded-2xl p-4 lg:p-5 flex items-center gap-4 lg:gap-5 shadow-[0_12px_35px_rgba(0,0,0,0.85)] backdrop-blur-md metallic-sheen-sweep min-w-0">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-[#D4AF37]/25 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <Flame className="w-10 h-10 lg:w-12 lg:h-12 text-amber-400 animate-pulse" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-lg lg:text-xl font-black text-amber-300 uppercase tracking-wider font-outfit whitespace-nowrap">
              {isGameplayPaused ? "CURRENT BUILDING POT" : "ACTIVE JACKPOT"}
            </span>
            <span className="text-5xl lg:text-6xl font-black font-bebas text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF] to-[#FCE49E] tracking-wider drop-shadow-[0_0_20px_rgba(212,175,55,0.6)] whitespace-nowrap leading-none mt-0.5 animate-metallic-text">
              ${jackpot.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-sm lg:text-base text-neutral-200 font-bold uppercase tracking-wider font-outfit mt-1 whitespace-nowrap">
              BUILDS +$100 EACH DRAW DATE
            </span>
          </div>
        </div>

        {/* Tile 2: Target / Resumption */}
        <div className="bg-gradient-to-r from-[#1A1711]/95 to-[#0F0E0B]/95 border-2 border-[#D4AF37] rounded-2xl p-4 lg:p-5 flex items-center gap-4 lg:gap-5 shadow-[0_12px_35px_rgba(0,0,0,0.85)] backdrop-blur-md metallic-sheen-sweep min-w-0">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-[#D4AF37]/25 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <Shield className="w-10 h-10 lg:w-12 lg:h-12 text-[#D4AF37]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-lg lg:text-xl font-black text-[#D4AF37] uppercase tracking-wider font-outfit whitespace-nowrap">
              GAMEPLAY RESUMPTION
            </span>
            <span className="text-5xl lg:text-6xl font-black font-bebas text-white tracking-wider whitespace-nowrap leading-none mt-0.5">
              ${targetJackpot}.00 POOL
            </span>
            <span className="text-sm lg:text-base text-neutral-200 font-bold uppercase tracking-wider font-outfit mt-1 whitespace-nowrap">
              RESUMES TUESDAY 13 OCT 2026
            </span>
          </div>
        </div>

        {/* Tile 3: Draw Mechanism & Locked Vault */}
        <div className="bg-gradient-to-r from-[#1A1711]/95 to-[#0F0E0B]/95 border-2 border-[#D4AF37] rounded-2xl p-4 lg:p-5 flex items-center gap-4 lg:gap-5 shadow-[0_12px_35px_rgba(0,0,0,0.85)] backdrop-blur-md metallic-sheen-sweep min-w-0">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-[#D4AF37]/25 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <Layers className="w-10 h-10 lg:w-12 lg:h-12 text-[#D4AF37]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-lg lg:text-xl font-black text-neutral-200 uppercase tracking-wider font-outfit whitespace-nowrap">
              DRAW PROCEDURE
            </span>
            <span className="text-5xl lg:text-6xl font-black font-bebas text-white tracking-wider whitespace-nowrap leading-none mt-0.5">
              LOCKED CARD VAULT
            </span>
            <span className="text-sm lg:text-base text-[#D4AF37] font-bold uppercase tracking-wider font-outfit mt-1 whitespace-nowrap">
              52 SEALED CARDS IN PLAY
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
