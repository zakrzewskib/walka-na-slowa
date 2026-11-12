import type { StateCreator } from 'zustand';
import { WORD_LENGTH } from '../constants';
import { firebaseSubmitGuess } from '../firebase/games';
import { logger } from '../logger/logger';
import type { AppState, GuessSlice, StoreMutators } from './types';

export const createGuessSlice: StateCreator<AppState, StoreMutators, [], GuessSlice> = (
  set,
  get,
) => ({
  guesses: [],
  currentGuess: '',
  isSubmittingGuess: false,

  // typeLetter and deleteLetter only edit the typed word. They do not check for an active game
  // or an in-flight submit: that is the job of the input layer (see useGuessInput), which
  // ignores keys while the input is disabled.
  typeLetter: (letter) => {
    set((state) =>
      state.currentGuess.length < WORD_LENGTH
        ? { currentGuess: state.currentGuess + letter.toLocaleUpperCase('pl-PL') }
        : state,
    );
  },

  deleteLetter: () => {
    set((state) => ({ currentGuess: state.currentGuess.slice(0, -1) }));
  },

  submitGuess: async (guessSubmit) => {
    // the store must be safe on its own, even if the UI guard fails
    if (get().isSubmittingGuess) return;

    const { gameId, correctWord } = get();

    if (!gameId || !correctWord) {
      logger.error('Store: Could not submit guess to empty gameId or correct word', {
        gameId,
        correctWord,
      });
      throw new Error('Store: gameId or correct word does not exist!');
    }

    try {
      set({ isSubmittingGuess: true });
      const { guess, gameResult } = await firebaseSubmitGuess(gameId, guessSubmit);

      set((state) => ({
        guesses: [...state.guesses, guess],
        currentGuess: '',
        gameResult: gameResult,
      }));
    } finally {
      set({ isSubmittingGuess: false });
    }
  },
});
