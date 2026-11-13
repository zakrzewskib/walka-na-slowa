import { describe, expect, it } from 'vitest';
import { CURRENT_USER_ID, ENEMY_USER_ID } from '../src/constants';
import type { GameResult } from '../src/types';
import { gameResultToText } from '../src/utils';

describe('gameResultToText', () => {
  describe('without a result', () => {
    it('returns an empty string for null', () => {
      expect(gameResultToText(null, CURRENT_USER_ID, ENEMY_USER_ID)).toBe('');
    });
  });

  describe('solo mode', () => {
    it('returns "Przegrałeś! 😭" when the outcome is lost', () => {
      const result = { mode: 'solo', outcome: 'lost' } as GameResult;

      expect(gameResultToText(result, CURRENT_USER_ID, ENEMY_USER_ID)).toBe('Przegrałeś! 😭');
    });

    it('returns "Wygrałeś! 🏆" when the outcome is won', () => {
      const result = { mode: 'solo', outcome: 'won' } as GameResult;

      expect(gameResultToText(result, CURRENT_USER_ID, ENEMY_USER_ID)).toBe('Wygrałeś! 🏆');
    });
  });

  describe('versus mode', () => {
    it('returns "Wygrałeś! 🏆" when the current user is the winner', () => {
      const result = { mode: 'versus', winnerId: CURRENT_USER_ID } as GameResult;

      expect(gameResultToText(result, CURRENT_USER_ID, ENEMY_USER_ID)).toBe('Wygrałeś! 🏆');
    });

    it('returns "Przegrałeś! 😭" when the enemy is the winner', () => {
      const result = { mode: 'versus', winnerId: ENEMY_USER_ID } as GameResult;

      expect(gameResultToText(result, CURRENT_USER_ID, ENEMY_USER_ID)).toBe('Przegrałeś! 😭');
    });

    it('returns "Remis! 🤝" when there is no winner', () => {
      const result = { mode: 'versus', winnerId: null } as GameResult;

      expect(gameResultToText(result, CURRENT_USER_ID, ENEMY_USER_ID)).toBe('Remis! 🤝');
    });

    it('returns "Remis! 🤝" when the winner is neither the current user nor the enemy', () => {
      const result = { mode: 'versus', winnerId: 'someone-else' } as GameResult;

      expect(gameResultToText(result, CURRENT_USER_ID, ENEMY_USER_ID)).toBe('Remis! 🤝');
    });
  });
});
