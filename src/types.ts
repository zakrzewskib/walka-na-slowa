export interface Letter {
  value: string;
  exists: boolean;
  correctPlace: boolean;
}

export interface Word {
  id?: string; // to be deleted
  letters: Letter[];
}

export interface Guess {
  id: string;
  word: Word;
  userId: string;
  createdAt: Date;
}

export interface GuessDTO {
  id: string;
  word: Word;
  userId: string;
  //  createdAt: Timestamp | FieldValue; // FieldValue when writing (serverTimestamp()), Timestamp when  - for the Firebase in the future <- todo
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
