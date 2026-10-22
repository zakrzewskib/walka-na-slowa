import { getStore } from '../support/helpers';

const dialog = '[data-testid="create-game-dialog"]';
const createButton = '[data-testid="create-game-dialog-btn"]';

describe('Create Game Dialog - errors', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows an error and re-enables the button when creating fails', () => {
    // simulate error
    cy.window().then((win) => {
      getStore(win).setState({
        createGame: () => Promise.reject(new Error('boom')),
      });
    });

    // action
    cy.get(createButton).click();

    // show alert and re-enable button
    cy.get('[data-testid="error-alert"]')
      .should('have.attr', 'role', 'alert')
      .and('contain.text', 'Nie udało się stworzyć gry');
    cy.get(createButton).should('be.enabled');
  });

  it('closes the dialog and enables the word input after creating a game', () => {
    // before
    cy.get(dialog).should('be.visible');
    cy.get('[data-testid="word-input"]').should('be.disabled');

    // action
    cy.get(createButton).click();

    // after
    cy.get(dialog).should('not.exist');
    cy.get('[data-testid="word-input"]').should('be.enabled');
  });

  // Regression test: the button must not flash back to enabled while the dialog animates out.
  // Cypress retries assertions until they pass, so "stays disabled" cannot be asserted directly.
  // Instead, a MutationObserver records the button state during the whole closing sequence.
  it('keeps the button disabled until the dialog is gone', () => {
    cy.get(createButton).then(($btn) => {
      const button = $btn[0] as HTMLButtonElement;
      let sawDisabled = false;
      let flashedBackToEnabled = false;

      const observer = new MutationObserver(() => {
        if (button.disabled) {
          sawDisabled = true;
        } else if (sawDisabled) {
          flashedBackToEnabled = true;
        }
      });
      observer.observe(button, { attributes: true });

      cy.wrap($btn).click();
      cy.get(dialog).should('not.exist');

      cy.then(() => {
        observer.disconnect();
        expect(sawDisabled, 'button was disabled while creating').to.equal(true);
        expect(flashedBackToEnabled, 'button flashed back to enabled').to.equal(false);
      });
    });
  });
});
