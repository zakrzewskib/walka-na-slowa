describe('Accessibility', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('should not have any accessibility violations', () => {
    cy.checkA11y();
  });

  // todo: Fix counts of rows and grids for both game board and keyboard
  it('has proper semantic HTML structure', () => {
    cy.get('[role="grid"]').should('exist');
    cy.get('[role="row"]').should('exist');
    cy.get('[role="gridcell"]').should('exist');
  });

  // todo: Add more tests
  it('has descriptive labels for screen readers', () => {
    cy.get('[aria-label]').should('have.length.greaterThan', 0);
  });
});
