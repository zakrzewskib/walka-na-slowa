import { currentGuess, key, makeGuess, patchStore } from '../support/helpers';

describe('KeyboardKey', () => {
  beforeEach(() => {
    cy.startGame();
  });

  it('is a real button that does not submit forms', () => {
    key('A').should('match', 'button').and('have.attr', 'type', 'button');
  });

  it('has a descriptive aria-label', () => {
    key('A').should('have.attr', 'aria-label').and('not.be.empty');
  });

  it('shows its letter, and symbols for special keys', () => {
    key('A').should('contain.text', 'A');
    key('Ą').should('contain.text', 'Ą');
    key('Backspace').invoke('text').should('not.be.empty');
    key('Enter').invoke('text').should('not.be.empty');
  });

  it('does not keep focus after being clicked', () => {
    key('A').click();
    cy.focused().should('not.exist');
  });

  it('is not selectable and has tap-friendly touch behavior', () => {
    key('A')
      .should('have.css', 'user-select', 'none')
      .and('have.css', 'touch-action', 'manipulation');
  });

  it('cannot be clicked while disabled', () => {
    patchStore({ isSubmittingGuess: true });

    key('A').should('be.disabled').and('have.css', 'cursor', 'not-allowed');
    key('A').click({ force: true }); // force bypasses Cypress' own disabled check
    currentGuess().should('eq', '');
  });

  it('updates its aria-label after the letter was used in a guess', () => {
    key('K')
      .invoke('attr', 'aria-label')
      .then((before) => {
        patchStore({ guesses: [makeGuess('KOTEK')] });

        key('K').invoke('attr', 'aria-label').should('not.eq', before);
      });
  });
});
