import { WORD_LENGTH, WORDS_LENGTH } from '../../src/constants';
import { eachRowShouldHaveCells, opponentBoard, playerBoard } from '../support/helpers';
import { sel } from '../support/selectors';

describe('Game Boards Display for both players', () => {
  beforeEach(() => {
    cy.createVersusGame();
  });

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
    cy.contains('Gracz 2 (Ty)').should('not.exist');
  });

  it('labels the player board and opponent board distinctly', () => {
    playerBoard().should('have.attr', 'aria-label', 'Twoja plansza');
    opponentBoard().should('have.attr', 'aria-label', 'Plansza przeciwnika');
  });

  const boards = [
    { name: 'player board', board: playerBoard },
    { name: 'opponent board', board: opponentBoard },
  ];

  boards.forEach(({ name, board }) => {
    describe(name, () => {
      it('displays correct number of rows', () => {
        board().find(sel.row).should('have.length', WORDS_LENGTH);
      });

      it('displays correct number of cells per row', () => {
        eachRowShouldHaveCells(board(), WORD_LENGTH);
      });

      it('displays correct total number of cells', () => {
        board()
          .find(sel.gridCell)
          .should('have.length', WORDS_LENGTH * WORD_LENGTH);
      });
    });
  });

  // Actual letter/status content (correct/present/absent) and current-turn
  // highlighting depend on live game state (WebSocket/game session) which
  // isn't seeded in e2e yet. Not covering that here — e2e coverage of
  // in-progress game state isn't a priority right now.
});
