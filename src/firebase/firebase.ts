import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

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

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

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
