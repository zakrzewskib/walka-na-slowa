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
  createdAt: Date;
}

export interface Game {
  id: string;
  userId: string;
  guesses: Guess[];
}

export interface GuessDTO {
  id: string;
  userId: string;
  value: string;
  evaluatedGuess: EvaluatedGuess;
  createdAt: FirebaseWriteReadTimeStamp;
}

export interface GameDTO {
  id: string;
  userId: string;
  guesses: GuessDTO[];
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
