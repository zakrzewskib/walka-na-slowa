import {
  getStore,
  key,
  keyboard,
  pressBackspace,
  pressEnter,
  storeState,
  typeWord,
} from '../support/helpers';

const createButton = '[data-testid="create-game-dialog-btn"]';
const dialog = '[data-testid="create-game-dialog"]';
const WORD_LENGTH = 5;

const ALL_KEYS = [
  ...'QWERTYUIOP',
  ...'ASDFGHJKL',
  ...'ZXCVBNM',
  ...'ĄĆĘŁŃÓŚŹŻ',
  'Backspace',
  'Enter',
];

function startGame() {
  cy.get(createButton).click();
  cy.get(dialog).should('not.exist');
  key('A').should('be.enabled');
}

describe('Keyboard - layout and state', () => {
  beforeEach(() => cy.visit('/'));

  it('renders a labeled group with every key', () => {
    keyboard().should('have.attr', 'role', 'group').and('have.attr', 'aria-label', 'Klawiatura');
    keyboard().find('button').should('have.length', ALL_KEYS.length);
    ALL_KEYS.forEach((k) => key(k).should('exist'));
  });

  it('has all keys disabled before a game exists, and enabled after', () => {
    keyboard()
      .find('button')
      .each(($k) => cy.wrap($k).should('be.disabled'));
    startGame();
    keyboard()
      .find('button')
      .each(($k) => cy.wrap($k).should('be.enabled'));
  });

  it('ignores the physical keyboard while there is no game', () => {
    cy.get('body').type('kot');
    storeState().its('currentGuess').should('eq', '');
  });

  it('disables all keys while a guess is being submitted', () => {
    startGame();
    cy.window().then((win) => getStore(win).setState({ isSubmittingGuess: true }));
    keyboard()
      .find('button')
      .each(($k) => cy.wrap($k).should('be.disabled'));
  });
});

describe('Keyboard - typing', () => {
  beforeEach(() => {
    cy.visit('/');
    startGame();
  });

  it('types letters, including Polish ones, with on-screen keys', () => {
    typeWord('kąt');
    storeState().its('currentGuess').should('eq', 'KĄT');
  });

  it('removes the last letter with Backspace', () => {
    typeWord('kot');
    pressBackspace();
    storeState().its('currentGuess').should('eq', 'KO');
  });

  it('does nothing on Backspace with an empty guess', () => {
    pressBackspace();
    storeState().its('currentGuess').should('eq', '');
  });

  it('does not accept more letters than the word length', () => {
    typeWord('kotekxx');
    storeState().its('currentGuess').should('have.length', WORD_LENGTH);
  });

  it('works with the physical keyboard', () => {
    cy.get('body').type('kotx{backspace}');
    storeState().its('currentGuess').should('eq', 'KOT');
  });

  it('ignores keys that are not on the keyboard', () => {
    cy.get('body').type('12 -{leftarrow}');
    storeState().its('currentGuess').should('eq', '');
  });
});

describe('Keyboard - submitting', () => {
  beforeEach(() => {
    cy.visit('/');
    startGame();
  });

  it('does not submit a word that is too short', () => {
    typeWord('kot');
    pressEnter();
    storeState().then((s) => {
      expect(s.guesses).to.have.length(0);
      expect(s.currentGuess).to.eq('KOT');
    });
  });

  it('submits a full word and clears the typed letters', () => {
    typeWord('kotek');
    pressEnter();
    storeState().its('guesses').should('have.length', 1);
    storeState().its('currentGuess').should('eq', '');
    key('Enter').should('be.enabled');
  });

  it('submits with the physical Enter key', () => {
    cy.get('body').type('kotek{enter}');
    storeState().its('guesses').should('have.length', 1);
  });

  it('shows a toast when submitting fails', () => {
    cy.window().then((win) => {
      getStore(win).setState({ submitGuess: () => Promise.reject(new Error('boom')) });
    });
    typeWord('kotek');
    pressEnter();
    cy.contains('Nie udało się zgadnąć').should('be.visible');
    key('Enter').should('be.enabled');
  });
});
