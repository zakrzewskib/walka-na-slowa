import { HIDDEN_LETTER } from '../constants';
import type { ILetter, KeyboardKey, LetterStatus } from '../types';

export function getLetterAriaLabel(
  letter: ILetter,
  isCurrentTurn: boolean,
  isPlayer: boolean,
): string {
  const { value, exists, correctPlace } = letter;

  if (!value) {
    if (isCurrentTurn) {
      return isPlayer
        ? 'Puste pole, twoja tura'
        : 'Puste pole, tura przeciwnika';
    }
    return 'Puste pole';
  }

  if (value === HIDDEN_LETTER) {
    return 'Litera przeciwnika, ukryta';
  }

  if (correctPlace) {
    return `Litera ${value}, na poprawnym miejscu`;
  }
  if (exists) {
    return `Litera ${value}, na niepoprawnym miejscu`;
  }

  return `Litera ${value}, brak w słowie`;
}

const KEYBOARD_STATUS_TO_POLISH: Record<LetterStatus, string> = {
  absent: 'nieobecna',
  correct: 'obecna, na poprawnym miejscu',
  present: 'obecna, na niepoprawnym miejscu',
  unused: 'nieużyta',
};

export function getKeyboardLetterAriaLabel(
  value: KeyboardKey,
  status: LetterStatus,
): string {
  if (value === 'Backspace' || value === 'Enter') {
    return `Klawisz ${value}`;
  }
  return `Litera ${value}, ${KEYBOARD_STATUS_TO_POLISH[status]}.`;
}
