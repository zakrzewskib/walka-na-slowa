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
  cy.get(sel.createGameBtn).click();
  cy.get(sel.createGameDialog).should('not.be.visible');
  key('A').should('be.enabled');
});

Cypress.Commands.add('startGame', () => {
  cy.visit('/');
  cy.createGame();
});

export {};
