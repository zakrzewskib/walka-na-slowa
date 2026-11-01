/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line
  namespace Cypress {
    interface Chainable {
      injectAxe(): Chainable<void>;
      checkA11y(
        context?: string | Node | null,
        options?: Record<string, unknown> | null,
      ): Chainable<void>;

      /**
       * Clicks "create game" in the dialog and waits until the game is ready,
       * i.e. the word input is enabled.
       */
      createGame(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('createGame', () => {
  cy.get('[data-testid="create-game-dialog-btn"]').click();
});

export {};
