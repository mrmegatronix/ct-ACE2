import React, { useState } from "react";
import { HelpCircle, Pause, Lock, Play, ChevronLeft, ChevronRight, Sliders } from "lucide-react";

interface ControlsOverlayProps {
  isPaused: boolean;
  isLocked: boolean;
  slideDurationSec: number;
  idleCountdownSec: number;
  isUserInteracting: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePause: () => void;
  onToggleLock: () => void;
}

export const ControlsOverlay: React.FC<ControlsOverlayProps> = ({
  isPaused,
  isLocked,
  slideDurationSec,
  idleCountdownSec,
  isUserInteracting,
  onPrev,
  onNext,
  onTogglePause,
  onToggleLock,
}) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      {/* Floating Bottom Control HUD (Hidden until mouse over) */}
      <div className="fixed bottom-0 right-0 p-4 z-50 flex items-center gap-3 select-none opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
        {/* Interaction Pause Indicator */}
        {isUserInteracting && (
          <div className="bg-amber-950/80 border border-amber-500/70 text-amber-200 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-md animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Interacting: Resuming in {idleCountdownSec}s
          </div>
        )}

        {/* Lock Freeze Indicator */}
        {isLocked && (
          <div
            onClick={onToggleLock}
            className="cursor-pointer bg-red-950/90 border border-red-500 text-red-200 text-[11px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_20px_rgba(239,68,68,0.4)] backdrop-blur-md animate-pulse"
            title="Click to Unlock (or press 0)"
          >
            <Lock className="w-3.5 h-3.5" />
            FROZEN (PRESS 0 TO UNLOCK)
          </div>
        )}

        {/* Mini Controls Pill */}
        <div className="flex items-center gap-1 bg-[#121215]/90 border border-[#D4AF37]/40 px-2 py-1.5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-md text-xs font-semibold text-neutral-300">
          <button
            onClick={onPrev}
            className="p-1.5 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            title="Previous Slide (ArrowLeft)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePause}
            className="p-1.5 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors text-[#D4AF37]"
            title="Toggle Pause (Space)"
          >
            {isPaused || isLocked ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            onClick={onNext}
            className="p-1.5 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            title="Next Slide (ArrowRight)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-neutral-800 mx-1" />

          {/* Quick links to Admin and Remote */}
          <a
            href={`${import.meta.env.BASE_URL}admin.html`}
            target="_blank"
            rel="noreferrer"
            className="px-2 py-1 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors text-[11px] font-bold uppercase text-[#D4AF37]"
            title="Open Admin Page (A)"
          >
            Admin [A]
          </a>

          <a
            href={`${import.meta.env.BASE_URL}remote.html`}
            target="_blank"
            rel="noreferrer"
            className="px-2 py-1 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors text-[11px] font-bold uppercase text-neutral-400"
            title="Open Remote Page (R)"
          >
            Remote [R]
          </a>

          <a
            href={`${import.meta.env.BASE_URL}preview.html`}
            target="_blank"
            rel="noreferrer"
            className="px-2 py-1 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors text-[11px] font-bold uppercase text-amber-300"
            title="Open Multi-Slide Preview Monitor (P)"
          >
            Preview [P]
          </a>

          <div className="h-4 w-px bg-neutral-800 mx-1" />

          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-1.5 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400"
            title="Keyboard Shortcuts Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showHelp && (
        <div
          onClick={() => setShowHelp(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-[#141418] border-2 border-[#D4AF37] rounded-3xl p-8 shadow-[0_0_60px_rgba(212,175,55,0.3)] text-neutral-200"
          >
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <Sliders className="w-6 h-6 text-[#D4AF37]" />
                <h3 className="text-xl font-black tracking-wider uppercase text-white">
                  SIGNAGE KEYBOARD CONTROLS
                </h3>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="text-neutral-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-neutral-800">
                <span className="text-neutral-400 uppercase">Previous Slide</span>
                <kbd className="px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 text-[#D4AF37] font-mono">
                  ArrowLeft
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-neutral-800">
                <span className="text-neutral-400 uppercase">Next Slide</span>
                <kbd className="px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 text-[#D4AF37] font-mono">
                  ArrowRight
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-neutral-800">
                <span className="text-neutral-400 uppercase">Restart Module</span>
                <kbd className="px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 text-[#D4AF37] font-mono">
                  ArrowUp
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-neutral-800">
                <span className="text-neutral-400 uppercase">Skip Module</span>
                <kbd className="px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 text-[#D4AF37] font-mono">
                  ArrowDown
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-neutral-800">
                <span className="text-neutral-400 uppercase">Pause / Unpause</span>
                <kbd className="px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 text-[#D4AF37] font-mono">
                  Space
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-neutral-800">
                <span className="text-neutral-400 uppercase">Freeze / Unlock</span>
                <kbd className="px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 text-[#D4AF37] font-mono">
                  0
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-neutral-800">
                <span className="text-neutral-400 uppercase">Set Slide Duration</span>
                <kbd className="px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 text-[#D4AF37] font-mono">
                  1 - 9 (10s-90s)
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-neutral-800">
                <span className="text-neutral-400 uppercase">Admin / Remote</span>
                <kbd className="px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 text-[#D4AF37] font-mono">
                  A / R
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-neutral-800">
                <span className="text-neutral-400 uppercase">Preview Monitor</span>
                <kbd className="px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 text-[#D4AF37] font-mono">
                  P
                </kbd>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-400">
              <span>Current Duration: <strong className="text-white">{slideDurationSec}s</strong></span>
              <button
                onClick={() => setShowHelp(false)}
                className="bg-[#D4AF37] text-black font-black uppercase px-4 py-2 rounded-xl hover:bg-[#F3E5AB] transition-colors"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
