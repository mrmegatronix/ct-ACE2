# Project Memory: Chase The Ace Digital Signage (ct-ACE2)

## 1. Physical Cabinet Configuration
* **Total Cards**: 54 cards (52 standard cards + 2 jokers).
* **Board Geometry (7 Rows)**:
  * Row 1: 7 cards
  * Row 2: 8 cards (Card #14: 5 of Clubs, face-up)
  * Row 3: 8 cards
  * Row 4: 8 cards
  * Row 5: 8 cards
  * Row 6: 7 cards
  * Row 7: 8 cards
  * Total = 7 + 8 + 8 + 8 + 8 + 7 + 8 = 54 cards.

## 2. Event Numbering & Series History
* **Live Customer Gameplay Launch**: Saturday 10/10/2026 was **EVENT 1** (game start at $500.00 base pool).
* Card Drawn Event 1: Card #14 (`5♣️`), Rob, Ace of Spades missed, jackpot rolled +$100 to $600.00.

## 3. Remote Data Endpoints (Google Sheets)
* **Game Tracker Feed**: `https://docs.google.com/spreadsheets/d/e/2PACX-1vQDwqNaCeNn7Q6WSgc5gN8aOS08Ltkxu2v9QBSVuaKrJFX61PZ1Nuninkqh_F62wQ5t47usf2e19dxx/pub?output=csv`
* **Winners Sheet Feed**: `https://docs.google.com/spreadsheets/d/e/2PACX-1vQDwqNaCeNn7Q6WSgc5gN8aOS08Ltkxu2v9QBSVuaKrJFX61PZ1Nuninkqh_F62wQ5t47usf2e19dxx/pub?gid=2141332002&output=csv`
* **Local Fallbacks**: `data.csv` (game tracking), `winners.csv` (Hall of Master Ace Chasers).
* **Polling Interval**: Every 60 seconds.

## 4. Playback, Timing & Lock Rules
* **Slide Duration**: 30 seconds (`30000ms`) per slide across standard rotation.
* **Pre-Draw Climax Lock (T-10m)**:
  * Automatically forces Countdown slide (Slide 5) 10 minutes prior to draw time.
  * Hides top header, activates epic colossal countdown mode.
* **Draw Sequence (T-0 to T+14m)**:
  1. Particle fireworks FX launch at `00:00:00`.
  2. Sequential messages:
     * "It's time for 1 lucky ticket to be drawn!" (x3)
     * "Good luck!" (x2)
     * "Drawn ticket holder will get to flip 1 card in the cabinet"
     * "Flip the ACE OF SPADES to instantly win tonight's cash jackpot!"
     * "Tonight's JACKPOT is: [AMOUNT]" (pulsing text FX).
  3. Holds ceremonial display for 14 minutes, then auto-resumes 30s rotation and advances countdown target.

## 5. Admin Controls (`admin.html`)
* QR Code for direct mobile staff access.
* **ACE of SPADES WINNER**: Broadcasts 15-minute celebratory fireworks sequence & victory fanfare, then locks game into persistent paused state.
* **ACE NOT STRUCK**: Opens modal to select drawn card (suit/rank) and card number (1-54), updates signage via BroadcastChannel, records draw, increments jackpot +$100, and resumes rotation.
