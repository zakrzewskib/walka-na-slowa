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

  it('displays grid structure with proper roles', () => {
    cy.get('[role="grid"]').should('have.length', 2);
    cy.get('[role="row"]').should('exist');
    cy.get('[role="gridcell"]').should('exist');
  });

  it('displays correct number of rows per board', () => {
    // Each board should have 6 rows (WORDS_LENGTH)
    cy.get('[role="grid"]')
      .first()
      .find('[role="row"]')
      .should('have.length', 6);
    cy.get('[role="grid"]')
      .last()
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
