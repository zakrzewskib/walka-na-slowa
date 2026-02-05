describe('App component', () => {
  it('renders Hello World', () => {
    cy.visit('/');
    cy.get('[data-testid="cypress-title"]')
      .should('exist')
      .should('have.text', 'Hello World!');
  });
});
