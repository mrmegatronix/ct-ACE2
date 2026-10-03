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
    <header className="fixed top-0 left-0 right-0 z-40 h-20 sm:h-24 lg:h-28 bg-[#0A0A0A]/95 backdrop-blur-md border-b-2 border-[#D4AF37]/40 px-4 sm:px-8 flex items-center justify-center select-none shadow-[0_6px_35px_rgba(0,0,0,0.85)]">
      <h1
        onClick={onLogoClick}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black font-outfit tracking-wider md:tracking-widest uppercase bg-gradient-to-r from-[#D4AF37] via-[#FFF] via-[#F3E5AB] to-[#D4AF37] bg-clip-text text-transparent whitespace-nowrap drop-shadow-[0_4px_30px_rgba(212,175,55,0.6)] leading-none text-center cursor-pointer hover:brightness-110 transition-all animate-metallic-text flex items-center justify-center"
        title="Chase The Ace"
      >
        <span className="animate-spade-loop text-3xl sm:text-4xl lg:text-6xl mx-2 sm:mx-4">♠</span>
        <span>CHASE</span>
        <span className="animate-spade-loop text-3xl sm:text-4xl lg:text-6xl mx-2 sm:mx-4" style={{ animationDelay: "1.5s" }}>♠</span>
        <span>THE</span>
        <span className="animate-spade-loop text-3xl sm:text-4xl lg:text-6xl mx-2 sm:mx-4" style={{ animationDelay: "3s" }}>♠</span>
        <span>ACE</span>
        <span className="animate-spade-loop text-3xl sm:text-4xl lg:text-6xl mx-2 sm:mx-4" style={{ animationDelay: "4.5s" }}>♠</span>
      </h1>
    </header>
  );
};
