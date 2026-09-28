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
    <header className="fixed top-0 left-0 right-0 z-40 h-[104px] bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#D4AF37]/30 px-8 flex items-center justify-between select-none shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      {/* Left: Venue Brand Logo & Subtitle */}
      <div className="flex items-center gap-5 min-w-0">
        <div
          onClick={onLogoClick}
          className="relative flex items-center justify-center p-1 rounded-xl bg-gradient-to-br from-[#1F1D16] to-[#0A0A0A] border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.2)] cursor-pointer hover:border-[#D4AF37] transition-colors"
          title="Chase The Ace Signage"
        >
          <img
            src="/logo.png"
            alt="Venue Logo"
            className="h-16 w-auto object-contain max-w-[170px] drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-[#FFF] via-[#F3E5AB] to-[#D4AF37] bg-clip-text text-transparent whitespace-nowrap">
              CHASE THE <span className="text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.7)]">♠</span> ACE
            </h1>
            {isGameplayPaused ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider bg-amber-500/20 border border-amber-500/60 text-amber-300 animate-pulse whitespace-nowrap">
                PAUSED • NO DRAW UNTIL ${targetJackpot}
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] whitespace-nowrap">
                NZ SIGNAGE
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 font-medium tracking-wider uppercase whitespace-nowrap overflow-hidden text-ellipsis">
            {isGameplayPaused ? (
              <span>
                BUILDING POT: <strong className="text-white">${jackpot} TOMORROW</strong> • GAME RESUMES <strong className="text-[#D4AF37]">TUESDAY {resumeDateStr} AT 5:30 PM (${targetJackpot})</strong>
              </span>
            ) : (
              <span>NEXT DRAW: TUESDAY 5:30 PM & SATURDAY 6:30 PM</span>
            )}
          </p>
        </div>
      </div>

      {/* Center: Current Building Pot & Target */}
      <div className="hidden md:flex items-center gap-4 bg-[#141416]/80 px-6 py-2 rounded-2xl border border-[#D4AF37]/40 shadow-[0_0_25px_rgba(212,175,55,0.15)]">
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
            {isGameplayPaused ? "BUILDING POT (TOMORROW)" : "CURRENT JACKPOT"}
          </span>
          <span className="text-3xl font-black tracking-tight text-white drop-shadow-[0_0_12px_rgba(212,175,55,0.5)] whitespace-nowrap">
            ${jackpot.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="h-9 w-px bg-neutral-800" />

        <div className="flex flex-col items-start text-xs font-semibold">
          <span className="text-neutral-400 text-[10px] tracking-wider uppercase">RESUMES AT</span>
          <span className="text-[#F3E5AB] font-bold uppercase whitespace-nowrap">
            ${targetJackpot}.00 (13 OCT)
          </span>
        </div>
      </div>

      {/* Right: State Badges & Digital NZ Clock with Blinking Colons */}
      <div className="flex items-center gap-5 min-w-0">
        <div className="flex items-center gap-2">
          {isLocked && (
            <Badge variant="destructive" className="animate-pulse bg-red-950/80 border-red-500 text-red-300 font-bold text-xs uppercase px-2.5 py-1">
              FREEZE LOCKED (0)
            </Badge>
          )}
          {isPaused && !isLocked && (
            <Badge variant="outline" className="bg-amber-950/60 border-amber-500/80 text-amber-300 font-bold text-xs uppercase px-2.5 py-1">
              PAUSED [SPACE]
            </Badge>
          )}
          <Badge
            variant="outline"
            className="border-[#D4AF37]/40 bg-[#1A1A1E] text-neutral-300 text-xs font-semibold px-2.5 py-1 whitespace-nowrap"
          >
            SLIDE {activeSlideIndex + 1}/{totalSlides}: {slideNames[activeSlideIndex]} ({currentDurationSec}s)
          </Badge>
        </div>

        {/* NZ Digital Clock with BLINKING COLONS */}
        <div className="flex flex-col items-end pl-2">
          <div className="flex items-baseline text-2xl font-black font-mono tracking-wider text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] whitespace-nowrap">
            <span>{clock.hours}</span>
            <span className="text-[#D4AF37] animate-[pulse_1s_infinite] mx-0.5 font-bold">:</span>
            <span>{clock.minutes}</span>
            <span className="text-[#D4AF37] animate-[pulse_1s_infinite] mx-0.5 font-bold">:</span>
            <span className="text-neutral-300 text-xl">{clock.seconds}</span>
            <span className="text-xs ml-1 font-bold text-[#D4AF37]">{clock.dayPeriod}</span>
          </div>
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest whitespace-nowrap">
            {clock.fullDate} NZDT
          </span>
        </div>
      </div>
    </header>
  );
};
