import { POLISH_ALPHABET } from '../../src/constants';

const KEYBOARD_ROWS = 4; // structural: fixed number of rows in the layout, not derived from data
const SPECIAL_KEYS_COUNT = 2; // Backspace + Enter
const TOTAL_KEYBOARD_CELLS = POLISH_ALPHABET.length + SPECIAL_KEYS_COUNT;

describe('Keyboard Display', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  const keyboard = () => cy.get('[data-testid="keyboard"]');

  it('renders the keyboard grid', () => {
    keyboard().should('exist');
  });

  it('renders the correct number of rows', () => {
    keyboard().find('[role="row"]').should('have.length', KEYBOARD_ROWS);
  });

  it('renders the correct total number of keys', () => {
    keyboard()
      .find('[role="gridcell"]')
      .should('have.length', TOTAL_KEYBOARD_CELLS);
  });

  it('renders every Polish alphabet letter exactly once', () => {
    keyboard()
      .find('[role="gridcell"]')
      .then(($cells) => {
        const texts = [...$cells].map((el) =>
          el.textContent?.toLocaleLowerCase(),
        );
        POLISH_ALPHABET.forEach((letter) => {
          expect(texts).to.include(letter);
        });
      });
  });

  it('renders Backspace and Enter keys', () => {
    keyboard().contains('[role="gridcell"]', '⌫').should('exist');
    keyboard().contains('[role="gridcell"]', 'Enter').should('exist');
  });

  it('gives every key an accessible aria-label', () => {
    keyboard()
      .find('[role="gridcell"]')
      .each(($cell) => {
        cy.wrap($cell).should('have.attr', 'aria-label').and('not.be.empty');
      });
  });

  it('does not have duplicate keys within a row', () => {
    keyboard()
      .find('[role="row"]')
      .each(($row) => {
        const texts: string[] = [];
        cy.wrap($row)
          .find('[role="gridcell"]')
          .each(($cell) => {
            texts.push($cell.text());
          })
          .then(() => {
            const unique = new Set(texts);
            expect(unique.size).to.eq(texts.length);
          });
      });
  });
});
