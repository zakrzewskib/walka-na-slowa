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

  // 1. game is ready: keys get enabled once the game exists (no animation involved)
  key('A', { timeout: 15_000 }).should('be.enabled');

  // 2. dialog is gone (exit animation + unmount)
  cy.get(sel.createGameDialog, { timeout: 10_000 }).should('not.exist');
});

Cypress.Commands.add('startGame', () => {
  cy.visit('/');
  cy.createGame();
});

export {};
