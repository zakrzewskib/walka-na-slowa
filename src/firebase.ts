// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import type { GameDTO } from './types';

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

export async function firebaseCreateGame() {
  console.log('Creating game...');
  const userId = 'user1'; // todo: Add auth

  const newGame: GameDTO = {
    id: '', // empty id to auto create it by firebase
    userId: userId,
    guesses: [],
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'games'), newGame);
  console.log('Game created');
  console.log(docRef);
}
