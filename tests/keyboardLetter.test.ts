import { describe, expect, it } from 'vitest';
import {
  calculateBackgroundAndBorderColor,
  calculateColor,
  calculateFontSize,
  calculateFontSizeMdDown,
  calculateValue,
  calculateWidth,
} from '../src/components/KeyboardLetter/KeyboardLetter.utils';

describe('calculateBackgroundAndBorderColor', () => {
  it.each([
    ['correct', 'green.500'],
    ['present', 'yellow.500'],
    ['absent', 'gray.400'],
    ['unused', 'gray.200'],
  ] as const)('returns %s color for %s status', (status, expected) => {
    expect(calculateBackgroundAndBorderColor(status)).toBe(expected);
  });
});

describe('calculateColor', () => {
  it('returns black for unused', () => {
    expect(calculateColor('unused')).toBe('black');
  });
  it.each(['correct', 'present', 'absent'] as const)('returns white for %s', (status) => {
    expect(calculateColor(status)).toBe('white');
  });
});

describe('calculateValue', () => {
  it('renders backspace icon', () => {
    expect(calculateValue('Backspace')).toBe('⌫');
  });
  it('renders Enter as-is', () => {
    expect(calculateValue('Enter')).toBe('Enter');
  });
  it('uppercases letters', () => {
    expect(calculateValue('a')).toBe('A');
  });
});

describe('calculateWidth', () => {
  it('row 0 uses first row width regardless of key', () => {
    expect(calculateWidth(0, 'a')).toBe('60px');
    expect(calculateWidth(0, 'Enter')).toBe('60px');
  });
  it.each([1, 3] as const)('row %i uses second/fourth row width', (row) => {
    expect(calculateWidth(row, 'a')).toBe('67px');
  });
  it('row 2 gives special keys the wide width', () => {
    expect(calculateWidth(2, 'Enter')).toBe('85px');
    expect(calculateWidth(2, 'Backspace')).toBe('85px');
  });
  it('row 2 gives regular letters the narrow width', () => {
    expect(calculateWidth(2, 'a')).toBe('62px');
  });
  it('throws on an invalid row', () => {
    expect(() => calculateWidth(9, 'a')).toThrow('Unexpected keyboard row');
  });
});

describe('font sizing', () => {
  it('backspace gets larger font sizes than letters', () => {
    expect(calculateFontSize('Backspace')).toBe('24px');
    expect(calculateFontSize('a')).toBe('18px');
    expect(calculateFontSizeMdDown('Backspace')).toBe('20px');
    expect(calculateFontSizeMdDown('a')).toBe('16px');
  });
});
