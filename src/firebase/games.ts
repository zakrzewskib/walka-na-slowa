import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  FieldValue,
  getDoc,
  runTransaction,
  serverTimestamp,
  Timestamp,
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
    gameMode: mode,
    status: mode === 'solo' ? 'in_progress' : 'waiting_for_opponent',
    gameResult: null,
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
  try {
    const gameRef = doc(gamesCollection, gameId);

    const { evaluatedGuess, gameResult } = await runTransaction(db, async (tx) => {
      const snapshot = await tx.get(gameRef);

      if (!snapshot.exists()) {
        throw new Error(`Game ${gameId} does not exist`);
      }

      const game = snapshot.data();

      if (game.status === 'finished') {
        throw new Error(`Game ${gameId} is already finished`);
      }

      // todo: Move evaluation to backend
      const evaluatedGuess: Guess = {
        ...guess,
        evaluatedGuess: getWordResult(guess.value, game.correctWord),
      };

      // todo: Move winning logic to backend
      const gameResult = getGameResult(
        guess.value,
        game.guesses.length + 1,
        game.gameMode,
        game.correctWord,
      );

      // One atomic write: the guess and (if the game ended) the result and status
      tx.update(gameRef, {
        guesses: [...game.guesses, { ...evaluatedGuess, createdAt: Timestamp.now() }],
        ...(gameResult && { gameResult: gameResult, status: 'finished' }),
      });

      return { evaluatedGuess, gameResult };
    });

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
