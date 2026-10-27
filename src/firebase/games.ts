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
import { logger } from '../logger/logger';
import type { Game, Guess } from '../types';
import { db } from './firebase';

export const HARDCODED_CORRECT_WORD = 'LALKA'; // todo: Add choosing correct word in the backend

type FirebaseWriteReadTimeStamp = FieldValue | Timestamp;

export interface GameDTO extends Game {
  createdAt: FirebaseWriteReadTimeStamp;
}

const gamesCollection = collection(db, 'games') as CollectionReference<GameDTO>;

export async function firebaseCreateGame(): Promise<string> {
  const userId = 'user1'; // todo: Add auth

  // Omit id to autogenerate it
  const newGame: Omit<GameDTO, 'id'> = {
    userId: userId,
    guesses: [],
    createdAt: serverTimestamp(),
    correctWord: HARDCODED_CORRECT_WORD,
  };

  try {
    const docRef = await addDoc(gamesCollection, newGame);
    const gameId = docRef.id;
    logger.debug('Firebase: Game created', { gameId });
    return gameId;
  } catch (error) {
    logger.error('Firebase: Error creating game', error);
    throw error;
  }
}

export async function firebaseSubmitGuess(gameId: string, guess: Guess): Promise<void> {
  // todo: Offline/flaky network: write may hang (no error/rollback) or be saved twice on retry (new id + createdAt defeat arrayUnion dedupe)

  try {
    const gameRef = doc(gamesCollection, gameId);
    await updateDoc(gameRef, {
      guesses: arrayUnion({ ...guess, createdAt: Timestamp.now() }),
    });
    logger.debug('Firebase: Added new guess', { gameId, guess });
  } catch (error) {
    logger.error('Firebase: Error adding guess', error);
    throw error;
  }
}

export async function firebaseGetGame(gameId: string): Promise<GameDTO> {
  const gameRef = doc(gamesCollection, gameId);

  const snap = await getDoc(gameRef);

  if (!snap.exists()) {
    logger.error('Firebase: gameRef does not exist', { gameRef, snap });
    throw new Error('Firebase: Could not load game.');
  }

  // todo: split guesses: current player and enemy
  // todo: hide correct word
  try {
    const game: GameDTO = { ...snap.data(), id: snap.id };
    logger.debug('Firebase: Game loaded', { gameId, game });
    return game;
  } catch (error) {
    logger.error('Firebase: Error creating game', { gameId, error });
    throw error;
  }
}
