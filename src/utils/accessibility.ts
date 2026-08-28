import { HIDDEN_LETTER } from '../constants';
import type { ILetter, KeyboardKey, LetterStatus } from '../types';

// todo: change to polish
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

// todo: add tests
export function getKeyboardLetterAriaLabel(
  value: KeyboardKey,
  status: LetterStatus,
): string {
  const statusToPolish = (() => {
    if (status === 'absent') {
      return 'nieobecna';
    }

    if (status === 'correct') {
      return 'obecna, na poprawnym miejscu';
    }

    if (status === 'present') {
      return 'obecna, na niepoprawnym miejscu';
    }

    if (status === 'unused') {
      return 'nieużyta';
    }
  })();

  return `Litera ${value} jest ${statusToPolish}.`;
}
