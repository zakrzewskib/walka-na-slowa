describe('Accessibility', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('should not have any accessibility violations', () => {
    cy.checkA11y();
  });

  it('has proper semantic HTML structure', () => {
    cy.get('[role="grid"]').should('have.length', 2);
    cy.get('[role="row"]').should('exist');
    cy.get('[role="gridcell"]').should('exist');
  });

  it('has descriptive labels for screen readers', () => {
    cy.get('[aria-label]').should('have.length.greaterThan', 0);
  });
});
