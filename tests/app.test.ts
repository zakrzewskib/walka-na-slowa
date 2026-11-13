import { describe, expect, it } from 'vitest';
import { gameResultToText } from '../src/App.utils';
import { CURRENT_USER_ID, ENEMY_USER_ID } from '../src/constants';
import type { GameResult } from '../src/types';

describe('gameResultToText', () => {
  describe('without a result', () => {
    it('returns an empty string for null', () => {
      expect(gameResultToText(null)).toBe('');
    });
  });

  describe('solo mode', () => {
    it('returns "przegrałeś" when the outcome is lost', () => {
      const result = { mode: 'solo', outcome: 'lost' } as GameResult;

      expect(gameResultToText(result)).toBe('przegrałeś');
    });

    it('returns "wygrałeś" when the outcome is won', () => {
      const result = { mode: 'solo', outcome: 'won' } as GameResult;

      expect(gameResultToText(result)).toBe('wygrałeś');
    });
  });

  describe('versus mode', () => {
    it('returns "wygrałeś" when the current user is the winner', () => {
      const result = { mode: 'versus', winnerId: CURRENT_USER_ID } as GameResult;

      expect(gameResultToText(result)).toBe('wygrałeś');
    });

    it('returns "przegrałeś" when the enemy is the winner', () => {
      const result = { mode: 'versus', winnerId: ENEMY_USER_ID } as GameResult;

      expect(gameResultToText(result)).toBe('przegrałeś');
    });

    it('returns "remis" when there is no winner', () => {
      const result = { mode: 'versus', winnerId: null } as GameResult;

      expect(gameResultToText(result)).toBe('remis');
    });

    it('returns "remis" when the winner is neither the current user nor the enemy', () => {
      const result = { mode: 'versus', winnerId: 'someone-else' } as GameResult;

      expect(gameResultToText(result)).toBe('remis');
    });
  });
});
