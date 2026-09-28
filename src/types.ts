export interface GameCard {
  id: number;
  cardNumber: number;
  isFlipped: boolean;
  drawnCardName?: string;
  winnerName?: string;
  drawDate?: string;
}

export interface WinnerRecord {
  event: number;
  drawDate: string;
  drawDay: string;
  winnerName: string;
  ticketNumber: string;
  cardDrawn: string;
  jackpotAmount: string;
  comment?: string;
  isRecentChampion?: boolean;
  isPlaceholder?: boolean;
}

export interface SignageData {
  jackpot: number; // Current building amount ($100 tomorrow)
  targetJackpot: number; // Target to resume ($500)
  isGameplayPaused: boolean; // True until jackpot hits $500
  resumeDateStr: string; // 13/10/2026
  remainingCards: number;
  flippedCards: number;
  winningChance: string;
  cards: GameCard[];
  winners: WinnerRecord[];
  comment?: string;
  lastUpdated: Date;
}

export interface DrawTarget {
  targetUtc: Date;
  drawLabel: string;
  weekday: "Tuesday" | "Saturday";
  timeStr: string;
  dateStr: string;
  isResumeTarget?: boolean;
}

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  target: DrawTarget;
}
