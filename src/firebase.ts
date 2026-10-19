import { initializeApp } from 'firebase/app';
import {
  addDoc,
  arrayUnion,
  collection,
  CollectionReference,
  connectFirestoreEmulator,
  doc,
  FieldValue,
  getDoc,
  getFirestore,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import type { Game, Guess } from './types';

type FirebaseWriteReadTimeStamp = FieldValue | Timestamp;

export interface GameDTO extends Game {
  createdAt: FirebaseWriteReadTimeStamp;
}

export const HARDCODED_CORRECT_WORD = 'LALKA'; // todo: Add choosing correct word in the backend

// Module state is reset on every Vite HMR re-evaluation, so the "already connected"
// flag has to live on globalThis to survive it.
declare global {
  var __firestoreEmulatorConnected: boolean | undefined;
}

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env and fill it in.`,
    );
  }
  return value;
}

const firebaseConfig = {
  apiKey: requireEnv('VITE_FIREBASE_API_KEY', import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: requireEnv('VITE_FIREBASE_AUTH_DOMAIN', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: requireEnv('VITE_FIREBASE_PROJECT_ID', import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Emulators for testing, VITE_USE_FIREBASE_EMULATOR is set to true in CI pipeline.
// Must run right after getFirestore() and before anything uses `db`.
if (
  import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true' &&
  !globalThis.__firestoreEmulatorConnected
) {
  const host = import.meta.env.VITE_FIREBASE_EMULATOR_HOST ?? '127.0.0.1';
  const port = Number(import.meta.env.VITE_FIREBASE_EMULATOR_PORT ?? 8080);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(
      `Invalid VITE_FIREBASE_EMULATOR_PORT: ${import.meta.env.VITE_FIREBASE_EMULATOR_PORT}`,
    );
  }

  connectFirestoreEmulator(db, host, port);
  globalThis.__firestoreEmulatorConnected = true;
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
