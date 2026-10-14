import type { FieldValue, Timestamp } from 'firebase/firestore';

type FirebaseWriteReadTimeStamp = FieldValue | Timestamp;

export interface LetterResult {
  value: string;
  exists: boolean;
  correctPlace: boolean;
}

export interface EvaluatedGuess {
  letters: LetterResult[];
}

export interface Guess {
  id: string;
  userId: string;
  value: string;
  evaluatedGuess: EvaluatedGuess;
  // createdAt: Date; // todo: delete/add created at mapping
}

export type GuessSubmit = Omit<Guess, 'evaluatedGuess' | 'createdAt'>;

export interface GuessDTO extends Guess {
  createdAt: FirebaseWriteReadTimeStamp;
}

export interface Game {
  id: string;
  userId: string;
  guesses: Guess[];
  correctWord: string;
  // todo: Hide correct word: either a Cloud Function that validates guesses server-side and never sends the word to the client, or Firestore security rules that hide the field until the game is over.
}

export interface GameDTO extends Game {
  createdAt: FirebaseWriteReadTimeStamp;
}

// prettier-ignore
export type PolishLetter =
  | 'Q' | 'W' | 'E' | 'R' | 'T' | 'Y' | 'U' | 'I' | 'O' | 'P'
  | 'A' | 'S' | 'D' | 'F' | 'G' | 'H' | 'J' | 'K' | 'L'
  | 'Z' | 'X' | 'C' | 'V' | 'B' | 'N' | 'M'
  | 'Ą' | 'Ć' | 'Ę' | 'Ł' | 'Ń' | 'Ó' | 'Ś' | 'Ź' | 'Ż';

export type KeyboardKey = PolishLetter | 'Backspace' | 'Enter';

export type KeyboardLetterStatus = 'unused' | 'correct' | 'present' | 'absent';

export type KeyboardLetterStatusMap = Record<PolishLetter, { status: KeyboardLetterStatus }>;
