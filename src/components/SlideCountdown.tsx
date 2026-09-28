import React, { useState, useEffect } from "react";
import { getCountdown } from "../services/nzTime";
import type { CountdownState } from "../types";
import { Calendar, AlertTriangle, ShieldCheck } from "lucide-react";

interface SlideCountdownProps {
  jackpot: number;
  targetJackpot: number;
  isGameplayPaused: boolean;
  resumeDateStr: string;
}

export const SlideCountdown: React.FC<SlideCountdownProps> = ({
  jackpot,
  targetJackpot,
  isGameplayPaused,
  resumeDateStr,
}) => {
  const [countdown, setCountdown] = useState<CountdownState>(
    getCountdown(new Date(), isGameplayPaused)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(new Date(), isGameplayPaused));
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameplayPaused]);

  const format2 = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-12 py-6 max-w-[1920px] mx-auto select-none relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute w-[800px] h-[800px] rounded-full border border-[#D4AF37]/10 pointer-events-none animate-[spin_120s_linear_infinite]" />
      <div className="absolute w-[600px] h-[600px] rounded-full border border-[#D4AF37]/20 pointer-events-none" />

      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-[1500px] bg-gradient-to-b from-[#141418]/90 via-[#0D0D10]/95 to-[#08080A]/95 border-2 border-[#D4AF37] rounded-[36px] p-12 flex flex-col items-center text-center shadow-[0_0_80px_rgba(212,175,55,0.22)] relative overflow-hidden">
        {/* Top Metallic Gold Glow Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_20px_#D4AF37]" />

        {/* Warning / Status Banner */}
        {isGameplayPaused ? (
          <div className="flex items-center gap-3 bg-amber-950/80 border border-amber-500/80 px-6 py-2 rounded-full mb-6 shadow-[0_0_25px_rgba(245,158,11,0.25)] animate-pulse">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span className="text-base font-black tracking-widest text-amber-200 uppercase whitespace-nowrap">
              GAME PLAY CURRENTLY PAUSED • NO DRAW UNTIL JACKPOT HITS ${targetJackpot}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-[#1C1A14] border border-[#D4AF37]/50 px-6 py-2 rounded-full mb-6 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <Calendar className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-base font-black tracking-widest text-[#F3E5AB] uppercase whitespace-nowrap">
              OFFICIAL NEXT DRAW: {countdown.target.weekday.toUpperCase()} AT {countdown.target.timeStr} NZDT
            </span>
          </div>
        )}

        <h2 className="text-5xl font-black tracking-wider uppercase text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] whitespace-nowrap font-playfair">
          {isGameplayPaused ? "GAME PLAY RESUMES IN" : "DRAW STARTS IN"}
        </h2>

        <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mt-2 whitespace-nowrap font-outfit">
          TARGET: TUESDAY {resumeDateStr} AT 5:30 PM NZDT (GAME START ${targetJackpot})
        </p>

        {/* Countdown Display with BLINKING COLONS */}
        <div className="flex items-center justify-center gap-4 my-8">
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-40 bg-gradient-to-b from-[#221F18] to-[#12110D] border-2 border-[#D4AF37]/60 rounded-3xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(212,175,55,0.15)]">
              <span className="text-9xl font-normal font-bebas text-transparent bg-clip-text bg-gradient-to-b from-white to-[#E2E8F0] drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] leading-none pt-2">
                {format2(countdown.days)}
              </span>
            </div>
            <span className="text-xs font-black tracking-widest uppercase text-[#D4AF37] mt-3 font-outfit">
              DAYS
            </span>
          </div>

          {/* Blinking Colon 1 */}
          <div className="text-7xl font-bold text-[#D4AF37] animate-[pulse_1s_infinite] pb-8 select-none font-bebas">
            :
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-40 bg-gradient-to-b from-[#221F18] to-[#12110D] border-2 border-[#D4AF37]/60 rounded-3xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(212,175,55,0.15)]">
              <span className="text-9xl font-normal font-bebas text-transparent bg-clip-text bg-gradient-to-b from-white to-[#E2E8F0] drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] leading-none pt-2">
                {format2(countdown.hours)}
              </span>
            </div>
            <span className="text-xs font-black tracking-widest uppercase text-[#D4AF37] mt-3 font-outfit">
              HOURS
            </span>
          </div>

          {/* Blinking Colon 2 */}
          <div className="text-7xl font-bold text-[#D4AF37] animate-[pulse_1s_infinite] pb-8 select-none font-bebas">
            :
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-40 bg-gradient-to-b from-[#221F18] to-[#12110D] border-2 border-[#D4AF37]/60 rounded-3xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(212,175,55,0.15)]">
              <span className="text-9xl font-normal font-bebas text-transparent bg-clip-text bg-gradient-to-b from-white to-[#E2E8F0] drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] leading-none pt-2">
                {format2(countdown.minutes)}
              </span>
            </div>
            <span className="text-xs font-black tracking-widest uppercase text-[#D4AF37] mt-3 font-outfit">
              MINUTES
            </span>
          </div>

          {/* Blinking Colon 3 */}
          <div className="text-7xl font-bold text-[#D4AF37] animate-[pulse_1s_infinite] pb-8 select-none font-bebas">
            :
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-40 bg-gradient-to-b from-[#262013] to-[#151208] border-2 border-[#D4AF37] rounded-3xl flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.35),inset_0_0_25px_rgba(212,175,55,0.2)]">
              <span className="text-9xl font-normal font-bebas text-transparent bg-clip-text bg-gradient-to-b from-[#FFF] to-[#FCE49E] drop-shadow-[0_0_30px_rgba(212,175,55,0.7)] leading-none pt-2">
                {format2(countdown.seconds)}
              </span>
            </div>
            <span className="text-xs font-black tracking-widest uppercase text-[#F3E5AB] mt-3 font-outfit">
              SECONDS
            </span>
          </div>
        </div>

        {/* Footer Info */}
        <div className="w-full flex items-center justify-between border-t border-[#D4AF37]/30 pt-6 mt-4">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-black text-white uppercase tracking-wider whitespace-nowrap">
                POT BUILDS TO ${jackpot} TOMORROW (TUESDAY 29 SEPT)
              </h4>
              <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider whitespace-nowrap">
                +$100 ADDED AFTER EVERY DRAW DATE UNTIL THE $500 STARTING POOL IS REACHED
              </p>
            </div>
          </div>

          {/* Building Pot Badge */}
          <div className="flex items-center gap-4 bg-gradient-to-r from-[#1E1B13] to-[#141418] border border-[#D4AF37] px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.25)]">
            <span className="text-xs font-black tracking-widest uppercase text-amber-300">
              BUILDING POT:
            </span>
            <span className="text-4xl font-black font-mono text-white drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] whitespace-nowrap">
              ${jackpot.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-neutral-400 font-bold uppercase">
              / ${targetJackpot}.00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
