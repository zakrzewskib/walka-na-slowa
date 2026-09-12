import type { KeyboardKey, KeyboardLetterStatus } from '../../types';

// 2 * SPECIAL_KEY_WIDTH + 7 * LETTER_KEY_WIDTH = 10 * FIRST_ROW_KEY_WIDTH (600px)
const FIRST_ROW_KEY_WIDTH = '60px';
const SECOND_AND_FOURTH_ROW_KEY_WIDTH = '67px'; // 10 * 60px / 9 rounded
const THIRD_ROW_SPECIAL_KEY_WIDTH = '85px'; // Enter / Backspace
const THIRD_ROW_LETTER_WIDTH = '62px'; // remaining letter keys

export function calculateBackgroundAndBorderColor(status: KeyboardLetterStatus) {
  if (status === 'correct') {
    return 'green.500';
  }
  if (status === 'present') {
    return 'yellow.500';
  }
  if (status === 'absent') {
    return 'gray.400';
  }

  return 'gray.200';
}

export function calculateColor(status: KeyboardLetterStatus) {
  return status === 'unused' ? 'black' : 'white';
}

export function calculateValue(value: KeyboardKey) {
  if (value === 'Backspace') {
    return '⌫';
  }

  if (value === 'Enter') {
    return value;
  }

  return value.toLocaleUpperCase();
}

export function calculateWidth(row: number, value: KeyboardKey) {
  switch (row) {
    case 0:
      return FIRST_ROW_KEY_WIDTH;
    case 1:
    case 3:
      return SECOND_AND_FOURTH_ROW_KEY_WIDTH;
    case 2:
      return value === 'Backspace' || value === 'Enter'
        ? THIRD_ROW_SPECIAL_KEY_WIDTH
        : THIRD_ROW_LETTER_WIDTH;
    default: {
      throw new Error('Unexpected keyboard row');
    }
  }
}

export function calculateFontSize(value: KeyboardKey) {
  if (value === 'Backspace') {
    return '24px';
  }
  return '18px';
}

export function calculateFontSizeMdDown(value: KeyboardKey) {
  if (value === 'Backspace') {
    return '20px';
  }
  return '16px';
}
