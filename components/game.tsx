'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  HelpCircle,
  Info,
  PlusCircle,
  RotateCcw,
} from "lucide-react";
import { Alert } from "@/components/alerts/Alert";
import { Grid } from "@/components/grid/Grid";
import { Keyboard } from "@/components/keyboard/Keyboard";
import { InfoModal } from "@/components/modals/InfoModal";
import { WinModal } from "@/components/modals/WinModal";
import { LoseModal } from "@/components/modals/LoseModal";
import { CreateGameModal } from "@/components/modals/CreateGameModal";
import { ModeInfoModal } from "@/components/modals/ModeInfoModal";
import { StatsModal } from "@/components/modals/StatsModal";
import { Confetti } from "@/components/confetti";
import { GameLoadingPlaceholder } from "@/components/game-loading-placeholder";
import {
  loadWordList,
  normalizeWordInsensitive,
  canonicalizeGuess,
  getRandomWord,
  getWordOfDay,
  MAX_GUESSES,
  type WordListData,
} from "@/lib/words";
import {
  clearChallengeFromUrl,
  generateChallengeUrl,
  resolveChallengeWordFromUrl,
} from "@/lib/share";
import {
  completeDailyGame,
  isDailyGameCompleted,
} from "@/lib/dailyGame";
import {
  createDefaultStats,
  loadStats,
  recordGameResult,
  type StoredStats,
} from "@/lib/stats";
import type { SupportedWordLength } from "@/lib/wordLengths";
import { LengthSwitcher, type LengthOption } from "@/components/length-switcher";

type GameMode = "daily" | "infinite" | "challenge";

interface GameProps {
  wordLength: SupportedWordLength;
  lengthOptions: LengthOption[];
  searchHref: string;
  challengePath: string;
}

interface StoredGameState {
  solution: string;
  guesses: string[];
  currentGuess: string;
  isGameWon: boolean;
  isGameLost: boolean;
  playedOn?: string;
  challengeId?: string;
  length: SupportedWordLength;
}

const DAILY_STORAGE_PREFIX = "termo-v2-daily-progress";
const CHALLENGE_STORAGE_PREFIX = "termo-v2-challenge-progress";
const POPUNDER_SCRIPT_SRC = "https://pl29091401.profitablecpmratenetwork.com/8b/ce/9e/8bce9edaf9174cd9e34189ec2b34b9ca.js";
const POPUNDER_SESSION_SHOWN_KEY = "termo-popunder-session-shown-count";
const POPUNDER_LAST_SHOWN_AT_KEY = "termo-popunder-last-shown-at";
const POPUNDER_COMPLETED_ROUNDS_KEY = "termo-popunder-completed-rounds";
const POPUNDER_SESSION_CAP = 1;
const POPUNDER_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const POPUNDER_MIN_COMPLETED_ROUNDS = 2;

const getTodayString = (): string => new Date().toISOString().split("T")[0];

const toStorageIdentifier = (value: string): string =>
  normalizeWordInsensitive(value).replace(/[^a-z]/g, "");

const getGameStateKey = (
  mode: GameMode,
  length: SupportedWordLength,
  identifier?: string | null
): string | null => {
  if (mode === "daily") {
    return `${DAILY_STORAGE_PREFIX}-${length}`;
  }
  if (mode === "challenge" && identifier) {
    return `${CHALLENGE_STORAGE_PREFIX}-${length}-${identifier}`;
  }
  return null;
};

const createInfiniteGameId = (length: SupportedWordLength): string => {
  const randomSegment = Math.random().toString(36).slice(2, 8);
  return `${length}-${Date.now().toString(36)}-${randomSegment}`;
};

const MODE_LABELS: Record<GameMode, string> = {
  daily: "modo diário",
  infinite: "modo infinito",
  challenge: "modo desafio",
};

