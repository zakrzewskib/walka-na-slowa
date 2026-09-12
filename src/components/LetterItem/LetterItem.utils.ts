import { HIDDEN_LETTER } from '../../constants';
import type { LetterResult } from '../../types';

export function calculateDisplayValue(value: LetterResult['value']) {
  return value === HIDDEN_LETTER ? '' : value;
}

export function calculateBackgroundColor(letter: LetterResult) {
  const { correctPlace, exists, value } = letter;

  if (correctPlace) {
    return 'green.500';
  }
  if (exists) {
    return 'yellow.500';
  }
  if (value) {
    return 'gray.400';
  }
  return 'gray.100';
}

export function calculateBorderColor(isCurrentTurn: boolean, isPlayer: boolean) {
  if (isCurrentTurn) {
    return isPlayer ? 'blue.500' : 'red.500';
  }
  return 'gray.400';
}

export function calculateBorderWidth(value: LetterResult['value']) {
  return value ? '0px' : '2px';
}
