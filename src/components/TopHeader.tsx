import React, { useState, useEffect } from "react";
import { getNzClockParts } from "../services/nzTime";
import type { DrawTarget } from "../types";
import { Badge } from "./ui/badge";

interface TopHeaderProps {
  jackpot: number;
  targetJackpot: number;
  isGameplayPaused: boolean;
  resumeDateStr: string;
  drawTarget: DrawTarget;
  activeSlideIndex: number;
  totalSlides: number;
  isPaused: boolean;
  isLocked: boolean;
  currentDurationSec: number;
  onLogoClick?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  jackpot,
  targetJackpot,
  isGameplayPaused,
  resumeDateStr,
  activeSlideIndex,
  totalSlides,
  isPaused,
  isLocked,
  currentDurationSec,
  onLogoClick,
}) => {
  const [clock, setClock] = useState(getNzClockParts());

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(getNzClockParts());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const slideNames = ["GAME DECK", "COUNTDOWN", "HALL OF WINNERS"];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-[104px] bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#D4AF37]/35 px-10 flex items-center justify-between select-none shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      {/* Left: Venue Brand Logo */}
      <div className="w-[320px] flex items-center gap-4 min-w-0">
        <div
          onClick={onLogoClick}
          className="relative flex items-center justify-center p-1 rounded-xl bg-gradient-to-br from-[#1F1D16] to-[#0A0A0A] border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.2)] cursor-pointer hover:border-[#D4AF37] transition-colors"
          title="Chase The Ace Signage"
        >
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="Venue Logo"
            className="h-16 w-auto object-contain max-w-[170px] drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        </div>
      </div>

      {/* Center: BIGGER CENTERED TITLE */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl lg:text-5xl font-black font-playfair tracking-widest uppercase bg-gradient-to-r from-[#FFF] via-[#F3E5AB] to-[#D4AF37] bg-clip-text text-transparent whitespace-nowrap drop-shadow-[0_2px_15px_rgba(212,175,55,0.5)]">
          CHASE THE <span className="text-[#D4AF37] font-serif drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]">♠</span> ACE
        </h1>
        <p className="text-xs font-black text-[#D4AF37] uppercase tracking-[0.3em] mt-1 whitespace-nowrap">
          {isGameplayPaused ? "GAME PLAY PAUSED • BUILDING TO $500 STARTING POOL" : "OFFICIAL DIGITAL SIGNAGE"}
        </p>
      </div>

      {/* Right: NZ Digital Clock with BLINKING COLONS & Status */}
      <div className="w-[320px] flex items-center justify-end gap-4 min-w-0">
        {isLocked && (
          <Badge variant="destructive" className="animate-pulse bg-red-950/80 border-red-500 text-red-300 font-bold text-xs uppercase px-2.5 py-1">
            FREEZE (0)
          </Badge>
        )}
        {isPaused && !isLocked && (
          <Badge variant="outline" className="bg-amber-950/60 border-amber-500/80 text-amber-300 font-bold text-xs uppercase px-2.5 py-1">
            PAUSED
          </Badge>
        )}

        <div className="flex flex-col items-end">
          <div className="flex items-baseline text-3xl font-black font-bebas tracking-wider text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] whitespace-nowrap">
            <span>{clock.hours}</span>
            <span className="text-[#D4AF37] animate-[pulse_1s_infinite] mx-0.5 font-bold">:</span>
            <span>{clock.minutes}</span>
            <span className="text-[#D4AF37] animate-[pulse_1s_infinite] mx-0.5 font-bold">:</span>
            <span className="text-neutral-300 text-2xl">{clock.seconds}</span>
            <span className="text-xs ml-1 font-bold text-[#D4AF37] font-sans">{clock.dayPeriod}</span>
          </div>
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest whitespace-nowrap font-outfit">
            {clock.fullDate} NZDT
          </span>
        </div>
      </div>
    </header>
  );
};
