export interface Letter {
  value: string;
  exists: boolean;
  correctPlace: boolean;
}

export interface Word {
  id: string;
  letters: Letter[];
}

// prettier-ignore
export type PolishLetter =
  | 'q' | 'w' | 'e' | 'r' | 't' | 'y' | 'u' | 'i' | 'o' | 'p'
  | 'a' | 's' | 'd' | 'f' | 'g' | 'h' | 'j' | 'k' | 'l'
  | 'z' | 'x' | 'c' | 'v' | 'b' | 'n' | 'm'
  | 'ą' | 'ć' | 'ę' | 'ł' | 'ń' | 'ó' | 'ś' | 'ź' | 'ż';

export type KeyboardKey = PolishLetter | 'Backspace' | 'Enter';

export type LetterStatus = 'unused' | 'correct' | 'present' | 'absent';

export type LetterStatusMap = Record<PolishLetter, { status: LetterStatus }>;
