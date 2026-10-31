import type { KeyboardKey } from '../../types';

export const KEYBOARD_ROWS: KeyboardKey[][] = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Backspace', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Enter'],
  ['Ą', 'Ć', 'Ę', 'Ł', 'Ń', 'Ó', 'Ś', 'Ź', 'Ż'],
];

export const LETTERS = new Set<string>(
  KEYBOARD_ROWS.flat().filter((key) => key !== 'Backspace' && key !== 'Enter'),
);
