describe('Letter Component', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays letter values for player 1', () => {
    cy.get('[role="grid"]')
      .first()
      .within(() => {
        cy.contains('Z').should('be.visible');
        cy.contains('A').should('be.visible');
        cy.contains('M').should('be.visible');
        cy.contains('E').should('be.visible');
        cy.contains('K').should('be.visible');
      });
  });

  it('hides opponent letter values', () => {
    cy.get('[role="grid"]')
      .last()
      .within(() => {
        // Hidden letters should not display '-' character
        cy.contains('-').should('not.exist');
      });
  });

  it('displays correct background colors', () => {
    // Green for correct position (first letter 'Z')
    cy.get('[role="grid"]')
      .first()
      .find('[role="gridcell"]')
      .contains('Z')
      .should('have.css', 'background-color', 'rgb(34, 197, 94)'); // green.500

    // Yellow for wrong position (second letter 'A')
    cy.get('[role="grid"]')
      .first()
      .find('[role="gridcell"]')
      .contains('A')
      .should('have.css', 'background-color', 'rgb(234, 179, 8)'); // yellow.500

    // Gray for incorrect letter (third letter 'M')
    cy.get('[role="grid"]')
      .first()
      .find('[role="gridcell"]')
      .contains('M')
      .should('have.css', 'background-color', 'rgb(161, 161, 170)'); // gray.400
  });

  it('displays border on current turn row', () => {
    // Second row (first empty row) should have blue border for player 1
    cy.get('[role="grid"]')
      .first()
      .find('[role="row"]')
      .eq(1) // Second row (index 1)
      .find('[role="gridcell"]')
      .first()
      .should('have.css', 'border-color', 'rgb(59, 130, 246)'); // blue.500

    // Second row should have red border for player 2 (opponent)
    cy.get('[role="grid"]')
      .last()
      .find('[role="row"]')
      .eq(1)
      .find('[role="gridcell"]')
      .first()
      .should('have.css', 'border-color', 'rgb(239, 68, 68)'); // red.500
  });

  it('has proper accessibility labels', () => {
    cy.get('[aria-label="Your board"]').should('exist');
    cy.get('[aria-label="Opponent\'s board"]').should('exist');
    cy.get('[aria-label="Letter Z, correct position"]').should('exist');
    cy.get('[aria-label="Letter A, wrong position"]').should('exist');
    cy.get('[aria-label="Empty cell, your turn"]').should('exist');
  });
});
