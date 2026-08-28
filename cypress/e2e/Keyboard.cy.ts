describe('Keyboard Display', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  const keyboard = () => cy.get('[data-testid="keyboard"]');

  it('renders the keyboard grid', () => {
    keyboard().should('exist');
  });

  it('renders 4 rows', () => {
    keyboard().find('[role="row"]').should('have.length', 4);
  });

  it('renders the correct number of keys per row', () => {
    keyboard()
      .find('[role="row"]')
      .eq(0)
      .find('[role="gridcell"]')
      .should('have.length', 10);
    keyboard()
      .find('[role="row"]')
      .eq(1)
      .find('[role="gridcell"]')
      .should('have.length', 9);
    keyboard()
      .find('[role="row"]')
      .eq(2)
      .find('[role="gridcell"]')
      .should('have.length', 9);
    keyboard()
      .find('[role="row"]')
      .eq(3)
      .find('[role="gridcell"]')
      .should('have.length', 9);
  });

  it('renders the first row letters in uppercase', () => {
    const letters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
    keyboard()
      .find('[role="row"]')
      .eq(0)
      .find('[role="gridcell"]')
      .each(($cell, i) => {
        cy.wrap($cell).should('have.text', letters[i]);
      });
  });

  it('renders the second row letters in uppercase', () => {
    const letters = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
    keyboard()
      .find('[role="row"]')
      .eq(1)
      .find('[role="gridcell"]')
      .each(($cell, i) => {
        cy.wrap($cell).should('have.text', letters[i]);
      });
  });

  it('renders Backspace and Enter keys with correct labels in the third row', () => {
    keyboard()
      .find('[role="row"]')
      .eq(2)
      .find('[role="gridcell"]')
      .first()
      .should('have.text', '⌫');
    keyboard()
      .find('[role="row"]')
      .eq(2)
      .find('[role="gridcell"]')
      .last()
      .should('have.text', 'Enter');
  });

  it('renders the fourth row with Polish special letters', () => {
    const letters = ['Ą', 'Ć', 'Ę', 'Ł', 'Ń', 'Ó', 'Ś', 'Ź', 'Ż'];
    keyboard()
      .find('[role="row"]')
      .eq(3)
      .find('[role="gridcell"]')
      .each(($cell, i) => {
        cy.wrap($cell).should('have.text', letters[i]);
      });
  });

  it('gives every key an accessible aria-label', () => {
    keyboard()
      .find('[role="gridcell"]')
      .each(($cell) => {
        cy.wrap($cell).should('have.attr', 'aria-label').and('not.be.empty');
      });
  });

  it('does not have duplicate keys within a row', () => {
    keyboard()
      .find('[role="row"]')
      .each(($row) => {
        const texts: string[] = [];
        cy.wrap($row)
          .find('[role="gridcell"]')
          .each(($cell) => {
            texts.push($cell.text());
          })
          .then(() => {
            const unique = new Set(texts);
            expect(unique.size).to.eq(texts.length);
          });
      });
  });
});
