import { sel } from './selectors';

export type InputMode = 'click' | 'keyboard';

// Maps our key names to the KeyboardEvent.key value the app listens to
const toEventKey = (value: string) =>
  value.length === 1 ? value.toLocaleLowerCase('pl-PL') : value; // 'Enter', 'Backspace'

export const key = (value: string) => cy.get(sel.key(value));
export const keyboard = () => cy.get(sel.keyboard);
export const playerBoard = () => cy.get(sel.playerBoard);
export const opponentBoard = () => cy.get(sel.opponentBoard);

/**
 * Presses a single key either by clicking the on-screen button
 * or by dispatching a real keydown event (what the physical keyboard does).
 */
export function pressKey(value: string, via: InputMode = 'click') {
  if (via === 'click') {
    key(value.length === 1 ? value.toLocaleUpperCase('pl-PL') : value).click();
  } else {
    // Listener is on document/window, the event bubbles up from body.
    cy.get('body').trigger('keydown', {
      key: toEventKey(value),
      bubbles: true,
    });
  }
}

export function typeWord(word: string, via: InputMode = 'click') {
  for (const letter of word) {
    pressKey(letter, via);
  }
}

export const pressEnter = (via: InputMode = 'click') => pressKey('Enter', via);
export const pressBackspace = (via: InputMode = 'click') => pressKey('Backspace', via);

export function typeAndEnter(word: string, via: InputMode = 'click') {
  typeWord(word, via);
  pressEnter(via);
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

export const currentGuess = () => storeState().its('currentGuess');

// Submits a valid word and waits until the submission is finished:
// keys are disabled while submitting, then re-enabled and the typed word is cleared.
export function submitWord(word: string, via: InputMode = 'click') {
  typeAndEnter(word, via);
  key('Enter').should('be.enabled');
  currentGuess().should('eq', '');
}
