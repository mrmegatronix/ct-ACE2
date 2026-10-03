import React, { useState } from "react";
import type { SignageData, GameCard, DrawTarget } from "../types";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Sparkles, Trophy, Layers, Lock } from "lucide-react";

interface SlideGameDeckProps {
  data: SignageData;
  drawTarget: DrawTarget;
}

const SHELVES_CONFIG = [
  { shelfNumber: 1, startCard: 1, endCard: 8 },
  { shelfNumber: 2, startCard: 9, endCard: 16 },
  { shelfNumber: 3, startCard: 17, endCard: 24 },
  { shelfNumber: 4, startCard: 25, endCard: 31 },
  { shelfNumber: 5, startCard: 32, endCard: 38 },
  { shelfNumber: 6, startCard: 39, endCard: 45 },
  { shelfNumber: 7, startCard: 46, endCard: 52 },
];

export const SlideGameDeck: React.FC<SlideGameDeckProps> = ({ data, drawTarget }) => {
  const [cardsState, setCardsState] = useState<GameCard[]>(data.cards);
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    setCardsState(data.cards);
  }, [data.cards]);

  const toggleFlip = (cardId: number) => {
    setCardsState((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: !c.isFlipped } : c))
    );
  };

  const getSuitSymbol = (cardName?: string) => {
    if (!cardName) return "♠";
    if (cardName.includes("Heart")) return "♥";
    if (cardName.includes("Diamond")) return "♦";
    if (cardName.includes("Club")) return "♣";
    return "♠";
  };

  const isRedSuit = (cardName?: string) => {
    if (!cardName) return false;
    return cardName.includes("Heart") || cardName.includes("Diamond");
  };

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
      scale: shouldReduceMotion ? 1 : 0.98,
      transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] as const },
    },
  };

  const leftPanelVariants: Variants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -35 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const rightPanelVariants: Variants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : 35 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const shelfRowVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : i * 0.05,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full h-full flex items-center justify-between gap-7 px-8 py-4 max-w-[1920px] mx-auto select-none will-change-[transform,opacity]"
    >
      {/* Left Area: 52-Card Sealed Deck on 7 Cabinet Shelves */}
      <motion.div
        variants={leftPanelVariants}
        className="flex-1 h-full flex flex-col justify-between bg-gradient-to-b from-[#141318]/95 via-[#0E0E12]/95 to-[#08080A]/95 border-2 border-[#D4AF37]/50 rounded-3xl p-5 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden will-change-[transform,opacity] metallic-sheen-sweep"
      >
        {/* Top Deck Subheader */}
        <div className="flex items-center justify-between border-b border-[#D4AF37]/25 pb-3 mb-2 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-black font-playfair tracking-wider text-white uppercase whitespace-nowrap">
                LOCKED CABINET DECK <span className="text-[#D4AF37]">♠ 52 SEALED CARDS</span>
              </h2>
              <p className="text-sm text-[#F3E5AB] font-bold tracking-widest uppercase whitespace-nowrap font-outfit">
                AUTHENTIC PLAYING CARDS MOUNTED IN LOCKED VENUE CABINET
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-lg font-black text-[#D4AF37] uppercase bg-black/80 px-5 py-2 rounded-xl border border-[#D4AF37]/60 whitespace-nowrap font-bebas tracking-widest shadow-md">
              <Lock className="w-4 h-4 text-[#D4AF37]" />
              52 CARDS SEALED • 0 DRAWN
            </span>
          </div>
        </div>

        {/* 52 Cards Cabinet */}
        <div className="flex-1 flex flex-col justify-between gap-1.5 py-1 min-h-0">
          {SHELVES_CONFIG.map((shelf, shelfIdx) => {
            const shelfCards = cardsState.slice(shelf.startCard - 1, shelf.endCard);

            return (
              <motion.div
                key={`shelf-${shelf.shelfNumber}`}
                custom={shelfIdx}
                variants={shelfRowVariants}
                initial="hidden"
                animate="visible"
                className="w-full flex items-center gap-3 bg-gradient-to-r from-black/80 via-[#181611]/60 to-black/80 rounded-xl px-3 py-1 border-b-2 border-[#D4AF37]/40 shadow-[0_4px_12px_rgba(0,0,0,0.85)] relative"
              >
                {/* Row Indicator Badge */}
                <div className="w-20 shrink-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#1C1A14] to-[#0A0A0C] border border-[#D4AF37]/60 rounded-lg py-1 px-1.5 shadow-md">
                  <span className="text-[10px] font-black text-neutral-400 uppercase font-outfit tracking-wider leading-none">
                    ROW
                  </span>
                  <span className="text-lg font-black text-[#F3E5AB] font-bebas leading-tight">
                    #{shelf.shelfNumber}
                  </span>
                </div>

                {/* Cards on this Shelf */}
                <div className="flex-1 flex items-center justify-between gap-2">
                  {shelfCards.map((card) => {
                    const suit = getSuitSymbol(card.drawnCardName);
                    const isRed = isRedSuit(card.drawnCardName);
                    const isAceOfSpades =
                      card.drawnCardName?.includes("Ace of Spades") ||
                      card.drawnCardName?.includes("Ace");

                    return (
                      <div
                        key={card.id}
                        onClick={() => toggleFlip(card.id)}
                        className="group relative cursor-pointer [perspective:800px] h-[78px] flex-1 max-w-[120px] will-change-[transform,opacity]"
                        title={`Card #${card.cardNumber}: Click to flip`}
                      >
                        <motion.div
                          animate={{ rotateY: card.isFlipped ? 180 : 0 }}
                          transition={{
                            duration: 0.5,
                            type: "spring",
                            stiffness: 280,
                            damping: 22,
                          }}
                          className="w-full h-full relative [transform-style:preserve-3d] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform"
                        >
                          {/* Card Back Face with Official Coasters Tavern Logo */}
                          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-lg border-2 border-[#D4AF37]/80 bg-gradient-to-br from-[#1E1B13] via-[#0E0E10] to-[#242013] flex flex-col items-center justify-between p-1 shadow-[inset_0_0_8px_rgba(212,175,55,0.35)] overflow-hidden">
                            {/* Top Card Index */}
                            <div className="w-full flex justify-between items-center text-[10px] font-black text-[#D4AF37] font-bebas px-0.5 leading-none">
                              <span>#{card.cardNumber}</span>
                              <span>♠</span>
                            </div>

                            {/* Centered Coasters Tavern Logo */}
                            <div className="relative flex flex-col items-center justify-center my-auto">
                              <div className="w-8 h-8 rounded-full bg-black/80 border border-[#D4AF37]/90 p-0.5 shadow-[0_0_8px_rgba(212,175,55,0.5)] flex items-center justify-center overflow-hidden">
                                <img
                                  src="./logo.png"
                                  alt="Coasters"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>

                            {/* Bottom Card Index */}
                            <div className="w-full flex justify-between items-center text-[10px] font-black text-[#D4AF37] font-bebas px-0.5 leading-none rotate-180">
                              <span>#{card.cardNumber}</span>
                              <span>♠</span>
                            </div>
                          </div>

                          {/* Card Front Face */}
                          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg border-2 border-white/80 bg-gradient-to-b from-[#FFFFFF] to-[#EAEAEA] flex flex-col items-center justify-between p-1 text-neutral-900 shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                            <div className="w-full flex justify-between items-start leading-none">
                              <div
                                className={`flex flex-col items-center leading-none ${
                                  isRed ? "text-red-600" : "text-black"
                                }`}
                              >
                                <span className="text-[10px] font-black">
                                  {isAceOfSpades ? "A" : card.cardNumber}
                                </span>
                                <span className="text-[9px]">{suit}</span>
                              </div>
                              <span className="text-[8px] uppercase font-bold text-neutral-500">
                                S#{shelf.shelfNumber}
                              </span>
                            </div>

                            <div className="flex flex-col items-center justify-center my-auto leading-none">
                              <span
                                className={`text-2xl font-serif ${
                                  isRed ? "text-red-600" : "text-neutral-950"
                                } drop-shadow-sm`}
                              >
                                {suit}
                              </span>
                              <span className="text-[9px] font-extrabold text-neutral-800 text-center leading-tight line-clamp-1 max-w-[65px]">
                                Card #{card.cardNumber}
                              </span>
                            </div>

                            <div className="w-full flex justify-between items-end leading-none rotate-180">
                              <div
                                className={`flex flex-col items-center leading-none ${
                                  isRed ? "text-red-600" : "text-black"
                                }`}
                              >
                                <span className="text-[10px] font-black">
                                  {isAceOfSpades ? "A" : card.cardNumber}
                                </span>
                                <span className="text-[9px]">{suit}</span>
                              </div>
                              <span className="text-[7px] font-semibold text-neutral-400">#CT</span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Tip Bar */}
        <div className="mt-1 pt-2 border-t border-[#D4AF37]/25 flex items-center justify-between text-base text-neutral-200 font-bold uppercase tracking-wider font-outfit shrink-0">
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
            Rear graphic displays Coasters Tavern logo • Click any card to inspect front face
          </span>
          <span className="text-[#D4AF37] font-black text-lg">
            RESUMES AT $500: {drawTarget.weekday.toUpperCase()} {data.resumeDateStr} ({drawTarget.timeStr})
          </span>
        </div>
      </motion.div>

      {/* Right Area: Jackpot Ticker & Real Rules */}
      <motion.div
        variants={rightPanelVariants}
        className="w-[520px] h-full flex flex-col justify-between gap-4 will-change-[transform,opacity]"
      >
        {/* Grand Building Pot Card */}
        <div className="bg-gradient-to-b from-[#1C1A14] via-[#121215] to-[#0A0A0A] border-2 border-[#D4AF37] rounded-3xl p-6 shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col items-center justify-center text-center relative overflow-hidden metallic-sheen-sweep">
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-[#F59E0B]/15 rounded-full blur-3xl pointer-events-none" />

          <span className="text-base uppercase font-black tracking-widest text-amber-300 font-outfit">
            CURRENT BUILDING JACKPOT
          </span>

          <div className="text-8xl lg:text-[100px] font-black tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF] via-[#FCE49E] to-[#D4AF37] drop-shadow-[0_0_35px_rgba(212,175,55,0.7)] my-0.5 font-bebas whitespace-nowrap animate-metallic-text leading-none">
            ${data.jackpot.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          <p className="text-lg font-black text-[#F3E5AB] uppercase tracking-wider whitespace-nowrap font-outfit mt-1">
            +$100 ADDED PER DRAW DATE • TARGET: ${data.targetJackpot}.00
          </p>

          {/* Building Progress Bar to $500 */}
          <div className="w-full mt-3 mb-2">
            <div className="flex justify-between text-sm font-black text-neutral-200 uppercase mb-1 font-outfit">
              <span>{progressPercent}% ACCUMULATED</span>
              <span className="text-[#D4AF37]">RESUMES AT $500 (13 OCT)</span>
            </div>
            <div className="w-full h-4 bg-black/80 rounded-full border border-neutral-700 overflow-hidden p-0.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.9)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent my-1.5" />

          <div className="w-full grid grid-cols-2 gap-3 mt-1">
            <div className="bg-black/70 border border-neutral-800 rounded-2xl p-3 flex flex-col items-center shadow-md metallic-sheen-sweep">
              <span className="text-sm uppercase font-extrabold text-neutral-300 font-outfit">
                ODDS OF WINNING
              </span>
              <span className="text-4xl font-black text-amber-400 mt-0.5 whitespace-nowrap font-bebas">
                {data.isGameplayPaused ? "0.00%" : data.winningChance}
              </span>
              <span className="text-xs text-[#D4AF37] uppercase font-bold tracking-wider">
                {data.isGameplayPaused ? "DRAWS PAUSED" : `1 in ${data.remainingCards}`}
              </span>
            </div>

            <div className="bg-black/70 border border-neutral-800 rounded-2xl p-3 flex flex-col items-center shadow-md metallic-sheen-sweep">
              <span className="text-sm uppercase font-extrabold text-neutral-300 font-outfit">
                CARDS IN PLAY
              </span>
              <span className="text-4xl font-black text-white mt-0.5 whitespace-nowrap font-bebas">
                {data.remainingCards} <small className="text-lg text-neutral-400 font-sans">/ 52</small>
              </span>
              <span className="text-xs text-neutral-300 uppercase font-bold tracking-wider">
                LOCKED CARD VAULT
              </span>
            </div>
          </div>
        </div>

        {/* Clean Official Rules Card */}
        <div className="flex-1 bg-gradient-to-b from-[#141418]/95 to-[#0E0E12]/95 border-2 border-[#D4AF37]/50 rounded-3xl p-5 flex flex-col justify-between shadow-2xl metallic-sheen-sweep">
          <div className="flex items-center gap-3 border-b border-[#D4AF37]/30 pb-2.5">
            <Trophy className="w-7 h-7 text-[#D4AF37]" />
            <h3 className="text-xl font-black font-playfair tracking-wider uppercase text-white whitespace-nowrap">
              CHASE THE ACE OFFICIAL RULES
            </h3>
          </div>

          <div className="space-y-2.5 my-auto text-base text-neutral-200 font-medium">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-[#D4AF37]/25 border border-[#D4AF37] text-[#D4AF37] font-black flex items-center justify-center shrink-0 text-sm">
                1
              </span>
              <p className="leading-snug">
                Jackpot builds by +$100 each Tuesday & Saturday until reaching the{" "}
                <strong className="text-white font-black">$500 minimum starting pool</strong>.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-[#D4AF37]/25 border border-[#D4AF37] text-[#D4AF37] font-black flex items-center justify-center shrink-0 text-sm">
                2
              </span>
              <p className="leading-snug">
                <strong className="text-amber-300 font-black">No card draws occur</strong> until the
                pot reaches $500 on{" "}
                <strong className="text-[#D4AF37] font-black">Tuesday, 13 October 2026</strong>.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-[#D4AF37]/25 border border-[#D4AF37] text-[#D4AF37] font-black flex items-center justify-center shrink-0 text-sm">
                3
              </span>
              <p className="leading-snug">
                When resumed, ticket holder draws a card manually from the{" "}
                <strong className="text-white font-black">locked venue cabinet</strong>. Finding the{" "}
                <strong className="text-[#D4AF37] font-black">Ace of Spades (♠)</strong> wins the jackpot!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
