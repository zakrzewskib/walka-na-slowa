/// <reference types="cypress" />
import { key } from './helpers';
import { sel } from './selectors';

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
       * i.e. the dialog is gone and the keyboard is enabled.
       */
      createGame(): Chainable<void>;

      /** Visits the app and creates a game. */
      startGame(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('createGame', () => {
  // Adjust the URL pattern/method to your create-game endpoint
  cy.intercept('POST', '**/games*').as('createGame');

  cy.get(sel.createGameBtn).click();

  // 1. the request itself (slow on cold CI backends)
  cy.wait('@createGame', { timeout: 15_000 });

  // 2. the dialog's exit animation + the state update
  cy.get(sel.createGameDialog, { timeout: 10_000 }).should('not.exist');
  key('A').should('be.enabled');
});

Cypress.Commands.add('startGame', () => {
  cy.visit('/');
  cy.createGame();
});

export {};
