import React, { useState } from "react";
import type { SignageData, GameCard, DrawTarget } from "../types";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Lock, Sparkles, Layers } from "lucide-react";

interface SlideCardCabinetProps {
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

export const SlideCardCabinet: React.FC<SlideCardCabinetProps> = ({ data, drawTarget }) => {
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
      },
    },
    exit: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.98,
      transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] as const },
    },
  };

  const shelfRowVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : i * 0.04,
        duration: 0.45,
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
      className="w-full h-full flex flex-col justify-between px-10 py-5 max-w-[1920px] mx-auto select-none will-change-[transform,opacity]"
    >
      {/* Top Cabinet Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#181612]/95 via-[#121114]/95 to-[#181612]/95 border-2 border-[#D4AF37]/60 rounded-2xl px-8 py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] shrink-0 metallic-sheen-sweep">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-4xl lg:text-5xl font-black font-outfit tracking-wider text-white uppercase whitespace-nowrap">
              LOCKED VENUE CABINET <span className="text-[#D4AF37]">♠ 7 SHELVES (52 CARDS)</span>
            </h2>
            <p className="text-xl text-[#F3E5AB] font-black tracking-widest uppercase whitespace-nowrap font-outfit mt-0.5">
              52 SEALED PLAYING CARDS MOUNTED ACROSS 7 PHYSICAL CABINET SHELVES
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-3 text-2xl font-black text-[#D4AF37] uppercase bg-black/85 px-6 py-2.5 rounded-xl border-2 border-[#D4AF37] whitespace-nowrap font-bebas tracking-widest shadow-[0_0_25px_rgba(212,175,55,0.35)]">
            <Lock className="w-6 h-6 text-[#D4AF37]" />
            52 CARDS IN PLAY • 0 DRAWN
          </span>
        </div>
      </div>

      {/* 7 Cabinet Shelves Container */}
      <div className="flex-1 flex flex-col justify-between gap-2 py-3 min-h-0">
        {SHELVES_CONFIG.map((shelf, shelfIdx) => {
          const shelfCards = cardsState.slice(shelf.startCard - 1, shelf.endCard);

          return (
            <motion.div
              key={`shelf-${shelf.shelfNumber}`}
              custom={shelfIdx}
              variants={shelfRowVariants}
              className="flex items-center gap-4 bg-gradient-to-r from-[#171510]/95 via-[#121216]/95 to-[#171510]/95 border border-[#D4AF37]/40 rounded-xl px-5 py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.6)] relative overflow-hidden flex-1 metallic-sheen-sweep"
            >
              {/* Shelf Index Indicator Badge */}
              <div className="flex flex-col items-center justify-center w-24 shrink-0 bg-black/80 border border-[#D4AF37]/60 rounded-lg py-1 px-2 shadow-inner">
                <span className="text-xs font-black text-amber-300 font-outfit tracking-widest uppercase">
                  SHELF
                </span>
                <span className="text-3xl font-black text-[#F3E5AB] font-bebas leading-none">
                  #{shelf.shelfNumber}
                </span>
              </div>

              {/* Cards Row on this Shelf */}
              <div className="flex-1 flex items-center justify-center gap-3.5 h-full">
                {shelfCards.map((card) => {
                  const suit = getSuitSymbol(card.drawnCardName);
                  const isRed = isRedSuit(card.drawnCardName);
                  const isAceOfSpades =
                    card.drawnCardName?.toLowerCase().includes("ace") &&
                    card.drawnCardName?.toLowerCase().includes("spade");

                  return (
                    <div
                      key={card.id}
                      onClick={() => toggleFlip(card.id)}
                      className="flex-1 max-w-[170px] h-full min-h-[78px] [perspective:1000px] cursor-pointer group"
                      title={`Card #${card.cardNumber} (Shelf ${shelf.shelfNumber})`}
                    >
                      <motion.div
                        className="w-full h-full relative [transform-style:preserve-3d] transition-transform duration-500 rounded-xl"
                        animate={{ rotateY: card.isFlipped ? 180 : 0 }}
                      >
                        {/* CARD REAR FACE: Official Coasters Logo + Gold Border + Corner Badges */}
                        <div className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-b from-[#FFE082] via-[#D4AF37] to-[#78540B] p-[2px] shadow-[0_4px_12px_rgba(0,0,0,0.8)] [backface-visibility:hidden] flex flex-col justify-between overflow-hidden group-hover:scale-[1.03] transition-transform metallic-sheen-sweep">
                          <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-[#1C1A14] via-[#0E0E10] to-[#221F18] border border-[#D4AF37]/60 flex flex-col items-center justify-between p-1.5 relative overflow-hidden">
                            {/* Top Corner Badge */}
                            <div className="w-full flex justify-between items-center leading-none">
                              <span className="text-base font-black text-[#F3E5AB] font-bebas tracking-wide">
                                #{card.cardNumber}
                              </span>
                              <span className="text-xs text-[#D4AF37] font-bold">♠</span>
                            </div>

                            {/* Centered Coasters Tavern Logo */}
                            <div className="flex items-center justify-center my-auto">
                              <div className="w-11 h-11 rounded-full bg-black/90 border border-[#D4AF37] p-0.5 shadow-[0_0_12px_rgba(212,175,55,0.7)] flex items-center justify-center overflow-hidden">
                                <img
                                  src="./logo.png"
                                  alt="Coasters"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>

                            {/* Bottom Corner Badge */}
                            <div className="w-full flex justify-between items-center leading-none rotate-180">
                              <span className="text-base font-black text-[#F3E5AB] font-bebas tracking-wide">
                                #{card.cardNumber}
                              </span>
                              <span className="text-xs text-[#D4AF37] font-bold">♠</span>
                            </div>
                          </div>
                        </div>

                        {/* CARD FRONT FACE: Revealed Card Face */}
                        <div className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-b from-[#FDFDFD] to-[#EDEDED] border-2 border-neutral-300 p-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.7)] [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between">
                          <div className="w-full flex justify-between items-start leading-none">
                            <div
                              className={`flex flex-col items-center leading-none ${
                                isRed ? "text-red-600" : "text-black"
                              }`}
                            >
                              <span className="text-lg font-black font-bebas">
                                {isAceOfSpades ? "A" : card.cardNumber}
                              </span>
                              <span className="text-sm">{suit}</span>
                            </div>
                            <span className="text-[10px] font-bold text-neutral-400">#CT</span>
                          </div>

                          <div className="flex flex-col items-center justify-center my-auto">
                            <span
                              className={`text-3xl ${
                                isRed ? "text-red-600" : "text-black"
                              } ${isAceOfSpades ? "drop-shadow-[0_0_12px_rgba(212,175,55,1)] animate-bounce text-4xl" : ""}`}
                            >
                              {suit}
                            </span>
                          </div>

                          <div className="w-full flex justify-between items-end leading-none rotate-180">
                            <div
                              className={`flex flex-col items-center leading-none ${
                                isRed ? "text-red-600" : "text-black"
                              }`}
                            >
                              <span className="text-lg font-black font-bebas">
                                {isAceOfSpades ? "A" : card.cardNumber}
                              </span>
                              <span className="text-sm">{suit}</span>
                            </div>
                            <span className="text-[10px] font-bold text-neutral-400">#CT</span>
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

      {/* Bottom Information Footer */}
      <div className="bg-gradient-to-r from-black/90 via-[#1C1A14]/90 to-black/90 border-2 border-[#D4AF37]/50 rounded-2xl px-8 py-3.5 flex items-center justify-between text-xl text-neutral-200 font-black uppercase tracking-wider font-outfit shrink-0 metallic-sheen-sweep">
        <span className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[#D4AF37] animate-pulse" />
          52 AUTHENTIC PLAYING CARDS SEALED IN NUMBERED ENVELOPES • WINNER CHOOSES 1 CARD ON DRAW NIGHT
        </span>
        <span className="text-[#D4AF37] font-black text-2xl">
          RESUMES AT $500 POOL: {drawTarget.weekday.toUpperCase()} {data.resumeDateStr} ({drawTarget.timeStr})
        </span>
      </div>
    </motion.div>
  );
};
