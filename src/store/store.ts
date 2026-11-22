import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logger } from '../logger/logger';
import { createGameSlice } from './gameSlice';
import { createGuessSlice } from './guessSlice';
import type { AppState } from './types';

export const useAppStore = create<AppState>()(
  persist(
    (...args) => ({
      ...createGameSlice(...args),
      ...createGuessSlice(...args),
    }),
    {
      name: 'walka-na-slowa-storage',

      partialize: (state) => ({
        gameId: state.gameId,
        gameMode: state.gameMode,
        gameStatus: state.gameStatus,
        // gameResult: state.gameResult,
      }),

      // load game after rehydrate
      onRehydrateStorage: () => (state, error) => {
        if (error || !state?.gameId) return;

        // loadGame sets state to the new game
        state.loadGame(state.gameId).catch((error: Error) => {
          logger.error('Store: Could not load game on rehydrate', error);

          useAppStore.setState({
            getGameError:
              'Nie udało się wczytać gry. Proszę stworzyć nową grę lub odświeżyć stronę.',
          });
        });
      },
    },
  ),
);

// For testing
if (import.meta.env.DEV && typeof window !== 'undefined' && window.Cypress) {
  window.useAppStore = useAppStore;
}
