import type { StateCreator } from 'zustand';
import { firebaseCreateGame, firebaseGetGame, HARDCODED_CORRECT_WORD } from '../firebase/games';
import type { AppState, GameSlice, StoreMutators } from './types';

export const createGameSlice: StateCreator<AppState, StoreMutators, [], GameSlice> = (
  set,
  get,
) => ({
  gameId: '',
  correctWord: '',

  createGame: async () => {
    const gameId = await firebaseCreateGame();
    set({ gameId, correctWord: HARDCODED_CORRECT_WORD });
    get().resetGuesses();
  },

  loadGame: async (gameId) => {
    const game = await firebaseGetGame(gameId);
    // todo: Add loading only user's guesses
    set({ gameId, correctWord: game.correctWord });
    get().resetGuesses(game.guesses);
  },

  finishGame: async () => {
    if (!get().gameId) {
      // todo: Add error handling when there is no game
      return;
    }
    // todo: Add setting game status
    // todo: Add firebase game update
    set({ gameId: '', correctWord: '' });
    get().resetGuesses();
  },
});
