// Color constants for Chakra UI palette
const COLORS = {
  GREEN: 'rgb(34, 197, 94)', // green.500 - correct position
  YELLOW: 'rgb(234, 179, 8)', // yellow.500 - wrong position
  GRAY: 'rgb(161, 161, 170)', // gray.400 - not in word
  UNUSED: 'rgb(228, 228, 231)', // gray.200 - key not yet guessed
} as const;

describe('Word Input - Keyboard Colors', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  function submitWord(word: string) {
    cy.get('[data-testid="word-input"]').type(word);
    cy.get('[data-testid="word-input"]').type('{enter}');
  }

  function keyColor(letter: string) {
    return cy.get(`[data-testid="key-${letter}"]`);
  }

  it('colors keyboard keys after a single guess matching the board', () => {
    submitWord('KALLA');
    // K → yellow, A → green, L → green, L → yellow, A → green
    // merged per-key: K=yellow(present), A=green(correct), L=green(correct)

    keyColor('K').should('have.css', 'background-color', COLORS.YELLOW);
    keyColor('A').should('have.css', 'background-color', COLORS.GREEN);
    keyColor('L').should('have.css', 'background-color', COLORS.GREEN);

    // untouched letters stay unused
    keyColor('B').should('have.css', 'background-color', COLORS.UNUSED);
  });

  it('resolves a letter with mixed statuses within one guess to its best status', () => {
    // LLLLZ against LALKA: L is green, gray, green, gray, then Z gray
    // regression test for the duplicate-letter merge bug: the keyboard
    // key must show green (best status), not gray (last-seen status)
    submitWord('LLLLZ');

    keyColor('L').should('have.css', 'background-color', COLORS.GREEN);
    keyColor('Z').should('have.css', 'background-color', COLORS.GRAY);
  });

  it('shows correct board and keyboard colors across two guesses in a row', () => {
    submitWord('BRTGW'); // all gray
    submitWord('LALKA'); // all green

    // board: row 1 all gray, row 2 all green
    cy.get('[data-testid="player-board"]')
      .find('[role="row"]')
      .eq(0)
      .find('[role="gridcell"]')
      .each((cell) => {
        cy.wrap(cell).should('have.css', 'background-color', COLORS.GRAY);
      });

    cy.get('[data-testid="player-board"]')
      .find('[role="row"]')
      .eq(1)
      .find('[role="gridcell"]')
      .each((cell) => {
        cy.wrap(cell).should('have.css', 'background-color', COLORS.GREEN);
      });

    // keyboard: letters from guess 1 are gray, letters from guess 2 are green
    keyColor('B').should('have.css', 'background-color', COLORS.GRAY);
    keyColor('R').should('have.css', 'background-color', COLORS.GRAY);
    keyColor('T').should('have.css', 'background-color', COLORS.GRAY);
    keyColor('G').should('have.css', 'background-color', COLORS.GRAY);
    keyColor('W').should('have.css', 'background-color', COLORS.GRAY);

    keyColor('L').should('have.css', 'background-color', COLORS.GREEN);
    keyColor('A').should('have.css', 'background-color', COLORS.GREEN);
    keyColor('K').should('have.css', 'background-color', COLORS.GREEN);
  });

  it('upgrades a keyboard key from yellow to green across two guesses', () => {
    submitWord('AXXXX'); // A exists but wrong position → yellow
    keyColor('A').should('have.css', 'background-color', COLORS.YELLOW);

    submitWord('LALKA'); // A now correct position → green
    keyColor('A').should('have.css', 'background-color', COLORS.GREEN);
  });

  it('does not downgrade a keyboard key that was already green', () => {
    submitWord('LALKA'); // L is green
    keyColor('L').should('have.css', 'background-color', COLORS.GREEN);

    // guess a word with L in a wrong-for-this-word spot; L stays green regardless
    submitWord('BRTGW');
    keyColor('L').should('have.css', 'background-color', COLORS.GREEN);
  });
});
