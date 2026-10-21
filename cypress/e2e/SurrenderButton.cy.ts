import { getStore, submitWord } from '../support/helpers';

const STORAGE_KEY = 'walka-na-slowa-storage';
const surrenderButton = '[data-testid="surrender-button"]';
const dialog = '[data-testid="create-game-dialog"]';

describe('Surrender Button', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.createGame();
  });

  it('shows new dialog', () => {
    cy.get(surrenderButton).click();

    cy.get(dialog).should('be.visible');
  });

  it('clears the game state and the persisted gameId', () => {
    submitWord('BRTGW');

    // there is an active game before surrendering
    cy.window().then((win) => {
      const { gameId, guesses } = getStore(win).getState();
      expect(gameId).to.not.equal('');
      expect(guesses).to.have.length(1);
    });

    cy.get(surrenderButton).click();
    cy.get(dialog).should('be.visible');

    cy.window().then((win) => {
      const { gameId, correctWord, guesses } = getStore(win).getState();
      expect(gameId).to.equal('');
      expect(correctWord).to.equal('');
      expect(guesses).to.have.length(0);

      // a reload must not restore the finished game
      const stored = JSON.parse(win.localStorage.getItem(STORAGE_KEY) ?? '{}');
      expect(stored.state.gameId).to.equal('');
    });
  });

  it('shows toast error when finishing game fails', () => {
    cy.window().then((win) => {
      getStore(win).setState({
        finishGame: () => Promise.reject(new Error('boom')),
      });
    });

    cy.get(surrenderButton).click();

    cy.get(dialog).should('not.exist');
    cy.get('[data-testid="toaster"]').should('contain.text', 'Nie udało się zakończyć gry');
  });
});
