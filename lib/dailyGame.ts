import type { SupportedWordLength } from "./wordLengths";

export interface DailyGameStatus {
  date: string;
  completed: boolean;
  won?: boolean;
  guesses?: number;
  solution?: string;
  length: SupportedWordLength;
}

const DAILY_STORAGE_PREFIX = "termo-daily-status";

const getTodayString = (): string => new Date().toISOString().split("T")[0];

const getStorageKey = (length: SupportedWordLength): string =>
  `${DAILY_STORAGE_PREFIX}-${length}`;

const pruneLegacyKey = () => {
  if (typeof window === "undefined") {
    return;
  }
  if (window.localStorage.getItem(DAILY_STORAGE_PREFIX) !== null) {
    window.localStorage.removeItem(DAILY_STORAGE_PREFIX);
  }
};

export const getDailyGameStatus = (
  length: SupportedWordLength
): DailyGameStatus | null => {
  if (typeof window === "undefined") {
    return null;
  }

  pruneLegacyKey();

  const key = getStorageKey(length);

  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      return null;
    }

    const status = JSON.parse(stored) as DailyGameStatus;
    const today = getTodayString();

    if (status.date !== today || status.length !== length) {
      window.localStorage.removeItem(key);
      return null;
    }

    return status;
  } catch (error) {
    console.error("Error reading daily game status:", error);
    window.localStorage.removeItem(key);
    return null;
  }
};

const saveDailyGameStatus = (
  length: SupportedWordLength,
  status: Omit<DailyGameStatus, "date" | "length">
): void => {
  if (typeof window === "undefined") {
    return;
  }

  const key = getStorageKey(length);

  try {
    const fullStatus: DailyGameStatus = {
      ...status,
      date: getTodayString(),
      length,
    };
    window.localStorage.setItem(key, JSON.stringify(fullStatus));
  } catch (error) {
    console.error("Error saving daily game status:", error);
  }
};

export const isDailyGameCompleted = (length: SupportedWordLength): boolean =>
  Boolean(getDailyGameStatus(length)?.completed);

export const completeDailyGame = (
  length: SupportedWordLength,
  won: boolean,
  guesses: number,
  solution: string
): void => {
  saveDailyGameStatus(length, {
    completed: true,
    won,
    guesses,
    solution,
  });
};
