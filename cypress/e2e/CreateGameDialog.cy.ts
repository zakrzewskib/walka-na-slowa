describe('Create Game Dialog - errors', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows an error and re-enables the button when creating fails', () => {
    // simulate error
    cy.window().then((win) => {
      win.useAppStore!.setState({
        createGame: () => Promise.reject(new Error('boom')),
      });
    });

    // action
    cy.get('[data-testid="create-game-dialog-btn"]').click();

    // show alert and reenable button
    cy.get('[role="alert"]').should('contain.text', 'Nie udało się stworzyć gry');
    cy.get('[data-testid="create-game-dialog-btn"]').should('be.enabled');
  });

  it('closes the dialog and enables the word input after creating a game', () => {
    // before
    cy.get('[data-testid="create-game-dialog"]').should('be.visible');
    cy.get('[data-testid="word-input"]').should('be.disabled');

    // action
    cy.get('[data-testid="create-game-dialog-btn"]').click();

    // after
    cy.get('[data-testid="create-game-dialog"]').should('not.exist');
    cy.get('[data-testid="word-input"]').should('be.enabled');
  });
});
