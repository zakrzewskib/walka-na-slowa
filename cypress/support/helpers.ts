// cypress/support/helpers.ts

export const wordInput = () => cy.get('[data-testid="word-input"]');

export function typeAndEnter(word: string) {
  wordInput().type(word);
  wordInput().type('{enter}');
}

// Submits a valid word and waits until the submission is finished:
// the input is disabled while submitting, then re-enabled and cleared.
export function submitWord(word: string) {
  typeAndEnter(word);
  wordInput().should('be.enabled').and('have.value', '');
}

// Returns the store exposed in src/store/store.ts.
// Fails with a clear message instead of a vague "undefined" error when it is not exposed.
export function getStore(win: Window) {
  if (!win.useAppStore) {
    throw new Error(
      'window.useAppStore is not exposed. It is set only in dev mode when window.Cypress exists (see store.ts).',
    );
  }
  return win.useAppStore;
}
