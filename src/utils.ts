import type { GameResult } from './types';

export function gameResultToText(
  gameResult: GameResult,
  currentUserId: string,
  enemyUserId: string,
) {
  if (!gameResult) {
    return 'Rozpocznij grę';
  }
  if (gameResult.mode === 'solo') {
    if (gameResult.outcome === 'lost') {
      return 'Przegrałeś! 😭';
    } else {
      return 'Wygrałeś! 🏆';
    }
  } else {
    if (gameResult.winnerId === currentUserId) {
      return 'Wygrałeś! 🏆';
    } else if (gameResult.winnerId === enemyUserId) {
      return 'Przegrałeś! 😭';
    } else {
      return 'Remis! 🤝';
    }
  }
}
