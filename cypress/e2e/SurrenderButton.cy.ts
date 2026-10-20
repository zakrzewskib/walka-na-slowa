describe('Surrender Button', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.createGame();
  });

  it('shows new dialog', () => {
    cy.get('[data-testid="surrender-button"]').click();

    cy.get('[data-testid="create-game-dialog"]').should('be.visible');
  });

  it('shows toast error when finishing game fails', () => {
    cy.window().then((win) => {
      win.useAppStore!.setState({
        finishGame: () => Promise.reject(new Error('boom')),
      });
    });

    cy.get('[data-testid="surrender-button"]').click();

    cy.get('[data-testid="create-game-dialog"]').should('not.exist');
    cy.get('[data-testid="toaster"]').should('contain.text', 'Nie udało się zakończyć gry');
  });
});
