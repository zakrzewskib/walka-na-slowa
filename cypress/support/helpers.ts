const keyTestId = (key: string) => `[data-testid="key-${key}"]`;

export const key = (value: string) => cy.get(keyTestId(value));
export const keyboard = () => cy.get('[data-testid="keyboard"]');

// Clicks the on-screen keys, one per letter
export function typeWord(word: string) {
  for (const letter of word.toLocaleUpperCase('pl-PL')) {
    key(letter).click();
  }
}

export const pressEnter = () => key('Enter').click();
export const pressBackspace = () => key('Backspace').click();

export function typeAndEnter(word: string) {
  typeWord(word);
  pressEnter();
}

// Submits a valid word and waits until the submission is finished:
// the keys are disabled while submitting, then re-enabled and the typed word is cleared.
export function submitWord(word: string) {
  typeAndEnter(word);
  key('Enter').should('be.enabled');
  cy.window().its('useAppStore').invoke('getState').its('currentGuess').should('eq', '');
}

export function getStore(win: Window) {
  if (!win.useAppStore) {
    throw new Error(
      'window.useAppStore is not exposed. It is set only in dev mode when window.Cypress exists (see store.ts).',
    );
  }
  return win.useAppStore;
}

export const storeState = () => cy.window().then((win) => getStore(win).getState());
