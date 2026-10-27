import {
  addDoc,
  arrayUnion,
  collection,
  CollectionReference,
  doc,
  FieldValue,
  getDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import type { Game, Guess } from '../types';
import { db } from './firebase';

export const HARDCODED_CORRECT_WORD = 'LALKA'; // todo: Add choosing correct word in the backend

type FirebaseWriteReadTimeStamp = FieldValue | Timestamp;

export interface GameDTO extends Game {
  createdAt: FirebaseWriteReadTimeStamp;
}

const gamesCollection = collection(db, 'games') as CollectionReference<GameDTO>;

export async function firebaseCreateGame(): Promise<string> {
  console.log('Creating game...');
  const userId = 'user1'; // todo: Add auth

  // Omit id to autogenerate it
  const newGame: Omit<GameDTO, 'id'> = {
    userId: userId,
    guesses: [],
    createdAt: serverTimestamp(),
    correctWord: HARDCODED_CORRECT_WORD,
  };

  const docRef = await addDoc(gamesCollection, newGame);
  const gameId = docRef.id;
  console.log('Game created', gameId);
  return gameId;
}

export async function firebaseSubmitGuess(gameId: string, guess: Guess): Promise<void> {
  // todo: Offline/flaky network: write may hang (no error/rollback) or be saved twice on retry (new id + createdAt defeat arrayUnion dedupe)

  const gameRef = doc(gamesCollection, gameId);
  await updateDoc(gameRef, {
    guesses: arrayUnion({ ...guess, createdAt: Timestamp.now() }),
  });

  console.log('Added new guess', guess);
}

export async function firebaseGetGame(gameId: string): Promise<GameDTO> {
  const gameRef = doc(gamesCollection, gameId);

  const snap = await getDoc(gameRef);
  if (!snap.exists()) {
    throw new Error('Could not load game.');
  }

  // todo: split guesses: current player and enemy
  const game: GameDTO = { ...snap.data(), id: snap.id };
  console.log('Game loaded', game); // todo: hide correct word
  return game;
}
