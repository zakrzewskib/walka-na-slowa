// Color constants for Chakra UI palette
const COLORS = {
  GREEN: 'rgb(34, 197, 94)', // green.500 - correct position
  YELLOW: 'rgb(234, 179, 8)', // yellow.500 - wrong position
  GRAY: 'rgb(161, 161, 170)', // gray.400 - not in word
  UNUSED: 'rgb(228, 228, 231)', // gray.200 - key not yet guessed
} as const;

describe('Word Input - Color Results', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid="create-game-dialog-btn"]').click();
    cy.get('[role="dialog"]').should('not.exist'); // wait for Chakra dialog to fully close
    cy.get('[data-testid="word-input"]', { timeout: 10000 }).should('not.be.disabled');
  });

  function submitWord(word: string) {
    cy.get('[data-testid="word-input"]').type(word);
    cy.get('[data-testid="word-input"]').type('{enter}');
  }

  // LALKA is the correct word
  // Colors: green = correct position, yellow = wrong position, gray = not in word

  it('shows all green for correct word LALKA', () => {
    submitWord('LALKA');

    cy.get('[role="grid"]')
      .first()
      .find('[role="row"]')
      .first()
      .find('[role="gridcell"]')
      .each((cell) => {
        cy.wrap(cell).should('have.css', 'background-color', COLORS.GREEN);
      });
  });

  it('shows all gray for word with no matching letters (BRTGW)', () => {
    submitWord('BRTGW');

    cy.get('[role="grid"]')
      .first()
      .find('[role="row"]')
      .first()
      .find('[role="gridcell"]')
      .each((cell) => {
        cy.wrap(cell).should('have.css', 'background-color', COLORS.GRAY);
      });
  });

  it('shows correct mixed colors for KALLA', () => {
    submitWord('KALLA');

    cy.get('[role="grid"]')
      .first()
      .find('[role="row"]')
      .first()
      .find('[role="gridcell"]')
      .then((cells) => {
        cy.wrap(cells[0]).should('have.css', 'background-color', COLORS.YELLOW); // K → yellow
        cy.wrap(cells[1]).should('have.css', 'background-color', COLORS.GREEN); // A → green
        cy.wrap(cells[2]).should('have.css', 'background-color', COLORS.GREEN); // L → green
        cy.wrap(cells[3]).should('have.css', 'background-color', COLORS.YELLOW); // L → yellow
        cy.wrap(cells[4]).should('have.css', 'background-color', COLORS.GREEN); // A → green
      });
  });

  it('shows correct colors for LLLLZ - tests duplicate letter logic', () => {
    submitWord('LLLLZ');

    cy.get('[role="grid"]')
      .first()
      .find('[role="row"]')
      .first()
      .find('[role="gridcell"]')
      .then((cells) => {
        cy.wrap(cells[0]).should('have.css', 'background-color', COLORS.GREEN); // L → green
        cy.wrap(cells[1]).should('have.css', 'background-color', COLORS.GRAY); // L → gray
        cy.wrap(cells[2]).should('have.css', 'background-color', COLORS.GREEN); // L → green
        cy.wrap(cells[3]).should('have.css', 'background-color', COLORS.GRAY); // L → gray
        cy.wrap(cells[4]).should('have.css', 'background-color', COLORS.GRAY); // Z → gray
      });
  });

  it('input clears after submission', () => {
    submitWord('LALKA');
    cy.get('[data-testid="word-input"]').should('have.value', '');
  });

  it('does not submit words shorter than 5 letters', () => {
    submitWord('LA');

    // Board should still show no guesses (all empty rows)
    cy.get('[role="grid"]')
      .first()
      .find('[role="row"]')
      .first()
      .find('[role="gridcell"]')
      .each((cell) => {
        cy.wrap(cell).should('not.have.css', 'background-color', COLORS.GREEN);
        cy.wrap(cell).should('not.have.css', 'background-color', COLORS.YELLOW);
        cy.wrap(cell).should('not.have.css', 'background-color', COLORS.GRAY);
      });
  });

  it('appends new guess rows on each submission', () => {
    submitWord('BRTGW');
    submitWord('LALKA');

    cy.get('[role="grid"]')
      .first()
      .find('[role="row"]')
      .eq(0)
      .find('[role="gridcell"]')
      .each((cell) => {
        cy.wrap(cell).should('have.css', 'background-color', COLORS.GRAY);
      });

    cy.get('[role="grid"]')
      .first()
      .find('[role="row"]')
      .eq(1)
      .find('[role="gridcell"]')
      .each((cell) => {
        cy.wrap(cell).should('have.css', 'background-color', COLORS.GREEN);
      });
  });
});

describe('Word Input - Keyboard Colors', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid="create-game-dialog-btn"]').click();
    cy.get('[role="dialog"]').should('not.exist'); // wait for Chakra dialog to fully close
    cy.get('[data-testid="word-input"]', { timeout: 10000 }).should('not.be.disabled');
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
    submitWord('LALKA'); // L is green (correct has L at positions 0 and 2)
    keyColor('L').should('have.css', 'background-color', COLORS.GREEN);

    // XLXXX: L is at index 1, which is not a correct position for L,
    // so this guess resolves L to 'present' (yellow) — a real conflicting
    // status the merge logic must not let win against the earlier 'correct'
    submitWord('XLXXX');
    keyColor('L').should('have.css', 'background-color', COLORS.GREEN);
  });
});
