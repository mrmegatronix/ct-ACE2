import React, { useState } from "react";
import type { SignageData, GameCard, DrawTarget } from "../types";
import { motion } from "framer-motion";
import { Sparkles, Trophy, Flame, Layers, AlertTriangle } from "lucide-react";

interface SlideGameDeckProps {
  data: SignageData;
  drawTarget: DrawTarget;
}

export const SlideGameDeck: React.FC<SlideGameDeckProps> = ({ data, drawTarget }) => {
  const [cardsState, setCardsState] = useState<GameCard[]>(data.cards);

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

  return (
    <div className="w-full h-full flex items-center justify-between gap-8 px-10 py-6 max-w-[1920px] mx-auto select-none">
      {/* Left Area: 52-Card Sealed Deck (13 cols x 4 rows) */}
      <div className="flex-1 h-full flex flex-col justify-between bg-[#111114]/85 border border-[#D4AF37]/35 rounded-3xl p-6 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Top Deck Subheader */}
        <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-widest text-white uppercase whitespace-nowrap">
                SEALED GAME DECK <span className="text-[#D4AF37]">♠ 52 CARDS</span>
              </h2>
              <p className="text-xs text-neutral-400 font-semibold tracking-wider uppercase whitespace-nowrap">
                {data.isGameplayPaused
                  ? "GAME PLAY PAUSED • VENUE LOCKED CABINET SEALED UNTIL JACKPOT HITS $500 (13 OCT)"
                  : "MANUAL DRAW FROM LOCKED VENUE CABINET • FIND THE ACE OF SPADES TO WIN"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-neutral-300 uppercase bg-black/60 px-3 py-1.5 rounded-lg border border-neutral-700 whitespace-nowrap">
              Remaining: <strong className="text-[#D4AF37] font-black text-sm">{data.remainingCards}</strong> / 52
            </span>
            <span className="text-xs font-bold text-neutral-300 uppercase bg-black/60 px-3 py-1.5 rounded-lg border border-neutral-700 whitespace-nowrap">
              Drawn: <strong className="text-[#F3E5AB] font-black text-sm">{data.flippedCards}</strong>
            </span>
          </div>
        </div>

        {/* 52 Cards Grid (13 cols x 4 rows) */}
        <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-2.5 flex-1 content-center items-center justify-center py-2">
          {cardsState.map((card) => {
            const suit = getSuitSymbol(card.drawnCardName);
            const isRed = isRedSuit(card.drawnCardName);
            const isAceOfSpades = card.drawnCardName?.includes("Ace of Spades") || card.drawnCardName?.includes("Ace");

            return (
              <div
                key={card.id}
                onClick={() => toggleFlip(card.id)}
                className="group relative cursor-pointer [perspective:1000px] h-[142px] w-full"
                title={`Card #${card.cardNumber}: Click to flip`}
              >
                <motion.div
                  animate={{ rotateY: card.isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                  className="w-full h-full relative [transform-style:preserve-3d] rounded-xl shadow-[0_6px_16px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform"
                >
                  {/* Card Back Face */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-xl border-2 border-[#D4AF37]/70 bg-gradient-to-br from-[#1C1A14] via-[#0E0E10] to-[#252216] flex flex-col items-center justify-between p-1.5 shadow-[inset_0_0_12px_rgba(212,175,55,0.25)]">
                    <div className="w-full flex justify-between items-center text-[10px] font-bold text-[#D4AF37]/80">
                      <span>#{card.cardNumber}</span>
                      <span>♠</span>
                    </div>

                    <div className="relative flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/50 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                        <span className="text-xl text-[#D4AF37] font-serif leading-none">♠</span>
                      </div>
                      <span className="text-[11px] font-black text-[#F3E5AB] tracking-widest mt-1">
                        #{card.cardNumber}
                      </span>
                    </div>

                    <div className="w-full flex justify-between items-center text-[10px] font-bold text-[#D4AF37]/80 rotate-180">
                      <span>#{card.cardNumber}</span>
                      <span>♠</span>
                    </div>
                  </div>

                  {/* Card Front Face */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl border-2 border-white/80 bg-gradient-to-b from-[#FDFDFD] to-[#EDEDED] flex flex-col items-center justify-between p-2 text-neutral-900 shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                    <div className="w-full flex justify-between items-start leading-none">
                      <div className={`flex flex-col items-center ${isRed ? "text-red-600" : "text-black"}`}>
                        <span className="text-xs font-black">
                          {isAceOfSpades ? "A" : card.cardNumber}
                        </span>
                        <span className="text-xs">{suit}</span>
                      </div>
                      <span className="text-[9px] uppercase font-bold text-neutral-500">SEALED</span>
                    </div>

                    <div className="flex flex-col items-center justify-center my-auto">
                      <span className={`text-3xl font-serif ${isRed ? "text-red-600" : "text-neutral-950"} drop-shadow-sm`}>
                        {suit}
                      </span>
                      <span className="text-[10px] font-bold text-neutral-800 text-center leading-tight mt-0.5 line-clamp-1 max-w-[70px]">
                        Card #{card.cardNumber}
                      </span>
                    </div>

                    <div className="w-full flex justify-between items-end leading-none rotate-180">
                      <div className={`flex flex-col items-center ${isRed ? "text-red-600" : "text-black"}`}>
                        <span className="text-xs font-black">
                          {isAceOfSpades ? "A" : card.cardNumber}
                        </span>
                        <span className="text-xs">{suit}</span>
                      </div>
                      <span className="text-[8px] font-semibold text-neutral-400">#CT</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Bottom Tip Bar */}
        <div className="mt-2 pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs text-neutral-400 font-semibold uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            Physical cards drawn manually from locked venue cabinet • Click/Touch to inspect
          </span>
          <span className="text-[#D4AF37] font-bold">
            RESUMES AT $500: {drawTarget.weekday.toUpperCase()} {data.resumeDateStr} ({drawTarget.timeStr})
          </span>
        </div>
      </div>

      {/* Right Area: Jackpot Ticker & Real Rules */}
      <div className="w-[520px] h-full flex flex-col justify-between gap-5">
        <div className="bg-gradient-to-b from-[#1C1A14] via-[#121215] to-[#0A0A0A] border-2 border-[#D4AF37] rounded-3xl p-8 shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-[#F59E0B]/15 rounded-full blur-3xl pointer-events-none" />

          {data.isGameplayPaused ? (
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-amber-300 uppercase bg-amber-950/80 border border-amber-500/60 px-4 py-1.5 rounded-full mb-2 shadow-[0_0_15px_rgba(245,158,11,0.2)] animate-pulse whitespace-nowrap">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              NO DRAW UNTIL JACKPOT HITS $500
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-4 py-1.5 rounded-full mb-3 shadow-[0_0_15px_rgba(212,175,55,0.15)] whitespace-nowrap">
              <Flame className="w-4 h-4 text-[#F59E0B] animate-pulse" />
              OFFICIAL PRIZE POOL
            </div>
          )}

          <span className="text-xs uppercase font-extrabold tracking-widest text-neutral-300 mt-1 whitespace-nowrap font-outfit">
            BUILDING POT (TOMORROW: $100)
          </span>

          <div className="text-8xl font-black tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FFF] via-[#FCE49E] to-[#D4AF37] drop-shadow-[0_0_30px_rgba(212,175,55,0.6)] my-2 font-bebas whitespace-nowrap">
            ${data.jackpot.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          <p className="text-sm font-bold text-amber-300 uppercase tracking-wider whitespace-nowrap font-outfit">
            +$100 ADDED PER DRAW DATE • TARGET: ${data.targetJackpot}.00
          </p>

          {/* Building Progress Bar to $500 */}
          <div className="w-full mt-4 mb-2">
            <div className="flex justify-between text-[11px] font-bold text-neutral-400 uppercase mb-1">
              <span>Building to $500</span>
              <span className="text-[#D4AF37] font-mono">{progressPercent}% (${data.jackpot} / ${data.targetJackpot})</span>
            </div>
            <div className="w-full h-3 bg-black/60 rounded-full border border-neutral-800 overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(212,175,55,0.8)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent my-3" />

          <div className="w-full grid grid-cols-2 gap-3">
            <div className="bg-black/50 border border-neutral-800 rounded-xl p-3 flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400">WINNING CHANCE</span>
              <span className="text-2xl font-black text-amber-400 mt-0.5 whitespace-nowrap">
                {data.isGameplayPaused ? "0.00%" : data.winningChance}
              </span>
              <span className="text-[10px] text-neutral-400 uppercase">
                {data.isGameplayPaused ? "PAUSED" : `1 in ${data.remainingCards}`}
              </span>
            </div>

            <div className="bg-black/50 border border-neutral-800 rounded-xl p-3 flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400">CARDS REMAINING</span>
              <span className="text-2xl font-black text-white mt-0.5 whitespace-nowrap">
                {data.remainingCards} <small className="text-xs text-neutral-400">/ 52</small>
              </span>
              <span className="text-[10px] text-neutral-400 uppercase">0 Flipped</span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[#121215]/90 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
            <Trophy className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-base font-black tracking-wider uppercase text-white whitespace-nowrap">
              CHASE THE ACE RULES
            </h3>
          </div>

          <div className="space-y-2.5 my-auto text-xs text-neutral-300 font-medium">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] font-bold flex items-center justify-center shrink-0 text-[10px]">
                1
              </span>
              <p className="leading-snug">
                Jackpot builds by +$100 each Tuesday & Saturday until reaching the <strong className="text-white">$500 minimum starting pool</strong>.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] font-bold flex items-center justify-center shrink-0 text-[10px]">
                2
              </span>
              <p className="leading-snug">
                <strong className="text-amber-300">No card draws occur</strong> until the pot reaches $500 on <strong className="text-[#D4AF37]">Tuesday, 13 October 2026</strong>.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] font-bold flex items-center justify-center shrink-0 text-[10px]">
                3
              </span>
              <p className="leading-snug">
                When resumed, ticket holder draws a card manually from the <strong className="text-white">locked venue cabinet</strong>. Finding the <strong className="text-[#D4AF37]">Ace of Spades (♠)</strong> wins the jackpot!
              </p>
            </div>
          </div>

          <div className="bg-[#1C1A14] border border-[#D4AF37]/30 rounded-xl p-3 text-center">
            <span className="text-[11px] font-black text-[#F3E5AB] uppercase tracking-wider">
              {data.comment}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
