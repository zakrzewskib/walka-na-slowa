import { currentGuess, key, keyboard, opponentBoard, playerBoard } from '../support/helpers';
import { sel } from '../support/selectors';

describe('Accessibility', () => {
  beforeEach(() => {
    cy.startGame();
    // cy.injectAxe();
  });

  // it('should not have any accessibility violations', () => {
  //   cy.checkA11y(undefined, {
  //     // disable color-contrast rule
  //     rules: { 'color-contrast': { enabled: false } },
  //   });
  // });

  it('has descriptive labels for screen readers', () => {
    cy.get('[role="gridcell"]').each(($cell) => {
      cy.wrap($cell).should('have.attr', 'aria-label').and('not.be.empty');
    });

    playerBoard().should('have.attr', 'aria-label', 'Twoja plansza');
    opponentBoard().should('have.attr', 'aria-label', 'Plansza przeciwnika');
  });

  describe('on-screen keyboard', () => {
    it('renders keys as buttons with accessible names', () => {
      keyboard()
        .find('button')
        .each(($btn) => {
          const name = $btn.attr('aria-label') ?? $btn.text().trim();
          cy.wrap(name, { log: false }).should('not.be.empty');
        });
    });

    it('keys are reachable and focusable', () => {
      key('A').focus().should('have.focus');
    });

    it('does not double-register a letter when a focused key is activated with the keyboard', () => {
      // A focused <button> + a global keydown listener is a classic double-input bug.
      key('A').focus();
      cy.get('body').trigger('keydown', { key: 'a', bubbles: true });
      currentGuess().should('eq', 'A');
    });
  });
});

describe('Accessibility - create game dialog', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('is exposed as a dialog with an accessible name', () => {
    cy.get(sel.createGameDialog)
      .should('have.attr', 'role', 'dialog')
      .and('have.attr', 'aria-labelledby');
  });

  it('has no accessibility violations while open', () => {
    cy.checkA11y(sel.createGameDialog, {
      rules: { 'color-contrast': { enabled: false } },
    });
  });

  it('closes after the game is created', () => {
    cy.createGame();
    cy.get(sel.createGameDialog).should('not.exist');
  });
});
