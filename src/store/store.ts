import { create } from 'zustand';
import { firebaseCreateGame } from '../firebase';
import type { Guess } from '../types';

interface AppState {
  guesses: Guess[];
  addGuess: (guess: Guess) => void;
  setGuesses: (guesses: Guess[]) => void;
  clearGuesses: () => void;
  createGame: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  guesses: [],
  addGuess: (guess) => set((state) => ({ guesses: [...state.guesses, guess] })),
  setGuesses: (guesses) => set({ guesses }),
  clearGuesses: () => set({ guesses: [] }),
  createGame: async () => {
    await firebaseCreateGame();
  },
}));
