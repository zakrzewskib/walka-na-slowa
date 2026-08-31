import {
  POLISH_ALPHABET,
  WORD_LENGTH,
  WORDS_LENGTH,
} from '../../src/constants';

const KEYBOARD_ROWS = 4; // structural: fixed number of rows in the layout, not derived from data
const SPECIAL_KEYS_COUNT = 2; // Backspace + Enter
const KEYBOARD_CELLS = POLISH_ALPHABET.length + SPECIAL_KEYS_COUNT;

const BOARDS_COUNT = 2; // player + opponent
const BOARD_ROWS = WORDS_LENGTH;
const BOARD_CELLS_PER_ROW = WORD_LENGTH;
const CELLS_PER_BOARD = BOARD_ROWS * BOARD_CELLS_PER_ROW;

const TOTAL_GRIDS = BOARDS_COUNT + 1; // 2 boards + 1 keyboard
const TOTAL_ROWS = BOARDS_COUNT * BOARD_ROWS + KEYBOARD_ROWS;
const TOTAL_GRIDCELLS = BOARDS_COUNT * CELLS_PER_BOARD + KEYBOARD_CELLS;

describe('Accessibility', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  const playerBoard = () => cy.get('[data-testid="player-board"]');
  const opponentBoard = () => cy.get('[data-testid="opponent-board"]');
  const keyboard = () => cy.get('[data-testid="keyboard"]');

  it('should not have any accessibility violations', () => {
    cy.checkA11y();
  });

  it('has proper semantic HTML structure', () => {
    cy.get('[role="grid"]').should('have.length', TOTAL_GRIDS);
    cy.get('[role="row"]').should('have.length', TOTAL_ROWS);
    cy.get('[role="gridcell"]').should('have.length', TOTAL_GRIDCELLS);

    playerBoard().should('have.length', 1);
    playerBoard().find('[role="row"]').should('have.length', BOARD_ROWS);
    playerBoard()
      .find('[role="gridcell"]')
      .should('have.length', CELLS_PER_BOARD);

    opponentBoard().should('have.length', 1);
    opponentBoard().find('[role="row"]').should('have.length', BOARD_ROWS);
    opponentBoard()
      .find('[role="gridcell"]')
      .should('have.length', CELLS_PER_BOARD);

    keyboard().should('have.length', 1);
    keyboard().find('[role="row"]').should('have.length', KEYBOARD_ROWS);
    keyboard().find('[role="gridcell"]').should('have.length', KEYBOARD_CELLS);
  });

  it('has descriptive labels for screen readers', () => {
    cy.get('[role="gridcell"]').each(($cell) => {
      cy.wrap($cell).should('have.attr', 'aria-label').and('not.be.empty');
    });

    playerBoard().should('have.attr', 'aria-label', 'Your board');
    opponentBoard().should('have.attr', 'aria-label', "Opponent's board");
  });
});
