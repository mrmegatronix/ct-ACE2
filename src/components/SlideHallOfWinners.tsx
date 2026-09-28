import React from "react";
import type { WinnerRecord } from "../types";
import { Award, Crown, Sparkles, Star, ShieldCheck } from "lucide-react";

interface SlideHallOfWinnersProps {
  winners: WinnerRecord[];
}

export const SlideHallOfWinners: React.FC<SlideHallOfWinnersProps> = ({ winners }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between px-12 py-6 max-w-[1920px] mx-auto select-none relative overflow-hidden">
      {/* Header Container */}
      <div className="w-full max-w-[1500px] flex items-center justify-between border-b-2 border-[#D4AF37]/35 pb-5">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37]/30 to-[#F59E0B]/10 border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            <Crown className="w-9 h-9" />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5EDCE] to-[#D4AF37] uppercase drop-shadow-[0_0_20px_rgba(212,175,55,0.4)] whitespace-nowrap font-playfair">
              HALL OF MASTER ACE CHASERS
            </h2>
            <p className="text-sm text-neutral-400 font-bold tracking-widest uppercase mt-1 whitespace-nowrap font-outfit">
              HONOURING OUR OFFICIAL JACKPOT CHAMPIONS & CARD REVEALERS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-black/60 px-5 py-2.5 rounded-full border border-neutral-800">
          <Award className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider whitespace-nowrap">
            OFFICIAL RECORD ARCHIVE
          </span>
        </div>
      </div>

      {/* Main Winners Cards Showcase */}
      <div className="w-full max-w-[1500px] flex-1 flex flex-col justify-center gap-4 my-auto py-2">
        <div className="flex flex-col gap-4">
          {winners.map((winner, idx) => {
            const isChampion = winner.isRecentChampion;
            const isPlaceholder = winner.isPlaceholder;

            return (
              <div
                key={`${winner.drawDate}-${idx}`}
                className={`w-full flex items-center justify-between px-8 py-5 rounded-3xl border-2 transition-all shadow-[0_10px_35px_rgba(0,0,0,0.7)] ${
                  isChampion
                    ? "bg-gradient-to-r from-[#201C12]/95 via-[#151418]/95 to-[#0E0E12]/95 border-[#D4AF37] shadow-[0_0_35px_rgba(212,175,55,0.2)]"
                    : isPlaceholder
                    ? "bg-[#0E0E12]/70 border-neutral-800 border-dashed"
                    : "bg-[#121216]/90 border-[#D4AF37]/30 hover:border-[#D4AF37]/60"
                }`}
              >
                {/* Left: Medal Rank, Winner Name & Draw Info */}
                <div className="flex items-center gap-6 min-w-0">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 shadow-lg ${
                      isChampion
                        ? "bg-gradient-to-br from-[#FFE082] via-[#D4AF37] to-[#B38728] text-black shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                        : "bg-neutral-800/80 text-neutral-400 border border-neutral-700"
                    }`}
                  >
                    {isChampion ? "#1" : `♠`}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-3">
                      <h3
                        className={`text-3xl font-black tracking-wide uppercase whitespace-nowrap overflow-hidden text-ellipsis ${
                          isChampion ? "text-white" : "text-neutral-400"
                        }`}
                      >
                        {winner.winnerName}
                      </h3>
                      {isChampion && (
                        <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-[#D4AF37] px-3 py-0.5 rounded-full whitespace-nowrap">
                          <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                          RECENT $2,700 JACKPOT WINNER
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-1 whitespace-nowrap">
                      <span>DRAW DATE: <strong className="text-neutral-200">{winner.drawDate} ({winner.drawDay})</strong></span>
                      {winner.event > 0 && (
                        <>
                          <span>•</span>
                          <span>EVENT #{winner.event}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{winner.comment || `TICKET: ${winner.ticketNumber}`}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Card Drawn & Jackpot Amount */}
                <div className="flex items-center gap-8 shrink-0">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      {isChampion ? "WINNING CARD" : "STATUS"}
                    </span>
                    <div className="flex items-center gap-1.5 text-base font-black text-[#F3E5AB] uppercase bg-black/60 border border-neutral-800 px-3.5 py-1 rounded-xl mt-0.5 whitespace-nowrap">
                      <span className="text-[#D4AF37] text-lg font-serif">♠</span>
                      <span>{winner.cardDrawn}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end min-w-[200px]">
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                      {isChampion ? "JACKPOT PAID" : "POOL TARGET"}
                    </span>
                    <span
                      className={`text-5xl font-black font-bebas tracking-wide whitespace-nowrap ${
                        isChampion
                          ? "text-white drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                          : "text-neutral-400"
                      }`}
                    >
                      {winner.jackpotAmount}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Encouragement Banner */}
      <div className="w-full max-w-[1500px] bg-[#141310] border border-[#D4AF37]/30 rounded-2xl px-8 py-3.5 flex items-center justify-between text-xs font-bold text-neutral-300 uppercase tracking-wider">
        <div className="flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>Game play resumes when the building pot reaches $500 on Tuesday 13 October 2026!</span>
        </div>
        <div className="flex items-center gap-2 text-amber-300 font-black">
          <ShieldCheck className="w-4 h-4" />
          <span>BUILDING BY +$100 EACH DRAW DATE</span>
        </div>
      </div>
    </div>
  );
};
