import React from "react";
import type { WinnerRecord } from "../types";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Trophy, Star, Sparkles, ShieldCheck, Award } from "lucide-react";

interface SlideHallOfWinnersProps {
  winners: WinnerRecord[];
}

export const SlideHallOfWinners: React.FC<SlideHallOfWinnersProps> = ({ winners }) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.09,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
    exit: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.96,
      transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] as const },
    },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : -25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const rowVariants: Variants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -35 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : i * 0.08,
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  const footerVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
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
      className="w-full h-full flex flex-col justify-between px-10 py-5 max-w-[1920px] mx-auto select-none will-change-[transform,opacity]"
    >
      {/* Header Banner */}
      <motion.div
        variants={headerVariants}
        className="flex items-center justify-between border-b-2 border-[#D4AF37]/35 pb-4 will-change-[transform,opacity]"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/25 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-4xl lg:text-5xl font-black font-playfair tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF] via-[#FCE49E] to-[#D4AF37] uppercase whitespace-nowrap animate-metallic-text">
              HALL OF MASTER ACE CHASERS
            </h2>
            <p className="text-lg text-neutral-300 font-bold tracking-widest uppercase mt-0.5 whitespace-nowrap font-outfit">
              HONOURING OUR OFFICIAL JACKPOT CHAMPIONS & CARD REVEALERS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-black/80 px-6 py-3 rounded-full border-2 border-[#D4AF37]/60 shadow-md metallic-sheen-sweep">
          <Award className="w-7 h-7 text-[#D4AF37] animate-pulse" />
          <span className="text-base font-black text-[#F3E5AB] uppercase tracking-wider whitespace-nowrap font-outfit">
            OFFICIAL RECORD ARCHIVE
          </span>
        </div>
      </motion.div>

      {/* Main Winners Cards Showcase */}
      <div className="w-full max-w-[1550px] flex-1 flex flex-col justify-center gap-5 my-auto py-2">
        <div className="flex flex-col gap-5">
          {winners.map((winner, idx) => {
            const isChampion = winner.isRecentChampion;
            const isPlaceholder = winner.isPlaceholder;

            return (
              <motion.div
                key={`${winner.drawDate}-${idx}`}
                custom={idx}
                variants={rowVariants}
                className={`w-full flex items-center justify-between px-10 py-6 rounded-3xl border-2 transition-all shadow-[0_12px_40px_rgba(0,0,0,0.85)] will-change-[transform,opacity] metallic-sheen-sweep ${
                  isChampion
                    ? "bg-gradient-to-r from-[#201C12]/95 via-[#151418]/95 to-[#0E0E12]/95 border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.35)]"
                    : isPlaceholder
                    ? "bg-[#0E0E12]/80 border-neutral-700 border-dashed"
                    : "bg-[#121216]/95 border-[#D4AF37]/40 hover:border-[#D4AF37]/80"
                }`}
              >
                {/* Left: Medal Rank, Winner Name & Draw Info */}
                <div className="flex items-center gap-8 min-w-0 flex-1 pr-6">
                  <div
                    className={`w-22 h-22 rounded-2xl flex items-center justify-center font-black text-4xl shrink-0 shadow-lg ${
                      isChampion
                        ? "bg-gradient-to-br from-[#FFE082] via-[#D4AF37] to-[#B38728] text-black shadow-[0_0_25px_rgba(212,175,55,0.6)] font-bebas"
                        : "bg-neutral-800 text-neutral-300 border-2 border-neutral-700 font-bebas text-4xl"
                    }`}
                  >
                    {isChampion ? "#1" : `♠`}
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-4">
                      <h3
                        className={`text-4xl lg:text-5xl font-black tracking-wide uppercase whitespace-nowrap overflow-hidden text-ellipsis font-playfair ${
                          isChampion ? "text-white" : "text-neutral-200"
                        }`}
                      >
                        {winner.winnerName}
                      </h3>
                      {isChampion && (
                        <span className="flex items-center gap-2 text-base font-black uppercase tracking-wider bg-[#D4AF37]/25 border-2 border-[#D4AF37] text-[#F3E5AB] px-5 py-2 rounded-full whitespace-nowrap font-outfit shrink-0 shadow-md animate-pulse">
                          <Star className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                          RECENT $2,700 JACKPOT WINNER
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xl font-bold text-neutral-300 uppercase tracking-wider mt-2 whitespace-nowrap font-outfit">
                      <span>
                        DRAW:{" "}
                        <strong className="text-white font-black">
                          {winner.drawDate} ({winner.drawDay})
                        </strong>
                      </span>
                      {winner.event > 0 && (
                        <>
                          <span className="text-[#D4AF37]">•</span>
                          <span className="text-white font-black">EVENT #{winner.event}</span>
                        </>
                      )}
                      <span className="text-[#D4AF37]">•</span>
                      <span className="text-[#F3E5AB] font-black">
                        {winner.comment || `TICKET: ${winner.ticketNumber}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Card Drawn & Jackpot Amount */}
                <div className="flex items-center gap-8 shrink-0">
                  <div className="flex flex-col items-end min-w-[210px]">
                    <span className="text-base font-black text-neutral-300 uppercase tracking-wider font-outfit">
                      {isChampion ? "WINNING CARD" : "STATUS"}
                    </span>
                    <div className="flex items-center gap-2 text-3xl font-black text-[#F3E5AB] uppercase bg-black/80 border-2 border-[#D4AF37]/70 px-6 py-2.5 rounded-xl mt-1 whitespace-nowrap font-outfit shadow-md">
                      <span className="text-[#D4AF37] text-3xl font-serif leading-none">♠</span>
                      <span>{winner.cardDrawn}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end min-w-[240px]">
                    <span className="text-base font-black text-[#D4AF37] uppercase tracking-wider font-outfit">
                      {isChampion ? "JACKPOT PAID" : "POOL TARGET"}
                    </span>
                    <span
                      className={`text-8xl font-black font-bebas tracking-wide whitespace-nowrap leading-none mt-1 ${
                        isChampion
                          ? "text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF] via-[#FCE49E] to-[#D4AF37] drop-shadow-[0_0_25px_rgba(212,175,55,0.7)] animate-metallic-text"
                          : "text-neutral-400"
                      }`}
                    >
                      {winner.jackpotAmount}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Encouragement Banner */}
      <motion.div
        variants={footerVariants}
        className="w-full max-w-[1550px] bg-gradient-to-r from-[#171510]/95 to-[#0E0E12]/95 border-2 border-[#D4AF37]/50 rounded-2xl px-8 py-4 flex items-center justify-between text-lg font-black text-neutral-200 uppercase tracking-wider font-outfit will-change-[transform,opacity] metallic-sheen-sweep"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[#D4AF37] animate-pulse" />
          <span>
            Game play resumes when the building pot reaches $500 on Tuesday 13 October 2026!
          </span>
        </div>
        <div className="flex items-center gap-2 text-amber-300 font-black">
          <ShieldCheck className="w-6 h-6 text-amber-400" />
          <span>BUILDING BY +$100 EACH DRAW DATE</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
