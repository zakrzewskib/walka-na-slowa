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
  | 'Q' | 'W' | 'E' | 'R' | 'T' | 'Y' | 'U' | 'I' | 'O' | 'P'
  | 'A' | 'S' | 'D' | 'F' | 'G' | 'H' | 'J' | 'K' | 'L'
  | 'Z' | 'X' | 'C' | 'V' | 'B' | 'N' | 'M'
  | 'Ą' | 'Ć' | 'Ę' | 'Ł' | 'Ń' | 'Ó' | 'Ś' | 'Ź' | 'Ż';

export type KeyboardKey = PolishLetter | 'Backspace' | 'Enter';

export type LetterStatus = 'unused' | 'correct' | 'present' | 'absent';

export type LetterStatusMap = Record<PolishLetter, { status: LetterStatus }>;
