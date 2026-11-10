import { patchStore, persistedState, storeValue, submitWord, surrender } from '../support/helpers';
import { sel } from '../support/selectors';

describe('Surrender Button', () => {
  beforeEach(() => {
    cy.createSoloGame();
  });

  it('shows new dialog', () => {
    surrender();

    cy.get(sel.createGameDialog).should('be.visible');
  });

  it('clears the game state and the persisted gameId', () => {
    submitWord('BRTGW');

    // there is an active game before surrendering
    storeValue((s) => s.gameId).should('not.eq', '');
    storeValue((s) => s.guesses.length).should('eq', 1);

    surrender();
    cy.get(sel.createGameDialog).should('be.visible');

    storeValue((s) => s.gameId).should('eq', '');
    storeValue((s) => s.correctWord).should('eq', '');
    storeValue((s) => s.guesses.length).should('eq', 0);

    // a reload must not restore the finished game
    persistedState().its('state.gameId').should('eq', '');
  });

  it('shows toast error when finishing game fails', () => {
    patchStore({ finishGame: () => Promise.reject(new Error('boom')) });

    surrender();

    cy.get(sel.createGameDialog).should('not.exist');
    cy.get(sel.toaster).should('contain.text', 'Nie udało się zakończyć gry');
  });
});
