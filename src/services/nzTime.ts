import type { DrawTarget, CountdownState } from "../types";

export const NZ_TIMEZONE = "Pacific/Auckland";

/**
 * Returns exact UTC Date for a given year, month, day, hour, minute in Pacific/Auckland timezone
 */
export function getUtcForNzLocal(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): Date {
  try {
    let guess = Date.UTC(year, month - 1, day, hour - 12, minute, 0);
    for (let i = 0; i < 4; i++) {
      const d = new Date(guess);
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: NZ_TIMEZONE,
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      }).formatToParts(d);

      const m: Record<string, number> = {};
      for (const p of parts) {
        if (p.type !== "literal") {
          m[p.type] = parseInt(p.value, 10);
        }
      }

      const currentTargetInGuess = Date.UTC(
        m.year,
        m.month - 1,
        m.day,
        m.hour,
        m.minute,
        m.second || 0
      );
      const desiredTarget = Date.UTC(year, month - 1, day, hour, minute, 0);
      const diff = desiredTarget - currentTargetInGuess;
      if (diff === 0) break;
      guess += diff;
    }
    return new Date(guess);
  } catch (err) {
    console.warn("Intl timezone error in getUtcForNzLocal, using UTC+13 fallback:", err);
    return new Date(Date.UTC(year, month - 1, day, hour - 13, minute, 0));
  }
}

/**
 * Calculates countdown target.
 * When gameplay is paused until $500, targets Tuesday 13 October 2026 at 5:30 PM NZDT (Event #5 GAME START $500).
 */
export function getNextDrawTarget(
  now: Date = new Date(),
  isPausedUntil500: boolean = true
): DrawTarget {
  // If gameplay is paused until $500 (resume date 13/10/2026)
  if (isPausedUntil500) {
    const resumeUtc = getUtcForNzLocal(2026, 10, 13, 17, 30);
    if (now.getTime() < resumeUtc.getTime()) {
      return {
        targetUtc: resumeUtc,
        drawLabel: "GAME RESUMES AT $500",
        weekday: "Tuesday",
        timeStr: "5:30 PM",
        dateStr: "13/10/2026",
        isResumeTarget: true,
      };
    }
  }

  // Normal schedule: next Tuesday 5:30 PM or Saturday 6:30 PM
  const candidates: DrawTarget[] = [];

  for (let dayOffset = 0; dayOffset <= 8; dayOffset++) {
    const testDate = new Date(now.getTime() + dayOffset * 86400000);
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: NZ_TIMEZONE,
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(testDate);

    const m: Record<string, string> = {};
    for (const p of parts) {
      m[p.type] = p.value;
    }

    const weekday = m.weekday;
    let targetHour: number | null = null;
    let targetMinute: number | null = null;
    let drawLabel = "";
    let drawDay: "Tuesday" | "Saturday" | null = null;

    if (weekday === "Tuesday") {
      targetHour = 17;
      targetMinute = 30;
      drawLabel = "TUESDAY DRAW";
      drawDay = "Tuesday";
    } else if (weekday === "Saturday") {
      targetHour = 18;
      targetMinute = 30;
      drawLabel = "SATURDAY DRAW";
      drawDay = "Saturday";
    }

    if (targetHour !== null && targetMinute !== null && drawDay !== null) {
      const year = parseInt(m.year, 10);
      const month = parseInt(m.month, 10);
      const day = parseInt(m.day, 10);

      const targetUtc = getUtcForNzLocal(year, month, day, targetHour, targetMinute);

      if (targetUtc.getTime() > now.getTime()) {
        candidates.push({
          targetUtc,
          drawLabel,
          weekday: drawDay,
          timeStr: targetHour === 17 ? "5:30 PM" : "6:30 PM",
          dateStr: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`,
        });
      }
    }
  }

  candidates.sort((a, b) => a.targetUtc.getTime() - b.targetUtc.getTime());
  return (
    candidates[0] || {
      targetUtc: new Date(now.getTime() + 86400000),
      drawLabel: "TUESDAY DRAW",
      weekday: "Tuesday",
      timeStr: "5:30 PM",
      dateStr: "Next Draw",
    }
  );
}

export function getCountdown(
  now: Date = new Date(),
  isPausedUntil500: boolean = true
): CountdownState {
  const target = getNextDrawTarget(now, isPausedUntil500);
  const diffMs = Math.max(0, target.targetUtc.getTime() - now.getTime());

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isPast: diffMs <= 0,
    target,
  };
}

export function getNzClockParts(now: Date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: NZ_TIMEZONE,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).formatToParts(now);

    const m: Record<string, string> = {};
    for (const p of parts) {
      m[p.type] = p.value;
    }

    return {
      hours: m.hour || "00",
      minutes: m.minute || "00",
      seconds: m.second || "00",
      dayPeriod: m.dayPeriod || "PM",
      fullDate: new Intl.DateTimeFormat("en-NZ", {
        timeZone: NZ_TIMEZONE,
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(now),
    };
  } catch (err) {
    console.warn("Intl timezone error in getNzClockParts, using local clock fallback:", err);
    const rawHours = now.getHours();
    const displayHours = rawHours % 12 || 12;
    return {
      hours: String(displayHours).padStart(2, "0"),
      minutes: String(now.getMinutes()).padStart(2, "0"),
      seconds: String(now.getSeconds()).padStart(2, "0"),
      dayPeriod: rawHours >= 12 ? "PM" : "AM",
      fullDate: now.toLocaleDateString(),
    };
  }
}

export function setupDailyRefreshValve() {
  const checkInterval = setInterval(() => {
    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: NZ_TIMEZONE,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      }).formatToParts(now);

      const m: Record<string, number> = {};
      for (const p of parts) {
        if (p.type !== "literal") {
          m[p.type] = parseInt(p.value, 10);
        }
      }

      if (m.hour === 3 && m.minute === 0 && m.second >= 0 && m.second <= 5) {
        console.log("Anti-Leak Refresh Valve: Hard page wipe triggered at 3:00 AM NZ");
        window.location.reload();
      }
    } catch {
      // Ignore timezone inspection error
    }
  }, 5000);

  return () => clearInterval(checkInterval);
}
