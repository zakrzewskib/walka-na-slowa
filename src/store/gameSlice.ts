import type { FirebaseError } from 'firebase/app';
import type { StateCreator } from 'zustand';
import { ENEMY_USER_ID } from '../constants';
import { firebaseCreateGame, firebaseFinishGame, firebaseGetGame } from '../firebase/games';
import type { GameMode, GameResult } from '../types';
import type { AppState, GameSlice, StoreMutators } from './types';

export const createGameSlice: StateCreator<AppState, StoreMutators, [], GameSlice> = (
  set,
  get,
) => ({
  // todo: Think if it should be a game object
  gameId: '',
  correctWord: '',
  gameMode: 'versus',
  gameResult: null,
  gameStatus: null,
  getGameError: null,

  createGame: async (gameMode: GameMode) => {
    set({
      getGameError: null,
      gameStatus: null,
      gameResult: null,
    });

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

    if (get().gameId && get().gameId !== gameId) return;

    // todo: Add loading state
    // todo: Add loading only user's guesses
    set({
      gameId,
      currentGuess: '',
      ...game,
      getGameError: null,
    });
  },

  surrenderGame: async () => {
    const gameId = get().gameId;

    if (!gameId || get().gameStatus === 'finished') return;

    const gameResult: GameResult =
      get().gameMode === 'solo'
        ? { mode: 'solo', outcome: 'lost' }
        : { mode: 'versus', winnerId: ENEMY_USER_ID };

    try {
      await firebaseFinishGame(gameId, gameResult);
    } catch (error) {
      const err = error as unknown as FirebaseError;

      // Reset state when could not finish game that does not exist
      if (err.code === 'not-found') {
        set({
          gameId: '',
          gameStatus: null,
          gameResult: null,
          currentGuess: '',
          getGameError: null,
        });
      }
    }

    set({
      gameResult,
      gameStatus: 'finished',
      currentGuess: '',
    });
  },
});
