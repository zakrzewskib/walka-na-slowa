import type { LetterStatus, LettersUsed, PolishLetter } from './types';

export const WORD_LENGTH = 5;
export const WORDS_LENGTH = 6;
export const HIDDEN_LETTER = '-';
export const MOCK_CORRECT_WORD = 'LALKA'; // todo: unify uppercase/lowercase in #21

// prettier-ignore
export const POLISH_ALPHABET: PolishLetter[] = [
  'q','w','e','r','t','y','u','i','o','p',
  'a','s','d','f','g','h','j','k','l',
  'z','x','c','v','b','n','m',
  'ą','ć','ę','ł','ń','ó','ś','ź','ż',
];

// to be deleted
const statuses: LetterStatus[] = ['unused', 'correct', 'present', 'absent'];

export const STARTING_LETTERS_USED: LettersUsed = POLISH_ALPHABET.reduce(
  (acc, key) => {
    acc[key] = {
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };
    return acc;
  },
  {} as LettersUsed,
);
