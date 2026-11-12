import { CURRENT_USER_ID, ENEMY_USER_ID } from './constants';
import type { GameResult } from './types';

export function gameResultToText(gameResult: GameResult) {
  if (!gameResult) {
    return '';
  }
  if (gameResult.mode === 'solo') {
    if (gameResult.outcome === 'lost') {
      return 'przegrałeś';
    } else {
      return 'wygrałeś';
    }
  } else {
    if (gameResult.winnerId === CURRENT_USER_ID) {
      return 'wygrałeś';
    } else if (gameResult.winnerId === ENEMY_USER_ID) {
      return 'przegrałeś';
    } else {
      return 'remis';
    }
  }
}
