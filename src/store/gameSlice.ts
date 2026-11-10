import type { StateCreator } from 'zustand';
import { firebaseCreateGame, firebaseGetGame, HARDCODED_CORRECT_WORD } from '../firebase/games';
import type { GameMode } from '../types';
import type { AppState, GameSlice, StoreMutators } from './types';

export const createGameSlice: StateCreator<AppState, StoreMutators, [], GameSlice> = (
  set,
  get,
) => ({
  gameId: '',
  correctWord: '',
  mode: 'versus',
  gameResult: null,

  createGame: async (mode: GameMode) => {
    const gameId = await firebaseCreateGame(mode);
    set({
      gameId,
      correctWord: HARDCODED_CORRECT_WORD,
      guesses: [],
      currentGuess: '',
      mode: 'solo',
    });
  },

  loadGame: async (gameId) => {
    const game = await firebaseGetGame(gameId);
    // todo: Add loading state
    // todo: Add loading only user's guesses
    set({
      gameId,
      correctWord: game.correctWord,
      guesses: game.guesses,
      currentGuess: '',
      mode: game.mode,
    });
  },

  finishGame: async () => {
    if (!get().gameId) {
      // todo: Add error handling when there is no game
      return;
    }
    // todo: Add setting game status
    // todo: Add firebase game update
    set({
      gameId: '',
      correctWord: '',
      guesses: [],
      currentGuess: '',
      mode: get().mode,
      gameResult: null,
    });
  },
});
