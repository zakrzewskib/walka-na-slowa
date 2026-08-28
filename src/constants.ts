import type { LettersUsed, PolishLetter } from './types';

export const WORD_LENGTH = 5;
export const WORDS_LENGTH = 6;
export const HIDDEN_LETTER = '-';
export const MOCK_CORRECT_WORD = 'LALKA';

// prettier-ignore
export const POLISH_ALPHABET: PolishLetter[] = [
  'q','w','e','r','t','y','u','i','o','p',
  'a','s','d','f','g','h','j','k','l',
  'z','x','c','v','b','n','m',
  'ą','ć','ę','ł','ń','ó','ś','ź','ż',
]

export const STARTING_LETTERS_USED: LettersUsed = POLISH_ALPHABET.reduce(
  (acc, key) => {
    acc[key] = { status: 'unused' };
    return acc;
  },
  {} as LettersUsed,
);
