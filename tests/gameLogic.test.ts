import { MOCK_CORRECT_WORD } from '../src/App';
import { getGuessResult } from '../src/utils/gameLogic';

describe('getGuessResult', () => {
  const green = { exists: true, correctPlace: true };
  const yellow = { exists: true, correctPlace: false };
  const gray = { exists: false, correctPlace: false };
  const correctWord = MOCK_CORRECT_WORD;

  // * INFO *
  // To compare arrays I used to.deep.equal

  describe('LALKA as correct word', () => {
    it('ZAMEK', () => {
      expect(getGuessResult('ZAMEK', correctWord)).to.deep.equal([
        gray,
        green,
        gray,
        gray,
        yellow,
      ]);
    });

    it('LAMPA', () => {
      expect(getGuessResult('LAMPA', correctWord)).to.deep.equal([
        green,
        green,
        gray,
        gray,
        green,
      ]);
    });

    it('LAMAA', () => {
      expect(getGuessResult('LAMPA', correctWord)).to.deep.equal([
        green,
        green,
        gray,
        gray,
        green,
      ]);
    });

    it("LLLLL — duplicate letters, only 2 L's should be highlighted", () => {
      expect(getGuessResult('LLLLL', correctWord)).to.deep.equal([
        green,
        gray,
        green,
        gray,
        gray,
      ]);
    });

    describe('edge cases', () => {
      it('correct guess — all greens', () => {
        expect(getGuessResult('LALKA', correctWord)).to.deep.equal([
          green,
          green,
          green,
          green,
          green,
        ]);
      });

      it('no letters match — all grays', () => {
        expect(getGuessResult('ZEROS', correctWord)).to.deep.equal([
          gray,
          gray,
          gray,
          gray,
          gray,
        ]);
      });

      it('duplicate letter in guess, only one in correct word — only one yellow', () => {
        // LALKA has one K, so only the first K should be yellow
        expect(getGuessResult('KKNNN', correctWord)).to.deep.equal([
          yellow,
          gray,
          gray,
          gray,
          gray,
        ]);
      });

      it('green takes priority over yellow for duplicate letters', () => {
        // LALKA has one A at pos 1 and one at pos 5
        // AAXXX — first A is yellow (exists but wrong place), second A is green
        expect(getGuessResult('AAXXX', correctWord)).to.deep.equal([
          yellow,
          green,
          gray,
          gray,
          gray,
        ]);
      });
    });
  });
});
