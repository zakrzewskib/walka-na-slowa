import { getFunctions, httpsCallable } from 'firebase/functions';

export async function getCorrectWord(): Promise<string> {
  const fn = httpsCallable<void, { correctWord: string }>(getFunctions(), 'getRandomWord');
  const { data } = await fn();
  return data.correctWord;
}
