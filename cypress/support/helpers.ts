import { ALL_KEYS } from './keys';
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

export const currentGuess = () => storeValue((s) => s.currentGuess);

// Submits a valid word and waits until the submission is finished:
// keys are disabled while submitting, then re-enabled and the typed word is cleared.
export function submitWord(word: string, via: InputMode = 'click') {
  typeAndEnter(word, via);
  key('Enter').should('be.enabled');
  currentGuess().should('eq', '');
}

export const STORAGE_KEY = 'walka-na-slowa-storage';

type AppState = ReturnType<ReturnType<typeof getStore>['getState']>;

/**
 * Retryable read of a single store value. The store is read again on every retry,
 * so `.should()` waits for async updates (unlike `storeState().its(...)`, which is a snapshot).
 */
export function storeValue<T>(select: (state: AppState) => T) {
  return cy
    .window({ log: false })
    .then((win) => ({ read: () => select(getStore(win).getState()) }))
    .invoke('read');
}

/** Overrides store fields/actions, e.g. to simulate a failing action. */
export function patchStore(patch: Partial<AppState>) {
  cy.window().then((win) => getStore(win).setState(patch));
}

/** The persisted (localStorage) part of the store, parsed. */
export const persistedState = () =>
  cy
    .window()
    .its('localStorage')
    .invoke('getItem', STORAGE_KEY)
    .then((raw) => JSON.parse(raw ?? '{}') as { state?: Partial<AppState> });

export const surrender = () => cy.get(sel.surrenderBtn).click();

/** The page must never scroll sideways: content width <= viewport width. */
export const shouldNotOverflowHorizontally = (viewportWidth: number) =>
  cy.get('html').invoke('prop', 'scrollWidth').should('be.lte', viewportWidth);

type Guess = AppState['guesses'][number];

/** Builds a fully-correct guess for store patching. Override any field you need. */
export const makeGuess = (value: string, overrides: Partial<Guess> = {}): Guess => ({
  id: `guess-${value}`,
  userId: 'user1',
  value,
  evaluatedGuess: {
    letters: [...value].map((letter) => ({ value: letter, exists: true, correctPlace: true })),
  },
  ...overrides,
});

export const guesses = () => storeValue((s) => s.guesses);
export const guessCount = () => storeValue((s) => s.guesses.length);

/** Types through Cypress' real key simulation (keydown/keypress/keyup), e.g. '{enter}', '{backspace}'. */
export const typePhysical = (text: string) => cy.get('body').type(text);

/**
 * Asserts that every key is rendered and in the given state.
 * `.should('be.disabled')` on a multi-element subject passes if ANY element matches,
 * so we assert that no key is in the opposite state instead.
 */
export function allKeysShouldBe(state: 'enabled' | 'disabled') {
  keyboard().find('button').should('have.length', ALL_KEYS.length);
  keyboard()
    .find(state === 'enabled' ? 'button:disabled' : 'button:enabled')
    .should('not.exist');
}
