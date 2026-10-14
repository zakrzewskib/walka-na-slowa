import { initializeApp } from 'firebase/app';
import {
  addDoc,
  arrayUnion,
  collection,
  CollectionReference,
  connectFirestoreEmulator,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import type { GameDTO, GuessDTO } from './types';

export const HARDCODED_CORRECT_WORD = 'LALKA'; // todo: Add choosing correct word in the backend

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const gamesCollection = collection(db, 'games') as CollectionReference<GameDTO>;

export async function firebaseCreateGame(): Promise<string> {
  console.log('Creating game...');
  const userId = 'user1'; // todo: Add auth

  const newGame: GameDTO = {
    id: '', // empty id to auto create it by firebase
    userId: userId,
    guesses: [],
    createdAt: serverTimestamp(),
    correctWord: HARDCODED_CORRECT_WORD,
  };

  let gameId = '';
  try {
    const docRef = await addDoc(collection(db, 'games'), newGame);
    gameId = docRef.id;
    console.log('Game created', gameId);
  } catch (error) {
    console.log('Could not create game', error);
  }

  return gameId;
}

export async function firebaseSubmitGuess(gameId: string, guess: GuessDTO): Promise<void> {
  const gameRef = doc(gamesCollection, gameId);

  // https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array
  try {
    await updateDoc(gameRef, {
      guesses: arrayUnion({ ...guess, createdAt: Timestamp.now() }),
    });

    console.log('Added new guess', guess);
  } catch (error) {
    console.log('Could not add guess', error);
  }
}

export async function firebaseGetGame(gameId: string): Promise<GameDTO | null> {
  const gameRef = doc(gamesCollection, gameId);

  try {
    const snap = await getDoc(gameRef);
    if (!snap.exists()) {
      console.log('Could not load game', snap);
      return null;
    }

    const game: GameDTO = { ...snap.data(), id: snap.id };
    console.log('Game loaded', game);
    return game;
  } catch (error) {
    console.log('Could not load game', error);
    return null;
  }
}

// Emulators for testing, VITE_USE_FIREBASE_EMULATOR is set to true in CI pipeline
if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}
