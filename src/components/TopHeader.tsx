import React from "react";
import type { DrawTarget } from "../types";

interface TopHeaderProps {
  jackpot?: number;
  targetJackpot?: number;
  isGameplayPaused?: boolean;
  resumeDateStr?: string;
  drawTarget?: DrawTarget;
  activeSlideIndex?: number;
  totalSlides?: number;
  isPaused?: boolean;
  isLocked?: boolean;
  currentDurationSec?: number;
  onLogoClick?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-[104px] bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#D4AF37]/35 px-8 flex items-center justify-center select-none shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      <h1
        onClick={onLogoClick}
        className="text-6xl lg:text-7xl xl:text-[76px] font-black font-outfit tracking-widest uppercase bg-gradient-to-r from-[#D4AF37] via-[#FFF] via-[#F3E5AB] to-[#D4AF37] bg-clip-text text-transparent whitespace-nowrap drop-shadow-[0_4px_25px_rgba(212,175,55,0.4)] leading-none text-center cursor-pointer hover:brightness-110 transition-all animate-metallic-text"
        title="Chase The Ace"
      >
        CHASE THE <span className="text-[#D4AF37] drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]">♠</span> ACE <span className="text-[#D4AF37] drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]">♠</span>
      </h1>
    </header>
  );
};
