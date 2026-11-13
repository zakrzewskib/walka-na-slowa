import { key, keyboard, shouldNotOverflowHorizontally } from '../support/helpers';
import { sel } from '../support/selectors';
import { viewports } from '../support/viewports';

const modes = [
  { mode: 'versus', create: () => cy.createVersusGame(), boards: 2 },
  { mode: 'solo', create: () => cy.createSoloGame(), boards: 1 },
] as const;

describe('Responsive Design', () => {
  modes.forEach(({ mode, create, boards }) => {
    describe(`${mode} mode`, () => {
      viewports.forEach(({ device, width, height }) => {
        describe(`${device} (${width}x${height})`, () => {
          beforeEach(() => {
            cy.viewport(width, height);
            create();
          });

          it('displays boards correctly', () => {
            cy.get(sel.grid).should('have.length', boards).and('be.visible');
            cy.contains('Gracz 1').should('be.visible');
            if (mode === 'solo') {
              cy.contains('Gracz 2').should('not.exist');
            } else {
              cy.contains('Gracz 2').should('be.visible');
            }
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
  });
});
