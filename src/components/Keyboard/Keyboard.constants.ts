import { POLISH_ALPHABET_ROWS } from '../../constants';
import type { KeyboardKey } from '../../types';

const [firstRow, secondRow, thirdRow, ...restRows] = POLISH_ALPHABET_ROWS;

export const KEYBOARD_ROWS: KeyboardKey[][] = [
  firstRow,
  secondRow,
  ['Backspace', ...thirdRow, 'Enter'],
  ...restRows,
];
