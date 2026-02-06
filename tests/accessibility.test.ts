import { describe, expect, it } from 'vitest';
import { HIDDEN_LETTER } from '../src/constants';
import { getLetterAriaLabel } from '../src/utils/accessibility';

describe('getLetterAriaLabel', () => {
  it('returns correct label for empty cell on player turn', () => {
    const letter = { id: '1', value: '', exists: false, correctPlace: false };
    expect(getLetterAriaLabel(letter, true, true)).toBe(
      'Empty cell, your turn',
    );
  });

  it('returns correct label for hidden opponent letter', () => {
    const letter = {
      id: '1',
      value: HIDDEN_LETTER,
      exists: true,
      correctPlace: true,
    };
    expect(getLetterAriaLabel(letter, false, false)).toBe(
      'Opponent letter, hidden',
    );
  });

  it('returns correct label for letter in correct position', () => {
    const letter = { id: '1', value: 'Z', exists: true, correctPlace: true };
    expect(getLetterAriaLabel(letter, false, true)).toBe(
      'Letter Z, correct position',
    );
  });

  it('returns correct label for letter in wrong position', () => {
    const letter = { id: '1', value: 'A', exists: true, correctPlace: false };
    expect(getLetterAriaLabel(letter, false, true)).toBe(
      'Letter A, wrong position',
    );
  });

  it('returns correct label for letter not in word', () => {
    const letter = { id: '1', value: 'M', exists: false, correctPlace: false };
    expect(getLetterAriaLabel(letter, false, true)).toBe(
      'Letter M, not in word',
    );
  });
});
