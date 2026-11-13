import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toaster } from '../components/ui/toaster';
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
        gameResult: state.gameResult,
      }),

      // load game after rehydrate
      onRehydrateStorage: () => (state) => {
        if (!state?.gameId) return;

        state.loadGame(state.gameId).catch((error) => {
          logger.error('Store: Could not load game on rehydrate', error);

          toaster.create({
            title: 'Błąd',
            description:
              'Nie udało się wczytać poprzedniej gry. Odśwież stronę lub stwórz nową grę',
            type: 'error',
            closable: true,
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
