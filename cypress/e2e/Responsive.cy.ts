import { key, keyboard, shouldNotOverflowHorizontally } from '../support/helpers';
import { sel } from '../support/selectors';
import { viewports } from '../support/viewports';

describe('Responsive Design', () => {
  viewports.forEach(({ device, width, height }) => {
    describe(`${device} (${width}x${height})`, () => {
      beforeEach(() => {
        cy.viewport(width, height);
        cy.startGame();
      });

      it('displays boards correctly', () => {
        cy.get(sel.grid).should('be.visible');
        cy.contains('Gracz 1').should('be.visible');
        cy.contains('Gracz 2').should('be.visible');
      });

      it('has readable letter sizes', () => {
        cy.get(sel.gridCell).first().should('be.visible');
      });

      it('shows the whole on-screen keyboard', () => {
        keyboard().should('be.visible');
        key('A').should('be.visible');
        key('Enter').should('be.visible');
        key('Backspace').should('be.visible');
      });

      it('does not scroll horizontally', () => {
        shouldNotOverflowHorizontally(width);
      });
    });
  });
});
