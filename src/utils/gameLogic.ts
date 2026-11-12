import { CURRENT_USER_ID, ENEMY_USER_ID, WORDS_LENGTH } from '../constants';
import type { EvaluatedGuess, GameMode, GameResult, LetterResult } from '../types';

export function getWordResult(rawGuess: string, rawCorrectWord: string): EvaluatedGuess {
  const correctWord = rawCorrectWord.toUpperCase();
  const guess = rawGuess.toUpperCase();

  if (!guess || guess.length === 0) {
    throw new Error('Guess cannot be empty');
  }

  if (guess.length !== correctWord.length) {
    throw new Error(
      `Guess length (${guess.length}) must match correct word length (${correctWord.length})`,
    );
  }

  const result: LetterResult[] = new Array(guess.length).fill(null);
  const correctLetterCounts: Record<string, number> = {};

  // First pass — mark greens and count remaining letters in correct word
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === correctWord[i]) {
      result[i] = { value: guess[i], exists: true, correctPlace: true };
    } else {
      // Only count letters that weren't matched
      correctLetterCounts[correctWord[i]] = (correctLetterCounts[correctWord[i]] || 0) + 1;
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
    letters: result,
  };
}

// todo: Move to backend
// todo: guessesLength must be of users guesses not all guesses
export function getGameResult(
  value: string,
  guessesLength: number,
  mode: GameMode,
  rawCorrectWord: string,
): GameResult {
  const correctWord = rawCorrectWord.toUpperCase();
  const guess = value.toUpperCase();

  if (mode === 'solo') {
    if (guess === correctWord) {
      return {
        outcome: 'wonAlone',
      };
    } else if (guessesLength === WORDS_LENGTH) {
      return {
        outcome: 'lostAlone',
      };
    }
  }

  if (mode === 'versus') {
    if (guess === correctWord) {
      return {
        outcome: 'finished',
        winnerId: CURRENT_USER_ID,
      };
    } else if (guessesLength === WORDS_LENGTH) {
      // todo: Add tie
      return {
        outcome: 'finished',
        winnerId: ENEMY_USER_ID,
      };
    }
  }

  return null;
}
