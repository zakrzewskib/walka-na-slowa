/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Required (checked at startup in firebase.ts)
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;

  // Optional
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;

  // Emulator
  readonly VITE_USE_FIREBASE_EMULATOR?: 'true' | 'false';
  readonly VITE_FIREBASE_EMULATOR_HOST?: string;
  readonly VITE_FIREBASE_EMULATOR_PORT?: string;
}
