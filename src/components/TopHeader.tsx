import React from "react";
import type { DrawTarget } from "../types";

interface TopHeaderProps {
  jackpot?: number;
  targetJackpot?: number;
  isGameplayPaused: boolean;
  resumeDateStr?: string;
  drawTarget?: DrawTarget;
  activeSlideIndex?: number;
  totalSlides?: number;
  isPaused: boolean;
  isLocked: boolean;
  currentDurationSec?: number;
  onLogoClick?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-[96px] bg-[#0A0A0A]/95 backdrop-blur-md border-b-2 border-[#D4AF37]/40 px-8 flex items-center justify-center select-none shadow-[0_4px_30px_rgba(0,0,0,0.85)]">
      <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black font-playfair tracking-[0.2em] uppercase bg-gradient-to-r from-white via-[#F5EDCE] to-[#D4AF37] bg-clip-text text-transparent whitespace-nowrap drop-shadow-[0_2px_25px_rgba(212,175,55,0.7)] text-center leading-none">
        CHASE THE <span className="text-[#D4AF37] font-serif drop-shadow-[0_0_20px_rgba(212,175,55,0.9)]">♠</span> ACE
      </h1>
    </header>
  );
};
