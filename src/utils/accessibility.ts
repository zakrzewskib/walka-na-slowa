import { HIDDEN_LETTER } from '../constants';
import type { ILetter } from '../types';

export function getLetterAriaLabel(
  letter: ILetter,
  isCurrentTurn: boolean,
  isPlayer: boolean,
): string {
  const { value, exists, correctPlace } = letter;

  if (!value) {
    if (isCurrentTurn) {
      return isPlayer ? 'Empty cell, your turn' : 'Empty cell, opponent turn';
    }
    return 'Empty cell';
  }

  if (value === HIDDEN_LETTER) {
    return 'Opponent letter, hidden';
  }

  if (correctPlace) {
    return `Letter ${value}, correct position`;
  }
  if (exists) {
    return `Letter ${value}, wrong position`;
  }

  return `Letter ${value}, not in word`;
}
