describe('App component', () => {
  it('renders Hello World', () => {
    cy.visit('http://localhost:5173'); // Vite dev server
    cy.get('[data-testid="cypress-title"]')
      .should('exist')
      .should('have.text', 'Hello World!');
  });
});
