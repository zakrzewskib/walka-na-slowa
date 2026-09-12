import { POLISH_ALPHABET } from '../../constants';
import type {
  Guess,
  KeyboardLetterStatus,
  KeyboardLetterStatusMap,
  PolishLetter,
} from '../../types';

const STATUS_PRIORITY: Record<KeyboardLetterStatus, number> = {
  unused: 0,
  absent: 1,
  present: 2,
  correct: 3,
};

function getLetterStatus(letter: { exists: boolean; correctPlace: boolean }): KeyboardLetterStatus {
  if (letter.correctPlace) return 'correct';
  if (letter.exists) return 'present';
  return 'absent';
}

function isPolishLetter(value: string, map: KeyboardLetterStatusMap): value is PolishLetter {
  return value in map;
}

export function calculateKeyboardState(guesses: Guess[]): KeyboardLetterStatusMap {
  const map = Object.fromEntries(
    POLISH_ALPHABET.map((letter) => [letter, { status: 'unused' as KeyboardLetterStatus }]),
  ) as KeyboardLetterStatusMap;

  for (const guess of guesses) {
    for (const letter of guess.evaluatedGuess.letters) {
      const key = letter.value.toUpperCase();

      if (!isPolishLetter(key, map)) continue; // guard against unexpected characters

      const current = map[key];
      const newStatus = getLetterStatus(letter);

      if (STATUS_PRIORITY[newStatus] > STATUS_PRIORITY[current.status]) {
        map[key] = { status: newStatus };
      }
    }
  }

  return map;
}
