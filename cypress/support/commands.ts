/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line
  namespace Cypress {
    interface Chainable {
      injectAxe(): Chainable<void>;
      checkA11y(): Chainable<void>;
    }
  }
}

// Add custom commands if needed
export {};
