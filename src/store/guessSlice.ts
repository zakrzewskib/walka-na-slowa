import type { StateCreator } from 'zustand';
import { WORD_LENGTH } from '../constants';
import { firebaseSubmitGuess } from '../firebase/games';
import { logger } from '../logger/logger';
import type { Guess } from '../types';
import { getWordResult } from '../utils/gameLogic';
import type { AppState, GuessSlice, StoreMutators } from './types';

export const createGuessSlice: StateCreator<AppState, StoreMutators, [], GuessSlice> = (
  set,
  get,
) => ({
  guesses: [],
  currentGuess: '',
  isSubmittingGuess: false,

  typeLetter: (letter) => {
    set((state) =>
      state.currentGuess.length < WORD_LENGTH
        ? { currentGuess: state.currentGuess + letter }
        : state,
    );
  },

  deleteLetter: () => {
    set((state) => ({ currentGuess: state.currentGuess.slice(0, -1) }));
  },

  submitGuess: async (guessSubmit) => {
    const { gameId, correctWord } = get();

    if (!gameId || !correctWord) {
      logger.error('Store: Could not submit guess to empty gameId or correct word', {
        gameId,
        correctWord,
      });
      throw new Error('Store: gameId or correct word does not exist!');
    }

    // todo: Move evaluation to backend
    const guess: Guess = {
      ...guessSubmit,
      evaluatedGuess: getWordResult(guessSubmit.value, correctWord),
    };

    // optimistic update: add the row and clear the typed word in one update
    set((state) => ({
      guesses: [...state.guesses, guess],
      currentGuess: '',
      isSubmittingGuess: true,
    }));

    try {
      await firebaseSubmitGuess(gameId, guess);
    } catch (error) {
      // undo the optimistic update and give the word back so the user can retry
      set((state) => ({
        guesses: state.guesses.filter((g) => g.id !== guess.id),
        currentGuess: guessSubmit.value,
      }));
      throw error;
    } finally {
      set({ isSubmittingGuess: false });
    }
  },
});
