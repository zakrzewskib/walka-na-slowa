// vitest provides chai-compatible assertions
import { v4 as uuidv4 } from 'uuid';
import type { ILetter, IWord } from '../types';

export function getGuessResult(guess: string, correctWord: string): IWord {
  if (!guess || guess.length === 0) {
    throw new Error('Guess cannot be empty');
  }

  if (guess.length !== correctWord.length) {
    throw new Error(
      `Guess length (${guess.length}) must match correct word length (${correctWord.length})`,
    );
  }

  const result: ILetter[] = new Array(guess.length).fill(null);
  const correctLetterCounts: Record<string, number> = {};

  // First pass — mark greens and count remaining letters in correct word
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === correctWord[i]) {
      result[i] = { value: guess[i], exists: true, correctPlace: true };
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
      result[i] = { value: guess[i], exists: true, correctPlace: false };
      correctLetterCounts[guess[i]]--;
    } else {
      result[i] = { value: guess[i], exists: false, correctPlace: false };
    }
  }

  return {
    id: uuidv4(),
    letters: result,
  };
}
