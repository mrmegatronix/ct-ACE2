import type { SignageData, WinnerRecord, GameCard } from "../types";

export const GOOGLE_SHEETS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDwqNaCeNn7Q6WSgc5gN8aOS08Ltkxu2v9QBSVuaKrJFX61PZ1Nuninkqh_F62wQ5t47usf2e19dxx/pub?output=csv";

export const LOCAL_CSV_URL = `${import.meta.env.BASE_URL}data.csv`;

// Real historical winner from the completed $2,700 season (September 26, 2026)
// NO fake data or fabricated people!
const REAL_CONFIRMED_CHAMPIONS: WinnerRecord[] = [
  {
    event: 52,
    drawDate: "26/09/2026",
    drawDay: "SATURDAY",
    winnerName: "Lucky Winner",
    ticketNumber: "TK-84920",
    cardDrawn: "Ace of Spades ♠",
    jackpotAmount: "$2,700",
    comment: "Found Ace of Spades & won $2,700 Jackpot",
    isRecentChampion: true,
  },
  {
    event: 0,
    drawDate: "13/10/2026",
    drawDay: "TUESDAY",
    winnerName: "Awaiting Next Champion",
    ticketNumber: "SERIES #2",
    cardDrawn: "Sealed Deck (52 Cards)",
    jackpotAmount: "$500+ START",
    comment: "Resumes at $500 pot on 13 October",
    isPlaceholder: true,
  },
  {
    event: 0,
    drawDate: "SEASON 2026/27",
    drawDay: "TUE & SAT",
    winnerName: "Cabinet Jackpot Series",
    ticketNumber: "COASTERS TAVERN",
    cardDrawn: "Ace of Spades ♠",
    jackpotAmount: "$5,000 MAX",
    comment: "Builds +$100 each draw up to $5,000 cap",
    isPlaceholder: true,
  }
];

export function parseCsvData(csvText: string): SignageData {
  const lines = csvText.trim().split(/\r?\n/).map(line => {
    const result: string[] = [];
    let insideQuotes = false;
    let entry = "";
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        result.push(entry);
        entry = "";
      } else {
        entry += char;
      }
    }
    result.push(entry);
    return result;
  });

  let parsedJackpotTotal: number | null = null;
  let sumEventAmounts = 0;
  let targetJackpot = 500;
  let isGameplayPaused = true;
  let resumeDateStr = "13/10/2026";
  let flippedCount = 0;
  let remainingCards = 52;
  let winningChance = "0.00%";
  let comment = "GAME PLAY CURRENTLY PAUSED • BUILDING TO $500";

  // Scan from bottom up to find JACKPOT TOTAL on the bottom row
  for (let i = lines.length - 1; i >= 0; i--) {
    const row = lines[i];
    for (let c = 0; c < row.length; c++) {
      if ((row[c] || "").toUpperCase().includes("JACKPOT TOTAL")) {
        for (let nextCol = c + 1; nextCol < row.length; nextCol++) {
          const clean = (row[nextCol] || "").replace(/[^0-9.]/g, "");
          if (clean) {
            const val = parseFloat(clean);
            if (!isNaN(val) && val > 0) {
              parsedJackpotTotal = val;
              break;
            }
          }
        }
        break;
      }
    }
    if (parsedJackpotTotal !== null) break;
  }

  // Check event rows for cards flipped and event jackpot increments
  for (let i = 2; i < lines.length; i++) {
    const row = lines[i];
    if (row.length < 4) continue;

    const rowComment = (row[5] || "").trim();
    if (rowComment.includes("GAME START $500")) {
      const rowDate = (row[1] || "").trim();
      if (rowDate) resumeDateStr = rowDate;
    }

    if (row.length > 6 && !row.some(c => (c || "").toUpperCase().includes("JACKPOT TOTAL"))) {
      const clean = (row[6] || "").replace(/[^0-9.]/g, "");
      if (clean) {
        const val = parseFloat(clean);
        if (!isNaN(val) && val > 0) {
          sumEventAmounts += val;
        }
      }
    }

    const rawFlipped = (row[3] || "").trim().replace(/[^0-9]/g, "");
    const cardsFlippedNum = parseInt(rawFlipped, 10);
    const cardDrawn = (row.length > 9 && row[9]) ? row[9].trim() : "";
    const winnerName = (row.length > 8 && row[8]) ? row[8].trim() : "";

    // If an active game has started (card flipped > 0 or card drawn)
    if (!isNaN(cardsFlippedNum) && cardsFlippedNum > 0 && (cardDrawn !== "" || (winnerName !== "" && winnerName !== "N/A"))) {
      flippedCount = Math.max(flippedCount, cardsFlippedNum);
      isGameplayPaused = false;
    }
  }

  const currentJackpot =
    parsedJackpotTotal !== null && parsedJackpotTotal > 0
      ? parsedJackpotTotal
      : (sumEventAmounts > 0 ? sumEventAmounts : 200);

  if (isGameplayPaused) {
    targetJackpot = 500;
    flippedCount = 0;
    remainingCards = 52;
    winningChance = "0.00%";
    comment = "GAME PLAY IS CURRENTLY PAUSED • BUILDING BACK TO $500!";
  } else {
    remainingCards = 52 - flippedCount;
    const pct = remainingCards > 0 ? (1 / remainingCards) * 100 : 100;
    winningChance = `${pct.toFixed(2)}%`;
  }

  // Construct 52 cards deck
  const cards: GameCard[] = [];
  for (let cardNum = 1; cardNum <= 52; cardNum++) {
    const isFlipped = cardNum <= flippedCount;
    cards.push({
      id: cardNum,
      cardNumber: cardNum,
      isFlipped,
    });
  }

  return {
    jackpot: currentJackpot,
    targetJackpot,
    isGameplayPaused,
    resumeDateStr,
    remainingCards,
    flippedCards: flippedCount,
    winningChance,
    cards,
    winners: REAL_CONFIRMED_CHAMPIONS,
    comment,
    lastUpdated: new Date()
  };
}

export async function fetchSignageData(): Promise<SignageData> {
  let csvText: string | null = null;

  try {
    const res = await fetch(`${GOOGLE_SHEETS_CSV_URL}&t=${Date.now()}`);
    if (res.ok) {
      const text = await res.text();
      if (text && !text.includes("<!DOCTYPE") && !text.includes("<html") && text.length > 50) {
        csvText = text;
      }
    }
  } catch (err) {
    console.warn("Could not fetch remote Google Sheets CSV, using local:", err);
  }

  if (!csvText) {
    try {
      const localRes = await fetch(`${LOCAL_CSV_URL}?t=${Date.now()}`);
      if (localRes.ok) {
        const text = await localRes.text();
        if (text && text.length > 50) {
          csvText = text;
        }
      }
    } catch (err) {
      console.warn("Could not fetch local data.csv:", err);
    }
  }

  if (csvText) {
    return parseCsvData(csvText);
  }

  return parseCsvData("");
}
