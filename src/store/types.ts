import type { Guess, GuessSubmit } from '../types';

export interface GameSlice {
  gameId: string;
  correctWord: string;
  createGame: () => Promise<void>;
  loadGame: (gameId: string) => Promise<void>;
  finishGame: () => Promise<void>;
}

export interface GuessSlice {
  guesses: Guess[];
  currentGuess: string;
  isSubmittingGuess: boolean;
  typeLetter: (letter: string) => void;
  deleteLetter: () => void;
  resetGuesses: (guesses?: Guess[]) => void;
  submitGuess: (guess: GuessSubmit) => Promise<void>;
}

export type AppState = GameSlice & GuessSlice;

// Every slice creator needs to know which middleware wraps the store
export type StoreMutators = [['zustand/persist', unknown]];
