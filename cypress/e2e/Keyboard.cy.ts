import { WORD_LENGTH } from '../../src/constants';
import {
  allKeysShouldBe,
  currentGuess,
  guessCount,
  key,
  keyboard,
  patchStore,
  pressBackspace,
  pressEnter,
  typePhysical,
  typeWord,
} from '../support/helpers';
import { ALL_KEYS } from '../support/keys';
import { sel } from '../support/selectors';

describe('Keyboard - layout and state', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders a labeled group with every key', () => {
    keyboard().should('have.attr', 'role', 'group').and('have.attr', 'aria-label', 'Klawiatura');
    keyboard().find('button').should('have.length', ALL_KEYS.length);
    ALL_KEYS.forEach((k) => key(k).should('exist'));
  });

  it('has all keys disabled before a game exists, and enabled after', () => {
    allKeysShouldBe('disabled');
    cy.createSoloGame();
    allKeysShouldBe('enabled');
  });

  it('ignores the physical keyboard while there is no game', () => {
    typePhysical('kot');
    currentGuess().should('eq', '');
  });

  it('disables all keys while a guess is being submitted', () => {
    cy.createSoloGame();
    patchStore({ isSubmittingGuess: true });
    allKeysShouldBe('disabled');
  });
});

describe('Keyboard - typing', () => {
  beforeEach(() => {
    cy.createSoloGame();
  });

  it('types letters, including Polish ones, with on-screen keys', () => {
    typeWord('kąt');
    currentGuess().should('eq', 'KĄT');
  });

  it('removes the last letter with Backspace', () => {
    typeWord('kot');
    pressBackspace();
    currentGuess().should('eq', 'KO');
  });

  it('does nothing on Backspace with an empty guess', () => {
    pressBackspace();
    currentGuess().should('eq', '');
  });

  it('does not accept more letters than the word length', () => {
    typeWord('kotekxx');
    currentGuess().should('have.length', WORD_LENGTH);
  });

  it('works with the physical keyboard', () => {
    typePhysical('kotx{backspace}');
    currentGuess().should('eq', 'KOT');
  });

  it('ignores keys that are not on the keyboard', () => {
    typePhysical('12 -{leftarrow}');
    currentGuess().should('eq', '');
  });
});

describe('Keyboard - submitting', () => {
  beforeEach(() => {
    cy.createSoloGame();
  });

  it('does not submit a word that is too short', () => {
    typeWord('kot');
    pressEnter();
    guessCount().should('eq', 0);
    currentGuess().should('eq', 'KOT');
  });

  it('submits a full word and clears the typed letters', () => {
    typeWord('kotek');
    pressEnter();
    guessCount().should('eq', 1);
    currentGuess().should('eq', '');
    key('Enter').should('be.enabled');
  });

  it('submits with the physical Enter key', () => {
    typePhysical('kotek{enter}');
    guessCount().should('eq', 1);
  });

  it('shows a toast when submitting fails', () => {
    patchStore({ submitGuess: () => Promise.reject(new Error('boom')) });
    typeWord('kotek');
    pressEnter();
    cy.get(sel.toaster).should('contain.text', 'Nie udało się zgadnąć');
    key('Enter').should('be.enabled');
  });
});
