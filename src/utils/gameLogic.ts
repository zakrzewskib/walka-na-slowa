import type { IGuessResult } from '../types';

export function getGuessResult(
  guess: string,
  correctWord: string,
): IGuessResult {
  const result: IGuessResult = new Array(guess.length).fill(null);
  const correctLetterCounts: Record<string, number> = {};

  // First pass — mark greens and count remaining letters in correct word
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === correctWord[i]) {
      result[i] = { exists: true, correctPlace: true };
    } else {
      // Only count letters that weren't matched
      correctLetterCounts[correctWord[i]] =
        (correctLetterCounts[correctWord[i]] || 0) + 1;
    }
  }

  // Second pass — mark yellows and grays
  for (let i = 0; i < guess.length; i++) {
    if (result[i] !== null) continue; // already marked green, skip

    if (correctLetterCounts[guess[i]] > 0) {
      result[i] = { exists: true, correctPlace: false };
      correctLetterCounts[guess[i]]--;
    } else {
      result[i] = { exists: false, correctPlace: false };
    }
  }

  return result;
}
