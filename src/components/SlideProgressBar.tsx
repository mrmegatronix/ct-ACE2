import React from "react";

interface SlideProgressBarProps {
  currentSlide: number;
  slideDurationSec: number;
  isPaused: boolean;
  isLocked: boolean;
  isFixedParam: boolean;
  isUserInteracting: boolean;
}

export const SlideProgressBar: React.FC<SlideProgressBarProps> = ({
  currentSlide,
  slideDurationSec,
  isPaused,
  isLocked,
  isFixedParam,
  isUserInteracting,
}) => {
  const isSuspended = isPaused || isLocked || isFixedParam || isUserInteracting;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none overflow-hidden h-2 sm:h-2.5 md:h-3 bg-black/80 backdrop-blur-sm border-t border-[#D4AF37]/40 shadow-[0_-2px_12px_rgba(0,0,0,0.8)]"
      title="Slide Progression Timer"
    >
      <div
        key={`${currentSlide}-${slideDurationSec}`}
        className={`h-full bg-gradient-to-r from-[#D4AF37] via-[#FFF] via-[#FCE49E] to-[#F59E0B] shadow-[0_0_20px_rgba(212,175,55,0.9),0_0_10px_rgba(245,158,11,0.7)] transition-opacity duration-300 ${
          isSuspended ? "opacity-60" : "opacity-100"
        }`}
        style={{
          animation: `slide-progress ${slideDurationSec}s linear forwards`,
          animationPlayState: isSuspended ? "paused" : "running",
        }}
      />
    </div>
  );
};
