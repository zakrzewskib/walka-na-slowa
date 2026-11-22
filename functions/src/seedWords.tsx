import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'node:fs';

// copy this to index.ts and run emulators:start once (after build)
const list = readFileSync('words.txt', 'utf8')
  .split(/\r?\n/)
  .map((w) => w.trim().toUpperCase())
  .filter(Boolean);

getFirestore()
  .doc('config/words')
  .set({ list }, { merge: true })
  .then(() => console.log(`Uploaded ${list.length} words`));
