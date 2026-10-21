import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  firebaseCreateGame,
  firebaseGetGame,
  firebaseSubmitGuess,
  HARDCODED_CORRECT_WORD,
} from '../firebase';
import type { Guess, GuessSubmit } from '../types';
import { getWordResult } from '../utils/gameLogic';

interface AppState {
  gameId: string;
  correctWord: string;
  guesses: Guess[];
  createGame: () => Promise<void>;
  submitGuess: (guess: GuessSubmit) => Promise<void>;
  loadGame: (gameId: string) => Promise<void>;
  finishGame: () => Promise<void>;
  // todo: Add loading state
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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
          throw new Error('Nie udało się dodać zgadnięcia, proszę spróbować później.');
        }

        // todo: Move evaluation to backend
        const evaluatedGuess = getWordResult(guessSubmit.value, correctWord);

        const guess: Guess = {
          ...guessSubmit,
          evaluatedGuess,
        };

        // optimistic update — show it locally immediately
        set((state) => ({
          guesses: [...state.guesses, guess],
        }));

        try {
          await firebaseSubmitGuess(gameId, guess);
        } catch (error) {
          // undo optimistic update
          set((s) => ({ guesses: s.guesses.filter((g) => g.id !== guess.id) }));
          throw error;
        }
      },

      loadGame: async (gameId: string) => {
        const game = await firebaseGetGame(gameId);

        // todo: Add loading only user's guesses
        set({ gameId: gameId, correctWord: game.correctWord, guesses: game.guesses });
      },

      finishGame: async () => {
        const { gameId } = get();
        if (!gameId) {
          // todo: Add error handling when there is not game
          return;
        }
        // todo: Add setting game status
        // todo: Add firebase game update
        set({ gameId: '', correctWord: '', guesses: [] });
      },
    }),
    {
      name: 'walka-na-slowa-storage',

      // only save gameId in the local storage
      partialize: (state) => ({ gameId: state.gameId }),

      // load game after
      onRehydrateStorage: () => (state) => {
        if (state?.gameId) {
          state.loadGame(state.gameId);
        }
      },
    },
  ),
);

// For testing
declare global {
  interface Window {
    Cypress?: unknown;
    useAppStore?: typeof useAppStore;
  }
}

if (typeof window !== 'undefined' && window.Cypress) {
  window.useAppStore = useAppStore;
}
