import { getGuessResult } from '../src/utils/gameLogic';

describe('getGuessResult', () => {
  const green = { exists: true, correctPlace: true };
  const yellow = { exists: true, correctPlace: false };
  const gray = { exists: false, correctPlace: false };
  const correctWord = 'LALKA';

  // * INFO *
  // To compare arrays to.deep.equal is used

  describe(`${correctWord} as correct word`, () => {
    it('ZAMEK', () => {
      const result = getGuessResult('ZAMEK', correctWord).letters.map(
        (letter) => ({
          exists: letter.exists,
          correctPlace: letter.correctPlace,
        }),
      );

      expect(result).to.deep.equal([gray, green, gray, gray, yellow]);
    });

    it('LAMPA', () => {
      const result = getGuessResult('LAMPA', correctWord).letters.map(
        (letter) => ({
          exists: letter.exists,
          correctPlace: letter.correctPlace,
        }),
      );

      expect(result).to.deep.equal([green, green, gray, gray, green]);
    });

    it('LAMAA', () => {
      const result = getGuessResult('LAMAA', correctWord).letters.map(
        (letter) => ({
          exists: letter.exists,
          correctPlace: letter.correctPlace,
        }),
      );

      expect(result).to.deep.equal([green, green, gray, gray, green]);
    });

    it("LLLLL — duplicate letters, only 2 L's should be highlighted", () => {
      const result = getGuessResult('LLLLL', correctWord).letters.map(
        (letter) => ({
          exists: letter.exists,
          correctPlace: letter.correctPlace,
        }),
      );

      expect(result).to.deep.equal([green, gray, green, gray, gray]);
    });

    describe('edge cases', () => {
      it('correct guess — all greens', () => {
        const result = getGuessResult('LALKA', correctWord).letters.map(
          (letter) => ({
            exists: letter.exists,
            correctPlace: letter.correctPlace,
          }),
        );

        expect(result).to.deep.equal([green, green, green, green, green]);
      });

      it('no letters match — all grays', () => {
        const result = getGuessResult('ZEROS', correctWord).letters.map(
          (letter) => ({
            exists: letter.exists,
            correctPlace: letter.correctPlace,
          }),
        );

        expect(result).to.deep.equal([gray, gray, gray, gray, gray]);
      });

      it('duplicate letter in guess, only one in correct word — only one yellow', () => {
        // LALKA has one K, so only the first K should be yellow
        const result = getGuessResult('KKNNN', correctWord).letters.map(
          (letter) => ({
            exists: letter.exists,
            correctPlace: letter.correctPlace,
          }),
        );

        expect(result).to.deep.equal([yellow, gray, gray, gray, gray]);
      });

      it('green takes priority over yellow for duplicate letters', () => {
        // LALKA has one A at pos 1 and one at pos 5
        // AAXXX — first A is yellow (exists but wrong place), second A is green

        const result = getGuessResult('AAXXX', correctWord).letters.map(
          (letter) => ({
            exists: letter.exists,
            correctPlace: letter.correctPlace,
          }),
        );
        expect(result).to.deep.equal([yellow, green, gray, gray, gray]);
      });
    });
  });

  describe('input validation', () => {
    it('throws error for empty string', () => {
      expect(() => getGuessResult('', correctWord)).throw(
        'Guess cannot be empty',
      );
    });

    it('throws error for mismatched length', () => {
      expect(() => getGuessResult('ABC', correctWord)).throw(
        'Guess length (3) must match correct word length (5)',
      );
    });

    it('throws error for too long guess', () => {
      expect(() => getGuessResult('ABCDEFG', correctWord)).throw(
        'Guess length (7) must match correct word length (5)',
      );
    });
  });
});
