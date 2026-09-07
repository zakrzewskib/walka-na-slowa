import type { LetterStatus, LetterStatusMap, PolishLetter } from './types';

export const WORD_LENGTH = 5;
export const WORDS_LENGTH = 6;
export const HIDDEN_LETTER = '-';
export const MOCK_CORRECT_WORD = 'LALKA';

// prettier-ignore
export const POLISH_ALPHABET: PolishLetter[] = [
  'Q','W','E','R','T','Y','U','I','O','P', // 1. ROW
  'A','S','D','F','G','H','J','K','L', // 2. ROW
  'Z','X','C','V','B','N','M', // 3. ROW
  'Ą','Ć','Ę','Ł','Ń','Ó','Ś','Ź','Ż', // 4. ROW
];

// Random statuses on initial keyboard letters will be deleted in #21
const statuses: LetterStatus[] = ['unused', 'correct', 'present', 'absent'];

export const STARTING_LETTERS_USED: LetterStatusMap = Object.fromEntries(
  POLISH_ALPHABET.map((key) => [
    key,
    { status: statuses[Math.floor(Math.random() * statuses.length)] },
  ]),
) as LetterStatusMap;
