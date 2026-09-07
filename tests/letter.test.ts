import { describe, expect, it } from 'vitest';
import {
  calculateBackgroundColor,
  calculateBorderColor,
  calculateBorderWidth,
  calculateDisplayValue,
} from '../src/components/LetterItem/LetterItem.utils';
import { HIDDEN_LETTER } from '../src/constants';

describe('calculateDisplayValue', () => {
  it('hides the hidden letter sentinel', () => {
    expect(calculateDisplayValue(HIDDEN_LETTER)).toBe('');
  });
  it('shows a real letter', () => {
    expect(calculateDisplayValue('a')).toBe('a');
  });
  it('shows empty string as-is', () => {
    expect(calculateDisplayValue('')).toBe('');
  });
});

describe('calculateBackgroundColor', () => {
  it('correctPlace wins over everything', () => {
    expect(
      calculateBackgroundColor({
        correctPlace: true,
        exists: true,
        value: 'a',
      }),
    ).toBe('green.500');
  });
  it('exists wins when not correctPlace', () => {
    expect(
      calculateBackgroundColor({
        correctPlace: false,
        exists: true,
        value: 'a',
      }),
    ).toBe('yellow.500');
  });
  it('falls back to gray.400 when a value is guessed but wrong', () => {
    expect(
      calculateBackgroundColor({
        correctPlace: false,
        exists: false,
        value: 'a',
      }),
    ).toBe('gray.400');
  });
  it('defaults to gray.100 when empty/unfilled', () => {
    expect(
      calculateBackgroundColor({
        correctPlace: false,
        exists: false,
        value: '',
      }),
    ).toBe('gray.100');
  });
});

describe('calculateBorderColor', () => {
  it('blue when current turn and is the player', () => {
    expect(calculateBorderColor(true, true)).toBe('blue.500');
  });
  it('red when current turn and is the opponent', () => {
    expect(calculateBorderColor(true, false)).toBe('red.500');
  });
  it('gray when not current turn, regardless of isPlayer', () => {
    expect(calculateBorderColor(false, true)).toBe('gray.400');
    expect(calculateBorderColor(false, false)).toBe('gray.400');
  });
});

describe('calculateBorderWidth', () => {
  it('no border once a value is present', () => {
    expect(calculateBorderWidth('a')).toBe('0px');
  });
  it('border shown when empty', () => {
    expect(calculateBorderWidth('')).toBe('2px');
  });
});
