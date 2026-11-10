import type { GameMode, GameResult, Guess, GuessSubmit, PolishLetter } from '../types';

export interface GameSlice {
  gameId: string;
  mode: GameMode;
  correctWord: string;
  gameResult: GameResult;
  createGame: (mode: GameMode) => Promise<void>;
  loadGame: (gameId: string) => Promise<void>;
  finishGame: () => Promise<void>;
}

export interface GuessSlice {
  guesses: Guess[];
  currentGuess: string;
  isSubmittingGuess: boolean;
  typeLetter: (letter: PolishLetter) => void;
  deleteLetter: () => void;
  submitGuess: (guess: GuessSubmit) => Promise<void>;
}

export type AppState = GameSlice & GuessSlice;

// Every slice creator needs to know which middleware wraps the store
export type StoreMutators = [['zustand/persist', unknown]];
