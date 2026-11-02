import { key, observeDisabled, patchStore } from '../support/helpers';
import { sel } from '../support/selectors';

describe('Create Game Dialog', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows an error and re-enables the button when creating fails', () => {
    patchStore({ createGame: () => Promise.reject(new Error('boom')) });

    cy.get(sel.createGameBtn).click();

    cy.get(sel.errorAlert)
      .should('have.attr', 'role', 'alert')
      .and('contain.text', 'Nie udało się stworzyć gry');
    cy.get(sel.createGameBtn).should('be.enabled');
  });

  it('closes the dialog and enables the keyboard after creating a game', () => {
    cy.get(sel.createGameDialog).should('be.visible');
    key('A').should('be.disabled');

    cy.createGame(); // clicks, waits for the dialog to be gone and the keys to be enabled

    cy.get(sel.createGameDialog).should('not.exist');
    key('A').should('be.enabled');
  });

  // Regression test: the button must not flash back to enabled while the dialog animates out.
  it('keeps the button disabled until the dialog is gone', () => {
    observeDisabled(sel.createGameBtn).then(({ record, stop }) => {
      cy.get(sel.createGameBtn).click();
      cy.get(sel.createGameDialog).should('not.exist');

      cy.wrap(record).its('sawDisabled').should('eq', true); // it was disabled while creating
      cy.wrap(record).its('flashedBackToEnabled').should('eq', false); // and never flashed back
      cy.then(stop);
    });
  });
});
