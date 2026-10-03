import React from "react";
import type { SignageData } from "../types";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { BookOpen, Ticket, Clock, Search, Trophy, Sparkles } from "lucide-react";

interface SlideRulesProps {
  data: SignageData;
}

export const SlideRules: React.FC<SlideRulesProps> = ({ data }) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
    exit: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.97,
      transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] as const },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const rules = [
    {
      step: "1",
      icon: <Ticket className="w-10 h-10 text-[#D4AF37]" />,
      title: "BUY YOUR TICKETS",
      detail: "Purchase tickets over the bar on draw nights. Every ticket gives you a chance to be drawn.",
      highlight: "Tickets available at the bar",
    },
    {
      step: "2",
      icon: <Clock className="w-10 h-10 text-amber-400" />,
      title: "LIVE TICKET DRAW",
      detail: "One lucky ticket is drawn from the barrel. The ticket holder must be present in the venue to play.",
      highlight: "Must be present to win",
    },
    {
      step: "3",
      icon: <Search className="w-10 h-10 text-[#D4AF37]" />,
      title: "SELECT A CARD",
      detail: "The winner selects one sealed envelope from the locked 7-shelf cabinet behind the bar.",
      highlight: "7 shelves • 52 cards",
    },
    {
      step: "4",
      icon: <Trophy className="w-10 h-10 text-amber-300" />,
      title: "FIND THE ACE & WIN!",
      detail: "Reveal the Ace of Spades (♠) to instantly win the entire accumulated cash jackpot!",
      highlight: "Instant cash payout",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full h-full flex flex-col justify-between px-12 py-7 max-w-[1920px] mx-auto select-none will-change-[transform,opacity]"
    >
      {/* Top Slide Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between bg-gradient-to-r from-black/90 via-[#1C1A14]/95 to-black/90 border-2 border-[#D4AF37] px-10 py-4 rounded-2xl shadow-[0_0_35px_rgba(212,175,55,0.35)] backdrop-blur-md shrink-0 metallic-sheen-sweep"
      >
        <div className="flex items-center gap-4">
          <BookOpen className="w-10 h-10 text-[#D4AF37] animate-pulse" />
          <div>
            <h2 className="text-4xl lg:text-5xl font-black font-outfit uppercase tracking-wider text-white">
              CHASE THE ACE <span className="text-[#D4AF37]">♠ OFFICIAL VENUE RULES</span>
            </h2>
            <p className="text-xl font-black font-outfit uppercase tracking-widest text-[#F3E5AB] mt-0.5">
              COASTERS TAVERN DRAW PROCEDURE & JACKPOT RULES
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-2xl font-black font-bebas tracking-widest text-amber-300 uppercase bg-black/80 px-6 py-2 rounded-xl border border-[#D4AF37]">
            RESUMES AT $500 POOL
          </span>
        </div>
      </motion.div>

      {/* 4 Large Rule Cards Grid */}
      <div className="flex-1 grid grid-cols-2 gap-7 my-5 min-h-0">
        {rules.map((rule) => (
          <motion.div
            key={rule.step}
            variants={itemVariants}
            className="bg-gradient-to-br from-[#1A1813]/95 via-[#111115]/95 to-[#161410]/95 border-2 border-[#D4AF37]/60 rounded-3xl p-8 flex items-center gap-7 shadow-[0_12px_40px_rgba(0,0,0,0.85)] relative overflow-hidden metallic-sheen-sweep"
          >
            {/* Step Number Badge */}
            <div className="flex flex-col items-center justify-center w-28 h-28 rounded-2xl bg-gradient-to-b from-[#2A2415] to-[#12110D] border-2 border-[#D4AF37] shrink-0 shadow-[0_0_25px_rgba(212,175,55,0.4)]">
              <span className="text-xs font-black text-amber-400 font-outfit tracking-widest uppercase">
                STEP
              </span>
              <span className="text-6xl font-black text-[#F3E5AB] font-bebas leading-none">
                0{rule.step}
              </span>
            </div>

            {/* Rule Content */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-3 mb-2">
                {rule.icon}
                <h3 className="text-3xl lg:text-4xl font-black font-outfit tracking-wide uppercase text-white whitespace-nowrap">
                  {rule.title}
                </h3>
              </div>

              <p className="text-2xl font-bold text-neutral-200 leading-snug font-outfit">
                {rule.detail}
              </p>

              <div className="mt-3">
                <span className="inline-block text-lg font-black text-[#D4AF37] uppercase bg-black/70 px-4 py-1 rounded-lg border border-[#D4AF37]/40 tracking-wider">
                  {rule.highlight}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Rollover Guarantee Banner */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-[#201808]/95 via-[#14120A]/95 to-[#201808]/95 border-2 border-[#D4AF37] rounded-2xl px-10 py-4 flex items-center justify-between text-2xl text-[#F3E5AB] font-black uppercase tracking-wider font-outfit shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.8)] metallic-sheen-sweep"
      >
        <span className="flex items-center gap-4">
          <Sparkles className="w-8 h-8 text-amber-400 animate-pulse shrink-0" />
          IF NOT THE ACE, CARD IS REMOVED & DISCARDED • JACKPOT BUILDS BY +$100 EACH DRAW DATE!
        </span>
        <span className="text-amber-300 font-black text-2xl whitespace-nowrap">
          TARGET POOL: ${data.targetJackpot}.00
        </span>
      </motion.div>
    </motion.div>
  );
};