function Game({ wordLength, lengthOptions, searchHref, challengePath }: GameProps) {
  const [mode, setMode] = useState<GameMode>("daily");
  const [wordData, setWordData] = useState<WordListData | null>(null);
  const [challengeWord, setChallengeWord] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentSolution, setCurrentSolution] = useState<string>("");
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [isLoseModalOpen, setIsLoseModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isModeInfoOpen, setIsModeInfoOpen] = useState(false);
  const [isCreateGameModalOpen, setIsCreateGameModalOpen] = useState(false);
  const [revealingRowIndex, setRevealingRowIndex] = useState<number | undefined>();
  const [isWordNotFoundAlertOpen, setIsWordNotFoundAlertOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [initialModeResolved, setInitialModeResolved] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [stats, setStats] = useState<StoredStats>(() => createDefaultStats());
  const [infiniteGameId, setInfiniteGameId] = useState<string>(() =>
    createInfiniteGameId(wordLength)
  );

  const skipWinEffectsRef = useRef(false);
  const skipLoseEffectsRef = useRef(false);
  const isMountedRef = useRef(false);
  const hasUserPlayedRoundRef = useRef(false);
  const previousRoundEndedRef = useRef(false);
  const popunderShownRoundRef = useRef<string | null>(null);
  const pendingPopunderRoundKeyRef = useRef<string | null>(null);
  const sessionShownCountFallbackRef = useRef(0);
  const lastShownAtFallbackRef = useRef(0);
  const completedRoundsFallbackRef = useRef(0);

  const resetTransientState = () => {
    setGuesses([]);
    setCurrentGuess("");
    setIsGameWon(false);
    setIsGameLost(false);
    setIsWinModalOpen(false);
    setIsLoseModalOpen(false);
    setShowConfetti(false);
    setRevealingRowIndex(undefined);
    hasUserPlayedRoundRef.current = false;
    previousRoundEndedRef.current = false;
    pendingPopunderRoundKeyRef.current = null;
  };

  const initializeGameState = (
    solution: string,
    state?: {
      guesses?: string[];
      currentGuess?: string;
      isGameWon?: boolean;
      isGameLost?: boolean;
    },
    options?: { skipCompletionEffects?: boolean }
  ) => {
    if (options?.skipCompletionEffects) {
      if (state?.isGameWon) {
        skipWinEffectsRef.current = true;
      }
      if (state?.isGameLost) {
        skipLoseEffectsRef.current = true;
      }
    } else {
      skipWinEffectsRef.current = false;
      skipLoseEffectsRef.current = false;
    }

    setCurrentSolution(solution);
    setGuesses(state?.guesses ?? []);
    setCurrentGuess(state?.currentGuess ?? "");
    setIsGameWon(state?.isGameWon ?? false);
    setIsGameLost(state?.isGameLost ?? false);
    setIsWinModalOpen(false);
    setIsLoseModalOpen(false);
    setShowConfetti(false);
    setRevealingRowIndex(undefined);
    hasUserPlayedRoundRef.current = false;
    previousRoundEndedRef.current = Boolean(state?.isGameWon || state?.isGameLost);
    pendingPopunderRoundKeyRef.current = null;
  };

  const getRoundKey = (): string | null => {
    if (!currentSolution) {
      return null;
    }

    if (mode === "daily") {
      return `daily-${wordLength}-${getTodayString()}`;
    }

    if (mode === "challenge") {
      return `challenge-${wordLength}-${toStorageIdentifier(currentSolution)}`;
    }

    return `infinite-${wordLength}-${infiniteGameId}`;
  };

  const triggerPopunder = () => {
    if (!isMountedRef.current) {
      return;
    }

    const existingScript = document.querySelector(
      'script[data-adsterra-popunder="true"]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src = POPUNDER_SCRIPT_SRC;
    script.async = true;
    script.setAttribute("data-adsterra-popunder", "true");
    document.body.appendChild(script);
  };

  const readStoredNumber = (
    storage: "localStorage" | "sessionStorage",
    key: string,
    fallbackRef: { current: number }
  ): number => {
    if (!isMountedRef.current) {
      return fallbackRef.current;
    }

    try {
      const raw = window[storage].getItem(key);
      if (!raw) {
        return fallbackRef.current;
      }

      const parsed = Number(raw);
      if (Number.isFinite(parsed) && parsed >= 0) {
        fallbackRef.current = parsed;
        return parsed;
      }
    } catch (error) {
      console.error(`Failed to read ${key}:`, error);
    }

    return fallbackRef.current;
  };

  const writeStoredNumber = (
    storage: "localStorage" | "sessionStorage",
    key: string,
    value: number,
    fallbackRef: { current: number }
  ) => {
    fallbackRef.current = value;
    if (!isMountedRef.current) {
      return;
    }

    try {
      window[storage].setItem(key, String(value));
    } catch (error) {
      console.error(`Failed to write ${key}:`, error);
    }
  };

  const incrementCompletedRounds = (): number => {
    const current = readStoredNumber(
      "localStorage",
      POPUNDER_COMPLETED_ROUNDS_KEY,
      completedRoundsFallbackRef
    );
    const next = current + 1;
    writeStoredNumber(
      "localStorage",
      POPUNDER_COMPLETED_ROUNDS_KEY,
      next,
      completedRoundsFallbackRef
    );
    return next;
  };

  const canShowPopunder = (completedRounds: number): boolean => {
    if (completedRounds < POPUNDER_MIN_COMPLETED_ROUNDS) {
      return false;
    }

    const sessionShownCount = readStoredNumber(
      "sessionStorage",
      POPUNDER_SESSION_SHOWN_KEY,
      sessionShownCountFallbackRef
    );
    if (sessionShownCount >= POPUNDER_SESSION_CAP) {
      return false;
    }

    const lastShownAt = readStoredNumber(
      "localStorage",
      POPUNDER_LAST_SHOWN_AT_KEY,
      lastShownAtFallbackRef
    );
    if (lastShownAt > 0 && Date.now() - lastShownAt < POPUNDER_COOLDOWN_MS) {
      return false;
    }

    return true;
  };

  const markPopunderShown = () => {
    const sessionShownCount = readStoredNumber(
      "sessionStorage",
      POPUNDER_SESSION_SHOWN_KEY,
      sessionShownCountFallbackRef
    );
    writeStoredNumber(
      "sessionStorage",
      POPUNDER_SESSION_SHOWN_KEY,
      sessionShownCount + 1,
      sessionShownCountFallbackRef
    );
    writeStoredNumber(
      "localStorage",
      POPUNDER_LAST_SHOWN_AT_KEY,
      Date.now(),
      lastShownAtFallbackRef
    );
  };

  const canonicalize = (word: string): string | null => {
    if (!wordData) {
      return null;
    }
    return canonicalizeGuess(word, wordData);
  };

  const startInfiniteGame = () => {
    if (!wordData) {
      return;
    }
    const newSolution = getRandomWord(wordData);
    setInfiniteGameId(createInfiniteGameId(wordLength));
    initializeGameState(newSolution);
  };

  const getGameIdentifier = (
    targetMode: GameMode = mode,
    solution: string = currentSolution
  ): string | null => {
    if (!solution) {
      return null;
    }

    if (targetMode === "daily") {
      return `daily-${wordLength}-${getTodayString()}`;
    }

    if (targetMode === "challenge") {
      return `challenge-${wordLength}-${toStorageIdentifier(solution)}`;
    }

    if (targetMode === "infinite") {
      return `infinite-${wordLength}-${infiniteGameId}`;
    }

    return null;
  };

  const restoreState = (targetMode: GameMode, solution: string) => {
    if (!isMountedRef.current) {
      initializeGameState(solution);
      return;
    }

    const identifier =
      targetMode === "challenge" ? toStorageIdentifier(solution) : null;
    const key = getGameStateKey(targetMode, wordLength, identifier);

    if (!key) {
      initializeGameState(solution);
      return;
    }

    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        initializeGameState(solution);
        return;
      }

      const stored = JSON.parse(raw) as Partial<StoredGameState>;

      if (
        stored.length !== wordLength ||
        !stored.solution ||
        stored.solution !== solution
      ) {
        window.localStorage.removeItem(key);
        initializeGameState(solution);
        return;
      }

      if (targetMode === "daily") {
        const today = getTodayString();
        if (stored.playedOn && stored.playedOn !== today) {
          window.localStorage.removeItem(key);
          initializeGameState(solution);
          return;
        }
      }

      if (targetMode === "challenge" && identifier) {
        if (stored.challengeId && stored.challengeId !== identifier) {
          window.localStorage.removeItem(key);
          initializeGameState(solution);
          return;
        }
      }

      initializeGameState(
        solution,
        {
          guesses: stored.guesses ?? [],
          currentGuess: stored.currentGuess ?? "",
          isGameWon: stored.isGameWon ?? false,
          isGameLost: stored.isGameLost ?? false,
        },
        {
          skipCompletionEffects: Boolean(stored.isGameWon || stored.isGameLost),
        }
      );
    } catch (error) {
      console.error("Failed to restore game state:", error);
      window.localStorage.removeItem(key);
      initializeGameState(solution);
    }
  };

  const recordStatsResult = (won: boolean, guessesUsed: number) => {
    if (!isMountedRef.current) {
      return;
    }

    const gameId = getGameIdentifier();
    if (!gameId) {
      return;
    }

    const updatedStats = recordGameResult(
      wordLength,
      { gameId, won, guesses: guessesUsed },
      MAX_GUESSES
    );
    setStats(updatedStats);
  };

  const openStatsModal = () => {
    if (!isMountedRef.current) {
      return;
    }
    setStats(loadStats(wordLength, MAX_GUESSES));
    setIsStatsModalOpen(true);
  };

  useEffect(() => {
    isMountedRef.current = true;
    setStats(loadStats(wordLength, MAX_GUESSES));
    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;

    setWordData(null);
    setInitialModeResolved(false);
    setMode("daily");
    setChallengeWord(null);
    resetTransientState();
    setInfiniteGameId(createInfiniteGameId(wordLength));

    loadWordList(wordLength)
      .then((data) => {
        if (!cancelled) {
          setWordData(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load word list:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [wordLength]);

  useEffect(() => {
    if (!isMountedRef.current) {
      return;
    }
    setStats(loadStats(wordLength, MAX_GUESSES));
  }, [wordLength]);

  useEffect(() => {
    if (!wordData || !isMountedRef.current || initialModeResolved) {
      return;
    }

    const challenge = resolveChallengeWordFromUrl(
      (candidate) => canonicalizeGuess(candidate, wordData),
      wordLength
    );

    if (challenge) {
      setChallengeWord(challenge);
      setMode("challenge");
      restoreState("challenge", challenge);
    } else {
      const dailySolution = getWordOfDay(wordData);
      const dailyCompleted = isDailyGameCompleted(wordLength);

      if (dailyCompleted) {
        setMode("infinite");
        initializeGameState(getRandomWord(wordData));
      } else {
        setMode("daily");
        restoreState("daily", dailySolution);
      }
    }

    setInitialModeResolved(true);
  }, [
    initialModeResolved,
    wordData,
    wordLength,
  ]);

  useEffect(() => {
    if (!isMountedRef.current || !initialModeResolved || !wordData) {
      return;
    }

    if (mode === "daily") {
      const dailySolution = getWordOfDay(wordData);
      restoreState("daily", dailySolution);
    } else if (mode === "infinite") {
      startInfiniteGame();
    } else if (mode === "challenge" && challengeWord) {
      restoreState("challenge", challengeWord);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, wordData, challengeWord, initialModeResolved]);

  useEffect(() => {
    if (!skipWinEffectsRef.current && isGameWon) {
      setShowConfetti(true);
      const timeoutId = window.setTimeout(() => {
        setIsWinModalOpen(true);
      }, 1500);
      return () => window.clearTimeout(timeoutId);
    }
    skipWinEffectsRef.current = false;
    return undefined;
  }, [isGameWon]);

  useEffect(() => {
    if (!skipLoseEffectsRef.current && isGameLost) {
      setIsLoseModalOpen(true);
    }
    skipLoseEffectsRef.current = false;
  }, [isGameLost]);

  useEffect(() => {
    const roundEnded = isGameWon || isGameLost;

    if (
      roundEnded &&
      !previousRoundEndedRef.current &&
      hasUserPlayedRoundRef.current
    ) {
      const completedRounds = incrementCompletedRounds();
      const roundKey = getRoundKey();
      if (
        roundKey &&
        popunderShownRoundRef.current !== roundKey &&
        canShowPopunder(completedRounds)
      ) {
        pendingPopunderRoundKeyRef.current = roundKey;
      } else {
        pendingPopunderRoundKeyRef.current = null;
      }
    }

    previousRoundEndedRef.current = roundEnded;
  }, [isGameWon, isGameLost]);

  useEffect(() => {
    if (!isMountedRef.current || !initialModeResolved) {
      return;
    }

    if (!currentSolution) {
      return;
    }

    if (mode === "infinite") {
      return;
    }

    const identifier =
      mode === "challenge" ? toStorageIdentifier(currentSolution) : null;
    const key = getGameStateKey(mode, wordLength, identifier);

    if (!key) {
      return;
    }

    const payload: StoredGameState = {
      solution: currentSolution,
      guesses,
      currentGuess,
      isGameWon,
      isGameLost,
      length: wordLength,
    };

    if (mode === "daily") {
      payload.playedOn = getTodayString();
    } else if (mode === "challenge") {
      payload.challengeId = identifier ?? undefined;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(payload));
    } catch (error) {
      console.error("Failed to persist game state:", error);
    }
  }, [
    guesses,
    currentGuess,
    isGameWon,
    isGameLost,
    mode,
    currentSolution,
    initialModeResolved,
    wordLength,
  ]);

  const onChar = (value: string) => {
    if (
      wordData &&
      currentGuess.length < wordLength &&
      guesses.length < MAX_GUESSES &&
      !isGameWon &&
      !isGameLost
    ) {
      setCurrentGuess(`${currentGuess}${value}`.slice(0, wordLength));
    }
  };

  const onDelete = () => {
    if (!isGameWon && !isGameLost) {
      setCurrentGuess(currentGuess.slice(0, -1));
    }
  };

  const onEnter = () => {
    if (isGameWon || isGameLost || !wordData) {
      return;
    }

    if (currentGuess.length !== wordLength) {
      return;
    }

    const canonicalGuess = canonicalize(currentGuess);
    if (!canonicalGuess) {
      setIsWordNotFoundAlertOpen(true);
      window.setTimeout(() => setIsWordNotFoundAlertOpen(false), 2000);
      return;
    }

    if (guesses.length >= MAX_GUESSES) {
      return;
    }

    const newGuesses = [...guesses, canonicalGuess];
    const currentRowIndex = guesses.length;
    hasUserPlayedRoundRef.current = true;

    setRevealingRowIndex(currentRowIndex);
    setGuesses(newGuesses);
    setCurrentGuess("");

    const winningWord =
      normalizeWordInsensitive(canonicalGuess) ===
      normalizeWordInsensitive(currentSolution);

    window.setTimeout(() => {
      setRevealingRowIndex(undefined);

      if (winningWord) {
        if (mode === "daily") {
          completeDailyGame(wordLength, true, newGuesses.length, currentSolution);
        }
        recordStatsResult(true, newGuesses.length);
        setIsGameWon(true);
      } else if (newGuesses.length === MAX_GUESSES) {
        if (mode === "daily") {
          completeDailyGame(wordLength, false, newGuesses.length, currentSolution);
        }
        recordStatsResult(false, newGuesses.length);
        setIsGameLost(true);
      }
    }, 600);
  };

  const handleNewGame = () => {
    const pendingRoundKey = pendingPopunderRoundKeyRef.current;
    if (pendingRoundKey) {
      triggerPopunder();
      markPopunderShown();
      popunderShownRoundRef.current = pendingRoundKey;
      pendingPopunderRoundKeyRef.current = null;
    }

    if (mode === "challenge") {
      if (isMountedRef.current) {
        const identifier = toStorageIdentifier(currentSolution);
        const key = getGameStateKey("challenge", wordLength, identifier);
        if (key) {
          window.localStorage.removeItem(key);
        }
        clearChallengeFromUrl();
      }
      setChallengeWord(null);
      setMode("infinite");
      return;
    }

    if (mode === "daily") {
      setMode("infinite");
      return;
    }

    startInfiniteGame();
  };

  const handleModeSelection = (selected: "daily" | "infinite") => {
    if (mode === "challenge") {
      return;
    }
    if (selected === mode) {
      return;
    }
    setMode(selected);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isInfoModalOpen || isCreateGameModalOpen) {
        return;
      }

      if (event.key === "Enter") {
        if (isGameLost || isGameWon) {
          handleNewGame();
        } else {
          onEnter();
        }
      } else if (event.key === "Backspace") {
        if (!isGameWon && !isGameLost) {
          onDelete();
        }
      } else if (/^[a-zA-ZÀ-ÿ]$/.test(event.key)) {
        if (!isGameWon && !isGameLost) {
          onChar(event.key.toUpperCase());
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    currentGuess,
    guesses,
    isGameWon,
    isGameLost,
    isCreateGameModalOpen,
    isInfoModalOpen,
    mode,
  ]);

  const primaryActionLabel =
    mode === "infinite" ? "NOVO JOGO" : "IR PARA MODO INFINITO";

  const buildChallengeUrl = async (canonicalWord: string): Promise<string> => {
    return generateChallengeUrl(canonicalWord, challengePath);
  };

  if (!wordData || !currentSolution) {
    return (
      <div className="pb-8 pt-2 max-w-7xl mx-auto sm:px-6 lg:px-8 game-container">
        <GameLoadingPlaceholder wordLength={wordLength} />
      </div>
    );
  }

  return (
    <>
      <Confetti trigger={showConfetti} duration={3000} />
      <Alert message="Palavra não encontrada" isOpen={isWordNotFoundAlertOpen} />
      <div className="pb-8 pt-2 max-w-7xl mx-auto sm:px-6 lg:px-8 game-container">
        <div className="flex w-full max-w-2xl mx-auto items-center justify-between mb-4 gap-4 flex-wrap">
          <div className="flex items-start sm:items-center gap-2 flex-1 pl-2">
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1 text-xs font-medium text-gray-600">
              {mode === "challenge" ? (
                <span className="px-3 py-1 rounded-full bg-white text-primary-green shadow">
                  Desafio
                </span>
              ) : (
                <>
                  <label
                    className={`px-3 py-1 rounded-full cursor-pointer transition ${
                      mode === "daily"
                        ? "bg-white text-primary-green shadow"
                        : "hover:text-gray-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name="game-mode"
                      className="sr-only"
                      checked={mode === "daily"}
                      onChange={() => handleModeSelection("daily")}
                    />
                    Diário
                  </label>
                  <label
                    className={`px-3 py-1 rounded-full cursor-pointer transition ${
                      mode === "infinite"
                        ? "bg-white text-primary-green shadow"
                        : "hover:text-gray-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name="game-mode"
                      className="sr-only"
                      checked={mode === "infinite"}
                      onChange={() => handleModeSelection("infinite")}
                    />
                    Infinito
                  </label>
                </>
              )}
            </div>
            <button
              onClick={() => setIsModeInfoOpen(true)}
              title="Informações do modo atual"
              className="p-1 rounded bg-gray-100 transition-colors"
            >
              <Info className="h-6 w-6 text-gray-600 hover:text-primary-green transition-colors" />
            </button>
          </div>
          <div className="flex items-center space-x-2 pr-2">
            {mode === "infinite" && (
              <>
                <button
                  onClick={handleNewGame}
                  title="Novo Jogo"
                  className="hidden sm:inline-flex items-center p-1 px-3 rounded bg-primary-green transition-colors ml-1 text-white"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Novo Jogo
                </button>
                <button
                  onClick={handleNewGame}
                  title="Novo Jogo"
                  className="sm:hidden p-1 rounded bg-primary-green text-white transition-colors"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </>
            )}
            <button
              onClick={openStatsModal}
              title="Estatísticas"
              className="p-1 rounded bg-gray-100 transition-colors"
            >
              <BarChart3 className="h-6 w-6 text-gray-600 hover:text-primary-green transition-colors" />
            </button>
            <button
              onClick={() => setIsCreateGameModalOpen(true)}
              title="Criar desafio"
              className="p-1 rounded bg-gray-100 transition-colors"
            >
              <PlusCircle className="h-6 w-6 text-gray-600 hover:text-primary-green transition-colors" />
            </button>
            <button
              onClick={() => setIsInfoModalOpen(true)}
              title="Como jogar"
              className="p-1 rounded bg-gray-100 transition-colors"
            >
              <HelpCircle className="h-6 w-6 text-gray-600 hover:text-primary-green transition-colors" />
            </button>
          </div>
        </div>

        <Grid
          guesses={guesses}
          currentGuess={currentGuess}
          revealingRowIndex={revealingRowIndex}
          solution={currentSolution}
          wordLength={wordLength}
          maxGuesses={MAX_GUESSES}
        />
        <div className="flex justify-center my-6 max-w-2xl mx-auto px-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start bg-gray-100 rounded-full p-1 text-xs font-medium text-gray-600">
            <LengthSwitcher
              options={lengthOptions}
              currentLength={wordLength}
              className="flex items-center gap-1"
              label="Quantidade de letras"
              variant="inline"
            />
            <Link
              href={searchHref}
              prefetch
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir o Buscador Termo"
              className="inline-flex items-center rounded-full bg-primary-green px-3 py-1 text-xs font-semibold text-white shadow transition-colors hover:bg-primary-green/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green/40"
            >
              Buscador Termo
            </Link>
          </div>
        </div>
        <Keyboard
          onChar={onChar}
          onDelete={onDelete}
          onEnter={onEnter}
          guesses={guesses}
          solution={currentSolution}
        />
        <WinModal
          isOpen={isWinModalOpen}
          handleClose={() => {
            setIsWinModalOpen(false);
            setShowConfetti(false);
          }}
          guesses={guesses}
          solution={currentSolution}
          primaryActionLabel={primaryActionLabel}
          onPrimaryAction={handleNewGame}
          onShowStats={openStatsModal}
          wordLength={wordLength}
        />
        <LoseModal
          isOpen={isLoseModalOpen}
          handleClose={() => setIsLoseModalOpen(false)}
          guesses={guesses}
          solution={currentSolution}
          primaryActionLabel={primaryActionLabel}
          onPrimaryAction={handleNewGame}
          onShowStats={openStatsModal}
        />
        <InfoModal
          isOpen={isInfoModalOpen}
          handleClose={() => setIsInfoModalOpen(false)}
        />
        <StatsModal
          isOpen={isStatsModalOpen}
          handleClose={() => setIsStatsModalOpen(false)}
          stats={stats}
          maxGuesses={MAX_GUESSES}
        />
        <ModeInfoModal
          isOpen={isModeInfoOpen}
          handleClose={() => setIsModeInfoOpen(false)}
          currentMode={mode}
        />
        <CreateGameModal
          isOpen={isCreateGameModalOpen}
          handleClose={() => setIsCreateGameModalOpen(false)}
          wordLength={wordLength}
          validateWord={canonicalize}
          buildChallengeUrl={buildChallengeUrl}
        />
      </div>
    </>
  );
}

export default Game;
