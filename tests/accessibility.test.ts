import { describe, expect, it } from 'vitest';
import { HIDDEN_LETTER } from '../src/constants';
import {
  getKeyboardLetterAriaLabel,
  getLetterAriaLabel,
} from '../src/utils/accessibility';

describe('getLetterAriaLabel', () => {
  it('returns correct label for empty cell on player turn', () => {
    const letter = { id: '1', value: '', exists: false, correctPlace: false };
    expect(getLetterAriaLabel(letter, true, true)).toBe(
      'Puste pole, twoja tura',
    );
  });

  it('returns correct label for empty cell on opponent turn', () => {
    const letter = { id: '1', value: '', exists: false, correctPlace: false };
    expect(getLetterAriaLabel(letter, true, false)).toBe(
      'Puste pole, tura przeciwnika',
    );
  });

  it('returns correct label for empty cell when not current turn', () => {
    const letter = { id: '1', value: '', exists: false, correctPlace: false };
    expect(getLetterAriaLabel(letter, false, true)).toBe('Puste pole');
  });

  it('returns correct label for hidden opponent letter', () => {
    const letter = {
      id: '1',
      value: HIDDEN_LETTER,
      exists: true,
      correctPlace: true,
    };
    expect(getLetterAriaLabel(letter, false, false)).toBe(
      'Litera przeciwnika, ukryta',
    );
  });

  it('returns correct label for letter in correct position', () => {
    const letter = { id: '1', value: 'Z', exists: true, correctPlace: true };
    expect(getLetterAriaLabel(letter, false, true)).toBe(
      'Litera Z, na poprawnym miejscu',
    );
  });

  it('returns correct label for letter in wrong position', () => {
    const letter = { id: '1', value: 'A', exists: true, correctPlace: false };
    expect(getLetterAriaLabel(letter, false, true)).toBe(
      'Litera A, na niepoprawnym miejscu',
    );
  });

  it('returns correct label for letter not in word', () => {
    const letter = { id: '1', value: 'M', exists: false, correctPlace: false };
    expect(getLetterAriaLabel(letter, false, true)).toBe(
      'Litera M, brak w słowie',
    );
  });
});

describe('getKeyboardLetterAriaLabel', () => {
  it('returns correct label for absent status', () => {
    expect(getKeyboardLetterAriaLabel('a', 'absent')).toBe(
      'Litera a, jest nieobecna.',
    );
  });

  it('returns correct label for correct status', () => {
    expect(getKeyboardLetterAriaLabel('z', 'correct')).toBe(
      'Litera z, jest obecna, na poprawnym miejscu.',
    );
  });

  it('returns correct label for present status', () => {
    expect(getKeyboardLetterAriaLabel('m', 'present')).toBe(
      'Litera m, jest obecna, na niepoprawnym miejscu.',
    );
  });

  it('returns correct label for unused status', () => {
    expect(getKeyboardLetterAriaLabel('q', 'unused')).toBe(
      'Litera q, jest nieużyta.',
    );
  });

  it('returns correct label for Enter', () => {
    expect(getKeyboardLetterAriaLabel('q', 'unused')).toBe('Klawisz Enter');
  });

  it('returns correct label for Backspace', () => {
    expect(getKeyboardLetterAriaLabel('q', 'unused')).toBe('Klawisz Backspace');
  });
});
