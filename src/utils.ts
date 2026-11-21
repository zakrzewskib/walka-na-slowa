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
      return 'Przegrana! 😭'; // todo: Add "Przegrałeś/Przegrałaś/Przegrałoś" when user logs in
    } else {
      return 'Wygrana! 🏆';
    }
  } else {
    if (gameResult.winnerId === currentUserId) {
      return 'Wygrana! 🏆';
    } else if (gameResult.winnerId === enemyUserId) {
      return 'Przegrana! 😭';
    } else {
      return 'Remis! 🤝';
    }
  }
}
