import type { StateCreator } from 'zustand';
import { firebaseCreateGame, firebaseGetGame } from '../firebase/games';
import type { GameMode } from '../types';
import type { AppState, GameSlice, StoreMutators } from './types';

export const createGameSlice: StateCreator<AppState, StoreMutators, [], GameSlice> = (
  set,
  get,
) => ({
  gameId: '',
  correctWord: '',
  gameMode: 'versus',
  gameResult: null,
  gameStatus: null,

  createGame: async (gameMode: GameMode) => {
    const game = await firebaseCreateGame(gameMode);

    set({
      gameId: game.id,
      correctWord: game.correctWord,
      guesses: [],
      currentGuess: '',
      gameMode: gameMode,
      gameResult: null,
      gameStatus: game.gameStatus,
    });
  },

  loadGame: async (gameId) => {
    const game = await firebaseGetGame(gameId);
    // todo: Add loading state
    // todo: Add loading only user's guesses
    set({
      gameId,
      currentGuess: '',
      ...game,
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
      gameResult: null,
      gameStatus: null,
    });
  },
});
