describe('Accessibility', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.createGame();
    cy.injectAxe();
  });

  const playerBoard = () => cy.get('[data-testid="player-board"]');
  const opponentBoard = () => cy.get('[data-testid="opponent-board"]');

  it('should not have any accessibility violations', () => {
    cy.checkA11y(undefined, {
      // disable color-contrast rule
      rules: { 'color-contrast': { enabled: false } },
    });
  });

  it('has descriptive labels for screen readers', () => {
    cy.get('[role="gridcell"]').each(($cell) => {
      cy.wrap($cell).should('have.attr', 'aria-label').and('not.be.empty');
    });

    playerBoard().should('have.attr', 'aria-label', 'Twoja plansza');
    opponentBoard().should('have.attr', 'aria-label', 'Plansza przeciwnika');
  });
});

describe('Accessibility - create game dialog', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('is exposed as a dialog with an accessible name', () => {
    cy.get('[data-testid="create-game-dialog"]')
      .should('have.attr', 'role', 'dialog')
      .and('have.attr', 'aria-labelledby');
  });

  it('closes after the game is created', () => {
    cy.createGame();
    cy.get('[data-testid="create-game-dialog"]').should('not.exist');
  });
});
