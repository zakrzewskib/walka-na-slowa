/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // ← This enables global expect/describe/it
    // When globals: true, Vitest uses chai-style assertions by default
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    // Dummy values so modules that import src/firebase/firebase.ts can load in unit tests.
    // The "demo-" prefix guarantees these never point at a real Firebase project.
    env: {
      VITE_FIREBASE_API_KEY: 'demo-api-key',
      VITE_FIREBASE_AUTH_DOMAIN: 'demo-walka-na-slowa.firebaseapp.com',
      VITE_FIREBASE_PROJECT_ID: 'demo-walka-na-slowa',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      // Only include files with logic, exclude UI components, in the future add more directories if necessary
      include: ['src/utils'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
});
