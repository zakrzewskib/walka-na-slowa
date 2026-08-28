describe('Game Boards Display', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays both player boards', () => {
    cy.contains('Gracz 1').should('be.visible');
    cy.contains('Gracz 2').should('be.visible');
  });

  it('shows "(Ty)" only on player 1 board', () => {
    cy.contains('Gracz 1 (Ty)').should('be.visible');
    cy.contains('Gracz 2').should('be.visible');
    cy.contains('Gracz 2 (Ty)').should('not.exist');
  });

  // todo: Add more meaningful tests
  it('displays correct number of rows per board', () => {
    // Each board should have 6 rows (WORDS_LENGTH)
    cy.get('[role="grid"]')
      .first()
      .find('[role="row"]')
      .should('have.length', 6);
    cy.get('[role="grid"]')
      .eq(1) // second element
      .find('[role="row"]')
      .should('have.length', 6);
  });

  it('displays correct number of cells per row', () => {
    // Each row should have 5 cells (WORD_LENGTH)
    cy.get('[role="row"]')
      .first()
      .find('[role="gridcell"]')
      .should('have.length', 5);
  });
});
