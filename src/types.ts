export interface ILetter {
  value: string;
  exists: boolean;
  correctPlace: boolean;
}

export interface IWord {
  id: string;
  letters: ILetter[];
}

// prettier-ignore
export type PolishLetter =
  | 'q' | 'w' | 'e' | 'r' | 't' | 'y' | 'u' | 'i' | 'o' | 'p'
  | 'a' | 's' | 'd' | 'f' | 'g' | 'h' | 'j' | 'k' | 'l'
  | 'z' | 'x' | 'c' | 'v' | 'b' | 'n' | 'm'
  | 'ą' | 'ć' | 'ę' | 'ł' | 'ń' | 'ó' | 'ś' | 'ź' | 'ż';

export type LetterStatus = 'unused' | 'correct' | 'present' | 'absent';

export type LettersUsed = {
  [K in PolishLetter]: { status: LetterStatus };
};
