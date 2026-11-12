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
import { CURRENT_USER_ID } from '../constants';
import { logger } from '../logger/logger';
import type { Game, GameMode, GameResult, Guess, GuessSubmit } from '../types';
import { getGameResult, getWordResult } from '../utils/gameLogic';
import { db } from './firebase';

export const HARDCODED_CORRECT_WORD = 'LALKA'; // todo: Add choosing correct word in the backend

type FirebaseWriteReadTimeStamp = FieldValue | Timestamp;

export interface GameDTO extends Game {
  createdAt: FirebaseWriteReadTimeStamp;
}

const gamesCollection = collection(db, 'games') as CollectionReference<GameDTO>;

export async function firebaseCreateGame(mode: GameMode): Promise<string> {
  // Omit id to autogenerate it
  const newGame: Omit<GameDTO, 'id'> = {
    playerIds: [CURRENT_USER_ID],
    mode: mode,
    status: mode === 'solo' ? 'in_progress' : 'waiting_for_opponent',
    result: null,
    correctWord: HARDCODED_CORRECT_WORD,
    guesses: [],
    createdAt: serverTimestamp(),
  };

  try {
    const docRef = await addDoc(gamesCollection, newGame);
    const gameId = docRef.id;
    logger.debug('Game created', { gameId });
    return gameId;
  } catch (error) {
    logger.error('Error creating game', error);
    throw error;
  }
}

export async function firebaseSubmitGuess(
  gameId: string,
  guess: GuessSubmit,
): Promise<{ guess: Guess; gameResult: GameResult }> {
  // todo: Offline/flaky network: write may hang (no error/rollback) or be saved twice on retry (new id + createdAt defeat arrayUnion dedupe)

  try {
    const gameRef = doc(gamesCollection, gameId);

    // todo: Move evaluation to backend
    const evaluatedGuess: Guess = {
      ...guess,
      evaluatedGuess: getWordResult(guess.value, HARDCODED_CORRECT_WORD),
    };

    await updateDoc(gameRef, {
      guesses: arrayUnion({ ...evaluatedGuess, createdAt: Timestamp.now() }),
    });

    const game = await firebaseGetGame(gameId);

    // todo: Move winning logic to backend
    const gameResult = getGameResult(guess.value, game.guesses.length, game.mode);

    if (gameResult) {
      await updateDoc(gameRef, {
        gameResult: gameResult,
        status: 'finished',
      });
    }

    logger.debug('Added new guess', { gameId, guess });
    return { guess: evaluatedGuess, gameResult };
  } catch (error) {
    logger.error('Error adding guess', error);
    throw error;
  }
}

export async function firebaseGetGame(gameId: string): Promise<GameDTO> {
  const gameRef = doc(gamesCollection, gameId);

  // todo: split guesses: current player and enemy
  // todo: hide correct word
  try {
    const snap = await getDoc(gameRef);

    if (!snap.exists()) {
      logger.warn('gameRef does not exist', { gameId });
      throw new Error('Could not load game.');
    }

    const game: GameDTO = { ...snap.data(), id: snap.id };
    logger.debug('Game loaded', { gameId, game });
    return game;
  } catch (error) {
    logger.error('Error creating game', { gameId, error });
    throw error;
  }
}
