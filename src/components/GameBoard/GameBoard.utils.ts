import { WORD_LENGTH } from '../../constants';
import type { EvaluatedGuess } from '../../types';

// A not-yet-submitted row: typed letters first, the rest empty
export function toPendingRow(word = ''): EvaluatedGuess {
  return {
    letters: Array.from({ length: WORD_LENGTH }, (_, i) => ({
      value: word[i] ?? '',
      exists: false,
      correctPlace: false,
    })),
  };
}
