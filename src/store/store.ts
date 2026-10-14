import { serverTimestamp } from 'firebase/firestore';
import { create } from 'zustand';
import { firebaseCreateGame, firebaseSubmitGuess, HARDCODED_CORRECT_WORD } from '../firebase';
import type { Guess, GuessDTO, GuessSubmit } from '../types';
import { getWordResult } from '../utils/gameLogic';

interface AppState {
  gameId: string;
  correctWord: string;
  guesses: Guess[];
  createGame: () => Promise<void>;
  submitGuess: (guess: GuessSubmit) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  gameId: '',
  guesses: [],
  correctWord: '',

  createGame: async () => {
    const gameId = await firebaseCreateGame();
    set({ gameId: gameId, correctWord: HARDCODED_CORRECT_WORD, guesses: [] });
  },

  submitGuess: async (guessSubmit: GuessSubmit) => {
    const { gameId, correctWord } = get();

    if (!gameId || !correctWord) {
      // todo: Add error handling
      return;
    }

    const evaluatedGuess = getWordResult(guessSubmit.value, correctWord);

    const guess: GuessDTO = {
      ...guessSubmit,
      evaluatedGuess,
      createdAt: serverTimestamp(),
    };

    // optimistic update — show it locally immediately
    set((state) => ({
      guesses: [...state.guesses, guess],
    }));

    try {
      await firebaseSubmitGuess(gameId, guess);
    } catch {
      // todo: roll back the optimistic update, or show an error toast/retry
    }
  },
}));
