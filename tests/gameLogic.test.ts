import { CURRENT_USER_ID, ENEMY_USER_ID, WORDS_LENGTH } from '../src/constants';
import { HARDCODED_CORRECT_WORD } from '../src/firebase/games';
import { getGameResult, getWordResult } from '../src/utils/gameLogic';

describe('getWordResult', () => {
  const green = { exists: true, correctPlace: true };
  const yellow = { exists: true, correctPlace: false };
  const gray = { exists: false, correctPlace: false };
  const correctWord = 'LALKA';

  // Reduces the result to just the flags we care about
  const evaluate = (guess: string, correct: string = correctWord) =>
    getWordResult(guess, correct).letters.map((letter) => ({
      exists: letter.exists,
      correctPlace: letter.correctPlace,
    }));

  // * INFO *
  // To compare arrays to.deep.equal is used

  describe(`${correctWord} as correct word`, () => {
    it('ZAMEK', () => {
      expect(evaluate('ZAMEK')).to.deep.equal([gray, green, gray, gray, yellow]);
    });

    it('LAMPA', () => {
      expect(evaluate('LAMPA')).to.deep.equal([green, green, gray, gray, green]);
    });

    it('LAMAA', () => {
      expect(evaluate('LAMAA')).to.deep.equal([green, green, gray, gray, green]);
    });

    it("LLLLL — duplicate letters, only 2 L's should be highlighted", () => {
      expect(evaluate('LLLLL')).to.deep.equal([green, gray, green, gray, gray]);
    });

    describe('edge cases', () => {
      it('correct guess — all greens', () => {
        expect(evaluate('LALKA')).to.deep.equal([green, green, green, green, green]);
      });

      it('no letters match — all grays', () => {
        expect(evaluate('ZEROS')).to.deep.equal([gray, gray, gray, gray, gray]);
      });

      it('duplicate letter in guess, only one in correct word — only one yellow', () => {
        // LALKA has one K, so only the first K should be yellow
        expect(evaluate('KKNNN')).to.deep.equal([yellow, gray, gray, gray, gray]);
      });

      it('green takes priority over yellow for duplicate letters', () => {
        // LALKA has one A at pos 1 and one at pos 5
        // AAXXX — first A is yellow (exists but wrong place), second A is green
        expect(evaluate('AAXXX')).to.deep.equal([yellow, green, gray, gray, gray]);
      });
    });

    describe('more duplicate letter scenarios', () => {
      it('AAAAA — only the two real A positions are green, the rest gray', () => {
        // Both A's in LALKA are matched as green, so nothing is left for yellows
        expect(evaluate('AAAAA')).to.deep.equal([gray, green, gray, gray, green]);
      });

      it('XAXAX — one A green, the other A yellow (uses up the second A)', () => {
        expect(evaluate('XAXAX')).to.deep.equal([gray, green, gray, yellow, gray]);
      });

      it('ALAAX — three A guesses, only two A in the word, no greens', () => {
        // Leftmost letters consume the yellows first: A yellow, L yellow, A yellow, A gray
        expect(evaluate('ALAAX')).to.deep.equal([yellow, yellow, yellow, gray, gray]);
      });

      it('KLXXX — K and L both exist elsewhere, all yellow', () => {
        expect(evaluate('KLXXX')).to.deep.equal([yellow, yellow, gray, gray, gray]);
      });

      it('LXLXX — both L present, one green and one green', () => {
        expect(evaluate('LXLXX')).to.deep.equal([green, gray, green, gray, gray]);
      });

      it('XLXLX — L at wrong places, both yellow since LALKA has two Ls', () => {
        // idx1 is A in LALKA (not L) and idx3 is K, so neither L is green
        expect(evaluate('XLXLX')).to.deep.equal([gray, yellow, gray, yellow, gray]);
      });
    });
  });

  describe('input normalization', () => {
    it('is case-insensitive for the guess', () => {
      expect(evaluate('lalka')).to.deep.equal([green, green, green, green, green]);
    });

    it('is case-insensitive for the correct word', () => {
      expect(evaluate('LALKA', 'lalka')).to.deep.equal([green, green, green, green, green]);
    });

    it('handles mixed case', () => {
      expect(evaluate('LaLkA')).to.deep.equal([green, green, green, green, green]);
    });

    it('handles Polish diacritics', () => {
      expect(evaluate('łódka', 'ŁÓDKA')).to.deep.equal([green, green, green, green, green]);
    });

    it('treats a diacritic letter as different from its base letter', () => {
      // Ł is not L
      expect(evaluate('ŁALKA')).to.deep.equal([gray, green, green, green, green]);
    });

    it('returns letter values in uppercase', () => {
      const values = getWordResult('lamAa', correctWord).letters.map((l) => l.value);

      expect(values).to.deep.equal(['L', 'A', 'M', 'A', 'A']);
    });
  });

  describe('output shape', () => {
    it('returns one letter result per guess letter', () => {
      expect(getWordResult('ZAMEK', correctWord).letters).to.have.lengthOf(5);
    });

    it('works for words of other lengths', () => {
      // DCBA vs ABCD — every letter exists but none is in place
      expect(evaluate('ABCD', 'DCBA')).to.deep.equal([yellow, yellow, yellow, yellow]);
    });

    it('is pure — same input gives the same output', () => {
      expect(getWordResult('ZAMEK', correctWord)).to.deep.equal(
        getWordResult('ZAMEK', correctWord),
      );
    });
  });

  describe('input validation', () => {
    it('throws error for empty string', () => {
      expect(() => getWordResult('', correctWord)).throw('Guess cannot be empty');
    });

    it('throws error for mismatched length', () => {
      expect(() => getWordResult('ABC', correctWord)).throw(
        'Guess length (3) must match correct word length (5)',
      );
    });

    it('throws error for too long guess', () => {
      expect(() => getWordResult('ABCDEFG', correctWord)).throw(
        'Guess length (7) must match correct word length (5)',
      );
    });

    it('throws error for one letter too short', () => {
      expect(() => getWordResult('LALK', correctWord)).throw(
        'Guess length (4) must match correct word length (5)',
      );
    });

    it('throws error for one letter too long', () => {
      expect(() => getWordResult('LALKAS', correctWord)).throw(
        'Guess length (6) must match correct word length (5)',
      );
    });
  });
});

