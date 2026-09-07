import { POLISH_ALPHABET } from '../../constants';
import type { Guess, LetterStatus, LetterStatusMap, PolishLetter } from '../../types';

const STATUS_PRIORITY: Record<LetterStatus, number> = {
  unused: 0,
  absent: 1,
  present: 2,
  correct: 3,
};

function getLetterStatus(letter: { exists: boolean; correctPlace: boolean }): LetterStatus {
  if (letter.correctPlace) return 'correct';
  if (letter.exists) return 'present';
  return 'absent';
}

export function calculateKeyboardState(guesses: Guess[]): LetterStatusMap {
  const map = Object.fromEntries(
    POLISH_ALPHABET.map((letter) => [letter, { status: 'unused' as LetterStatus }]),
  ) as LetterStatusMap;

  for (const guess of guesses) {
    for (const letter of guess.word.letters) {
      const key = letter.value.toUpperCase() as PolishLetter;
      const current = map[key];

      if (!current) continue; // guard against unexpected characters

      const newStatus = getLetterStatus(letter);

      if (STATUS_PRIORITY[newStatus] > STATUS_PRIORITY[current.status]) {
        map[key] = { status: newStatus };
      }
    }
  }

  return map;
}
