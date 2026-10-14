import { serverTimestamp } from 'firebase/firestore';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  firebaseCreateGame,
  firebaseGetGame,
  firebaseSubmitGuess,
  HARDCODED_CORRECT_WORD,
} from '../firebase';
import type { Guess, GuessDTO, GuessSubmit } from '../types';
import { getWordResult } from '../utils/gameLogic';

interface AppState {
  gameId: string;
  correctWord: string;
  guesses: Guess[];
  createGame: () => Promise<void>;
  submitGuess: (guess: GuessSubmit) => Promise<void>;
  loadGame: (gameId: string) => Promise<void>;
  // todo: Add loading state
  // todo: Add clearing game/making it finished
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
          // todo: Add error handling
          return;
        }

        // todo: Move evaluation to backend
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

        await firebaseSubmitGuess(gameId, guess);
        // todo: roll back the optimistic update, or show an error toast/retry
      },

      loadGame: async (gameId: string) => {
        const game = await firebaseGetGame(gameId);
        if (!game) {
          // todo: Add error handling when cannot load game
          return;
        }
        // todo: Add loading only user's guesses
        set({ gameId: gameId, correctWord: game.correctWord, guesses: game.guesses });
      },
    }),
    {
      name: 'walka-na-slowa-storage',

      // only save gameId in the storage gameId is persisted
      partialize: (state) => ({ gameId: state.gameId }),

      // load game after
      onRehydrateStorage: () => (state) => {
        console.log('State on rehydrate: ', state);
        if (state?.gameId) {
          state.loadGame(state.gameId);
        }
      },
    },
  ),
);
