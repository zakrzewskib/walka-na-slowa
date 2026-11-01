import type { PolishLetter } from './types';

export const WORD_LENGTH = 5;
export const WORDS_LENGTH = 6;
export const HIDDEN_LETTER = '-';
export const CURRENT_USER_ID = 'user1';

export const POLISH_ALPHABET_ROWS: PolishLetter[][] = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ['Ą', 'Ć', 'Ę', 'Ł', 'Ń', 'Ó', 'Ś', 'Ź', 'Ż'],
];

export const POLISH_ALPHABET: PolishLetter[] = POLISH_ALPHABET_ROWS.flat();
