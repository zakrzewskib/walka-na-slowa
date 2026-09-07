import { HIDDEN_LETTER } from '../../constants';
import type { Letter } from '../../types';

export function calculateDisplayValue(value: Letter['value']) {
  return value === HIDDEN_LETTER ? '' : value;
}

export function calculateBackgroundColor(letter: Letter) {
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

export function calculateBorderWidth(value: Letter['value']) {
  return value ? '0px' : '2px';
}