describe('getGameResult', () => {
  const wrongWord = `${HARDCODED_CORRECT_WORD}_WRONG`;
  const stillPlaying = WORDS_LENGTH - 1;

  describe('solo mode', () => {
    it('wins when the correct word is guessed', () => {
      expect(getGameResult(HARDCODED_CORRECT_WORD, 1, 'solo')).to.deep.equal({
        outcome: 'wonAlone',
      });
    });

    it('wins on the very last allowed guess (win takes priority over loss)', () => {
      expect(getGameResult(HARDCODED_CORRECT_WORD, WORDS_LENGTH, 'solo')).to.deep.equal({
        outcome: 'wonAlone',
      });
    });

    it('loses when the guess limit is reached with a wrong word', () => {
      expect(getGameResult(wrongWord, WORDS_LENGTH, 'solo')).to.deep.equal({
        outcome: 'lostAlone',
      });
    });

    it('returns null while the game is still going', () => {
      expect(getGameResult(wrongWord, stillPlaying, 'solo')).to.equal(null);
    });

    it('returns null for a wrong first guess', () => {
      expect(getGameResult(wrongWord, 1, 'solo')).to.equal(null);
    });
  });

  describe('versus mode', () => {
    it('current user wins when the correct word is guessed', () => {
      expect(getGameResult(HARDCODED_CORRECT_WORD, 1, 'versus')).to.deep.equal({
        outcome: 'finished',
        winnerId: CURRENT_USER_ID,
      });
    });

    it('current user wins on the very last allowed guess', () => {
      expect(getGameResult(HARDCODED_CORRECT_WORD, WORDS_LENGTH, 'versus')).to.deep.equal({
        outcome: 'finished',
        winnerId: CURRENT_USER_ID,
      });
    });

    it('enemy wins when the guess limit is reached with a wrong word', () => {
      expect(getGameResult(wrongWord, WORDS_LENGTH, 'versus')).to.deep.equal({
        outcome: 'finished',
        winnerId: ENEMY_USER_ID,
      });
    });

    it('returns null while the game is still going', () => {
      expect(getGameResult(wrongWord, stillPlaying, 'versus')).to.equal(null);
    });

    it('returns null for a wrong first guess', () => {
      expect(getGameResult(wrongWord, 1, 'versus')).to.equal(null);
    });
  });
});
