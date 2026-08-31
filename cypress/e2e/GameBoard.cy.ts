import { WORD_LENGTH, WORDS_LENGTH } from '../../src/constants';

describe('Game Boards Display', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  const playerBoard = () => cy.get('[data-testid="player-board"]');
  const opponentBoard = () => cy.get('[data-testid="opponent-board"]');

  it('displays exactly one player board and one opponent board', () => {
    playerBoard().should('have.length', 1);
    opponentBoard().should('have.length', 1);
  });

  it('displays both player boards', () => {
    cy.contains('Gracz 1').should('be.visible');
    cy.contains('Gracz 2').should('be.visible');
  });

  it('shows "(Ty)" only on player 1 board', () => {
    cy.contains('Gracz 1 (Ty)').should('be.visible');
    cy.contains('Gracz 2').should('be.visible');
    cy.contains('Gracz 2 (Ty)').should('not.exist');
  });

  it('labels the player board and opponent board distinctly', () => {
    playerBoard().should('have.attr', 'aria-label', 'Your board');
    opponentBoard().should('have.attr', 'aria-label', "Opponent's board");
  });

  it('displays correct number of rows per board', () => {
    playerBoard().find('[role="row"]').should('have.length', WORDS_LENGTH);
    opponentBoard().find('[role="row"]').should('have.length', WORDS_LENGTH);
  });

  it('displays correct number of cells per row on each board', () => {
    playerBoard()
      .find('[role="row"]')
      .each(($row) => {
        cy.wrap($row)
          .find('[role="gridcell"]')
          .should('have.length', WORD_LENGTH);
      });

    opponentBoard()
      .find('[role="row"]')
      .each(($row) => {
        cy.wrap($row)
          .find('[role="gridcell"]')
          .should('have.length', WORD_LENGTH);
      });
  });

  it('displays correct total number of cells per board', () => {
    playerBoard()
      .find('[role="gridcell"]')
      .should('have.length', WORDS_LENGTH * WORD_LENGTH);
    opponentBoard()
      .find('[role="gridcell"]')
      .should('have.length', WORDS_LENGTH * WORD_LENGTH);
  });

  // Actual letter/status content (correct/present/absent) and current-turn
  // highlighting depend on live game state (WebSocket/game session) which
  // isn't seeded in e2e yet. Not covering that here — e2e coverage of
  // in-progress game state isn't a priority right now.
});
