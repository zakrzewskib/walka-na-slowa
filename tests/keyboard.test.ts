import { calculateKeyboardState } from '../src/components/Keyboard/Keyboard.utils';
import { POLISH_ALPHABET } from '../src/constants';
import type { Guess, LetterResult } from '../src/types';

describe('calculateKeyboardState', () => {
  const green = (value: string): LetterResult => ({ value, exists: true, correctPlace: true });
  const yellow = (value: string): LetterResult => ({ value, exists: true, correctPlace: false });
  const gray = (value: string): LetterResult => ({ value, exists: false, correctPlace: false });

  let guessCounter = 0;

  function makeGuess(value: string, letters: LetterResult[]): Guess {
    guessCounter++;
    return {
      id: `guess-${guessCounter}`,
      userId: 'test-user',
      createdAt: new Date(),
      value: value,
      evaluatedGuess: { letters },
    };
  }

  describe('empty input', () => {
    it('returns every letter as unused when there are no guesses', () => {
      const result = calculateKeyboardState([]);

      for (const letter of POLISH_ALPHABET) {
        expect(result[letter]).to.deep.equal({ status: 'unused' });
      }
    });
  });

  describe('single guess', () => {
    it('marks statuses correctly for a mix of green/yellow/gray', () => {
      const guess = makeGuess('LAXYK', [green('L'), yellow('A'), gray('X'), gray('Y'), green('K')]);

      const result = calculateKeyboardState([guess]);

      expect(result['L'].status).to.equal('correct');
      expect(result['A'].status).to.equal('present');
      expect(result['X'].status).to.equal('absent');
      expect(result['Y'].status).to.equal('absent');
      expect(result['K'].status).to.equal('correct');
    });

    it('leaves untouched letters as unused', () => {
      const guess = makeGuess('L', [green('L')]);

      const result = calculateKeyboardState([guess]);

      expect(result['Z'].status).to.equal('unused');
    });
  });

  describe('priority merging within a single guess', () => {
    it('duplicate letter: correct wins over absent (e.g. "EEEEE" vs "LEVEL")', () => {
      // mirrors the LEVEL/EEEEE case: same letter is green at two spots,
      // gray at the other three, all within one guess
      const guess = makeGuess('EEEEE', [gray('E'), green('E'), gray('E'), green('E'), gray('E')]);

      const result = calculateKeyboardState([guess]);

      expect(result['E'].status).to.equal('correct');
    });

    it('duplicate letter: correct wins over present', () => {
      const guess = makeGuess('AAX', [yellow('A'), green('A'), gray('X')]);

      const result = calculateKeyboardState([guess]);

      expect(result['A'].status).to.equal('correct');
    });

    it('duplicate letter: present wins over absent', () => {
      const guess = makeGuess('AA', [gray('A'), yellow('A')]);

      const result = calculateKeyboardState([guess]);

      expect(result['A'].status).to.equal('present');
    });
  });

  describe('priority merging across multiple guesses', () => {
    it('upgrades present to correct on a later guess', () => {
      const guess1 = makeGuess('A', [yellow('A')]);
      const guess2 = makeGuess('A', [green('A')]);

      const result = calculateKeyboardState([guess1, guess2]);

      expect(result['A'].status).to.equal('correct');
    });

    it('does not downgrade correct when a later guess shows the letter as absent', () => {
      const guess1 = makeGuess('A', [green('A')]);
      const guess2 = makeGuess('A', [gray('A')]);

      const result = calculateKeyboardState([guess1, guess2]);

      expect(result['A'].status).to.equal('correct');
    });

    it('does not downgrade present when a later guess shows the letter as absent', () => {
      const guess1 = makeGuess('A', [yellow('A')]);
      const guess2 = makeGuess('A', [gray('A')]);

      const result = calculateKeyboardState([guess1, guess2]);

      expect(result['A'].status).to.equal('present');
    });

    it('does not downgrade correct when the same letter is absent elsewhere in a later guess', () => {
      // e.g. turn 1 nails the "L", turn 2 guesses "L" in the wrong word entirely (still gray)
      const guess1 = makeGuess('L', [green('L')]);
      const guess2 = makeGuess('LX', [gray('L'), gray('X')]);

      const result = calculateKeyboardState([guess1, guess2]);

      expect(result['L'].status).to.equal('correct');
    });

    it('aggregates independently across many different letters', () => {
      const guess1 = makeGuess('LX', [green('L'), gray('X')]);
      const guess2 = makeGuess('KY', [yellow('K'), gray('Y')]);

      const result = calculateKeyboardState([guess1, guess2]);

      expect(result['L'].status).to.equal('correct');
      expect(result['X'].status).to.equal('absent');
      expect(result['K'].status).to.equal('present');
      expect(result['Y'].status).to.equal('absent');
      expect(result['Z'].status).to.equal('unused');
    });
  });

  describe('edge cases', () => {
    it('handles lowercase input by normalizing to uppercase', () => {
      const guess = makeGuess('la', [green('l'), yellow('a')]);

      const result = calculateKeyboardState([guess]);

      expect(result['L'].status).to.equal('correct');
      expect(result['A'].status).to.equal('present');
    });

    it('ignores letters that are not part of the Polish alphabet without throwing', () => {
      const guess = makeGuess('1#', [green('1'), green('#')]);

      expect(() => calculateKeyboardState([guess])).not.to.throw();

      const result = calculateKeyboardState([guess]);
      for (const letter of POLISH_ALPHABET) {
        expect(result[letter].status).to.equal('unused');
      }
    });

    it('handles Polish diacritic letters', () => {
      const guess = makeGuess('ążł', [green('ą'), yellow('ż'), gray('ł')]);

      const result = calculateKeyboardState([guess]);

      expect(result['Ą'].status).to.equal('correct');
      expect(result['Ż'].status).to.equal('present');
      expect(result['Ł'].status).to.equal('absent');
    });

    it('returns a map containing exactly the full Polish alphabet as keys', () => {
      const result = calculateKeyboardState([]);

      expect(Object.keys(result).sort()).to.deep.equal([...POLISH_ALPHABET].sort());
    });
  });
});
