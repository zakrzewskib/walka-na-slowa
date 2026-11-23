import { patchStore, persistedState, storeValue, submitWord, surrender } from '../support/helpers';
import { sel } from '../support/selectors';

// todo: Add versus mode
describe('Surrender', () => {
  beforeEach(() => {
    cy.createSoloGame();
  });

  it('opens the confirmation dialog without ending the game', () => {
    surrender();

    cy.get(sel.surrenderDialog).should('be.visible');
    cy.get(sel.surrenderDialog).should('contain.text', 'Czy na pewno chcesz się zakończyć grę?');

    storeValue((s) => s.gameStatus).should('not.eq', 'finished');
    storeValue((s) => s.gameResult).should('eq', null);
  });

  it('closes the dialog and keeps the game when the user answers "Nie"', () => {
    surrender();

    cy.get(sel.surrenderDialog).contains('button', 'Nie').click();

    cy.get(sel.surrenderDialog, { timeout: 10000 }).should('not.exist');
    storeValue((s) => s.gameStatus).should('not.eq', 'finished');
    storeValue((s) => s.gameResult).should('eq', null);
    storeValue((s) => s.gameId).should('not.eq', '');
  });

  it('marks the game as lost and finished when the user answers "Tak"', () => {
    submitWord('BRTGW');
    storeValue((s) => s.guesses.length).should('eq', 1);

    surrender();
    cy.get(sel.surrenderDialog).contains('button', 'Tak').click();

    cy.get(sel.surrenderDialog, { timeout: 10000 }).should('not.exist');
    storeValue((s) => s.gameStatus).should('eq', 'finished');
    storeValue((s) => s.gameResult).should('deep.eq', { mode: 'solo', outcome: 'lost' });

    // surrendering no longer clears the game
    storeValue((s) => s.gameId).should('not.eq', '');
    storeValue((s) => s.correctWord).should('not.eq', '');
    storeValue((s) => s.guesses.length).should('eq', 1);
  });

  it('persists the finished state so a reload shows the finished game', () => {
    surrender();
    cy.get(sel.surrenderDialog).contains('button', 'Tak').click();
    cy.get(sel.surrenderDialog, { timeout: 10000 }).should('not.exist');
    persistedState().its('state.gameId').should('not.eq', '');
    persistedState().its('state.gameStatus').should('eq', 'finished');
    persistedState().its('state.gameResult').should('deep.eq', { mode: 'solo', outcome: 'lost' });
  });

  it('shows a loading state and disables both buttons while surrendering', () => {
    patchStore({
      surrenderGame: () => new Promise<void>((resolve) => setTimeout(resolve, 500)),
    });

    surrender();
    cy.get(sel.surrenderDialog).contains('button', 'Tak').click();

    cy.get(sel.surrenderDialog).should('contain.text', 'Kończenie gry...');
    cy.get(sel.surrenderDialog).contains('button', 'Nie').should('be.disabled');

    cy.get(sel.surrenderDialog, { timeout: 10000 }).should('not.exist');
  });

  it('shows an error in the dialog and keeps it open when surrendering fails', () => {
    patchStore({ surrenderGame: () => Promise.reject(new Error('boom')) });

    surrender();
    cy.get(sel.surrenderDialog).contains('button', 'Tak').click();

    cy.get(sel.surrenderDialog)
      .should('be.visible')
      .and('contain.text', 'Nie udało się zakończyć gry');

    // the game is untouched and the user can back out
    storeValue((s) => s.gameStatus).should('not.eq', 'finished');
    storeValue((s) => s.gameResult).should('eq', null);

    cy.get(sel.surrenderDialog).contains('button', 'Nie').should('not.be.disabled').click();
    cy.get(sel.surrenderDialog, { timeout: 10000 }).should('not.exist');
  });

  it('does not show the previous error when the dialog is reopened', () => {
    patchStore({ surrenderGame: () => Promise.reject(new Error('boom')) });

    surrender();
    cy.get(sel.surrenderDialog).contains('button', 'Tak').click();
    cy.get(sel.surrenderDialog).should('contain.text', 'Nie udało się zakończyć gry');

    cy.get(sel.surrenderDialog).contains('button', 'Nie').click();
    cy.get(sel.surrenderDialog, { timeout: 10000 }).should('not.exist');
    surrender();

    cy.get(sel.surrenderDialog).should('be.visible');
    cy.get(sel.surrenderDialog).should('not.contain.text', 'Nie udało się zakończyć gry');
  });
});
