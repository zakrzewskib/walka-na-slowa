import { describe, expect, it } from 'vitest';
import { toPendingRow } from '../src/components/GameBoard/GameBoard.utils';
import { WORD_LENGTH } from '../src/constants';

describe('toPendingRow', () => {
  it('returns a row of WORD_LENGTH empty letters when called without arguments', () => {
    const row = toPendingRow();

    expect(row.letters).toHaveLength(WORD_LENGTH);
    row.letters.forEach((letter) => {
      expect(letter).toEqual({ value: '', exists: false, correctPlace: false });
    });
  });

  it('returns a row of empty letters for an empty string', () => {
    const row = toPendingRow('');

    expect(row.letters.map((l) => l.value)).toEqual(Array(WORD_LENGTH).fill(''));
  });

  it('fills typed letters first and leaves the rest empty', () => {
    const word = 'a'.repeat(Math.max(WORD_LENGTH - 1, 0));
    const row = toPendingRow(word);

    expect(row.letters).toHaveLength(WORD_LENGTH);
    row.letters.forEach((letter, i) => {
      expect(letter.value).toBe(word[i] ?? '');
    });
  });

  it('fills every slot when the word is exactly WORD_LENGTH long', () => {
    const word = 'x'.repeat(WORD_LENGTH);
    const row = toPendingRow(word);

    expect(row.letters.map((l) => l.value).join('')).toBe(word);
  });

  it('ignores characters beyond WORD_LENGTH', () => {
    const word = 'z'.repeat(WORD_LENGTH + 3);
    const row = toPendingRow(word);

    expect(row.letters).toHaveLength(WORD_LENGTH);
    expect(row.letters.map((l) => l.value).join('')).toBe('z'.repeat(WORD_LENGTH));
  });

  it('preserves the order of typed letters', () => {
    const word = 'abcdefghij'.slice(0, WORD_LENGTH);
    const row = toPendingRow(word);

    expect(row.letters.map((l) => l.value)).toEqual(word.split(''));
  });

  it('always marks letters as not existing and not in the correct place', () => {
    const row = toPendingRow('a'.repeat(WORD_LENGTH));

    row.letters.forEach((letter) => {
      expect(letter.exists).toBe(false);
      expect(letter.correctPlace).toBe(false);
    });
  });

  it('returns a new object with independent letters on every call', () => {
    const a = toPendingRow();
    const b = toPendingRow();

    expect(a).not.toBe(b);
    expect(a.letters).not.toBe(b.letters);
    expect(a.letters[0]).not.toBe(b.letters[0]);

    a.letters[0].value = 'q';
    expect(b.letters[0].value).toBe('');
  });
});
