/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { setGlobalOptions } from 'firebase-functions';
import { HttpsError, onCall } from 'firebase-functions/https';
import { readFileSync } from 'node:fs';

// import {onRequest} from "firebase-functions/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

if (!getApps().length) initializeApp();

export const getRandomWord = onCall(async () => {
  const snap = await getFirestore().doc('config/words').get();

  if (!snap.exists) {
    throw new HttpsError('not-found', 'Could not get words list');
  }

  // collection: config, doc: words, field: list
  const list = snap.data()?.list as string[] | undefined;

  if (!list?.length) {
    throw new HttpsError('failed-precondition', 'Word list is empty');
  }

  const correctWord = list[Math.floor(Math.random() * list.length)];

  return { correctWord };
});

// Create possible answers and seed config/words

const ref = getFirestore().doc('config/words');

async function seed() {
  const snap = await ref.get();
  if (snap.exists) {
    console.log('config/words already exists, skipping');
    return;
  }

  // set it locally
  const useWordsFile = false;

  const list = useWordsFile
    ? readFileSync('words.txt', 'utf8')
        .split(/\r?\n/)
        .map((w) => w.trim().toUpperCase())
        .filter(Boolean)
    : ['LALKA', 'HOTEL', 'FLESZ'];

  await ref.set({ list });
  console.log(`Uploaded ${list.length} words`);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
