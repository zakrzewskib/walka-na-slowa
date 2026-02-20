// Color constants for Chakra UI palette
const COLORS = {
  GREEN: 'rgb(34, 197, 94)', // green.500 - correct position
  YELLOW: 'rgb(234, 179, 8)', // yellow.500 - wrong position
  GRAY: 'rgb(161, 161, 170)', // gray.400 - not in word
} as const;

describe('Word Input - Color Results', () => {
  beforeEach(() => {
    cy.visit('/');
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
