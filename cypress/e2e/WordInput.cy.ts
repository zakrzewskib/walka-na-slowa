// GENAI START

describe('Word Input - Color Results', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  function submitWord(word: string) {
    cy.get('[data-testid="word-input"]').type(word);
    cy.get('[data-testid="word-input"]').type('{enter}');
  }

  // LALKA is the correct word
  // Colors: green = correct position, yellow = wrong position, gray = not in word

  it('shows all green for correct word LALKA', () => {
    submitWord('LALKA');

    cy.get('[role="grid"]')
      .first()
      .find('[role="row"]')
      .first()
      .find('[role="gridcell"]')
      .then((cells) => {
        // L - correct position → green
        cy.wrap(cells[0]).should(
          'have.css',
          'background-color',
          'rgb(34, 197, 94)',
        );
        // A - correct position → green
        cy.wrap(cells[1]).should(
          'have.css',
          'background-color',
          'rgb(34, 197, 94)',
        );
        // L - correct position → green
        cy.wrap(cells[2]).should(
          'have.css',
          'background-color',
          'rgb(34, 197, 94)',
        );
        // K - correct position → green
        cy.wrap(cells[3]).should(
          'have.css',
          'background-color',
          'rgb(34, 197, 94)',
        );
        // A - correct position → green
        cy.wrap(cells[4]).should(
          'have.css',
          'background-color',
          'rgb(34, 197, 94)',
        );
      });
  });

  it('shows all gray for word with no matching letters (BRTGW)', () => {
    submitWord('BRTGW');

    cy.get('[role="grid"]')
      .first()
      .find('[role="row"]')
      .first()
      .find('[role="gridcell"]')
      .each((cell) => {
        cy.wrap(cell).should(
          'have.css',
          'background-color',
          'rgb(161, 161, 170)',
        );
      });
  });

  it('shows correct mixed colors for KALLA', () => {
    // Correct word: LALKA
    // K → gray (K is in LALKA but position 4 is K, here K is at 0 — yellow? Let's trace:)
    // Pass 1 greens: A(1)=A✓green, L(2)=L✓green, L(3)... wait

    // KALLA vs LALKA:
    // pos0: K vs L → no green. correctLetterCounts: L=1 (pos1 matched), A=1 (pos3 not matched wait...
    // Let me retrace carefully:
    // guess:   K A L L A
    // correct: L A L K A
    // Pass 1 (greens):
    //   pos0: K≠L → count L: correctLetterCounts[L]++ → {L:1}
    //   pos1: A=A → GREEN, result[1]=green
    //   pos2: L=L → GREEN, result[2]=green
    //   pos3: L≠K → count K: {L:1, K:1}
    //   pos4: A=A → GREEN, result[4]=green
    // Pass 2 (yellows/grays):
    //   pos0: K, correctLetterCounts[K]=1 → YELLOW, K count→0
    //   pos3: L, correctLetterCounts[L]=1 → YELLOW, L count→0

    // Result: K=yellow, A=green, L=green, L=yellow, A=green
    submitWord('KALLA');

    cy.get('[role="grid"]')
      .first()
      .find('[role="row"]')
      .first()
      .find('[role="gridcell"]')
      .then((cells) => {
        cy.wrap(cells[0]).should(
          'have.css',
          'background-color',
          'rgb(234, 179, 8)',
        ); // K → yellow
        cy.wrap(cells[1]).should(
          'have.css',
          'background-color',
          'rgb(34, 197, 94)',
        ); // A → green
        cy.wrap(cells[2]).should(
          'have.css',
          'background-color',
          'rgb(34, 197, 94)',
        ); // L → green
        cy.wrap(cells[3]).should(
          'have.css',
          'background-color',
          'rgb(234, 179, 8)',
        ); // L → yellow
        cy.wrap(cells[4]).should(
          'have.css',
          'background-color',
          'rgb(34, 197, 94)',
        ); // A → green
      });
  });

  it('shows correct colors for LLLLZ - tests duplicate letter logic', () => {
    // guess:   L L L L Z
    // correct: L A L K A
    // Pass 1 (greens):
    //   pos0: L=L → GREEN
    //   pos1: L≠A → correctLetterCounts[A]++ → {A:1}
    //   pos2: L=L → GREEN
    //   pos3: L≠K → correctLetterCounts[K]++ → {A:1, K:1}
    //   pos4: Z≠A → correctLetterCounts[A]++ → {A:2, K:1}
    // Pass 2:
    //   pos1: L, correctLetterCounts[L]=0 → GRAY
    //   pos3: L, correctLetterCounts[L]=0 → GRAY
    //   pos4: Z, correctLetterCounts[Z]=0 → GRAY

    submitWord('LLLLZ');

    cy.get('[role="grid"]')
      .first()
      .find('[role="row"]')
      .first()
      .find('[role="gridcell"]')
      .then((cells) => {
        cy.wrap(cells[0]).should(
          'have.css',
          'background-color',
          'rgb(34, 197, 94)',
        ); // L → green
        cy.wrap(cells[1]).should(
          'have.css',
          'background-color',
          'rgb(161, 161, 170)',
        ); // L → gray (no extra L)
        cy.wrap(cells[2]).should(
          'have.css',
          'background-color',
          'rgb(34, 197, 94)',
        ); // L → green
        cy.wrap(cells[3]).should(
          'have.css',
          'background-color',
          'rgb(161, 161, 170)',
        ); // L → gray
        cy.wrap(cells[4]).should(
          'have.css',
          'background-color',
          'rgb(161, 161, 170)',
        ); // Z → gray
      });
  });

  it('input clears after submission', () => {
    submitWord('LALKA');
    cy.get('[data-testid="word-input"]').should('have.value', '');
  });

  it('does not submit words shorter than 5 letters', () => {
    submitWord('LA');

    // Board should still show no guesses (all empty rows)
    cy.get('[role="grid"]')
      .first()
      .find('[role="row"]')
      .first()
      .find('[role="gridcell"]')
      .each((cell) => {
        cy.wrap(cell).should(
          'not.have.css',
          'background-color',
          'rgb(34, 197, 94)',
        );
        cy.wrap(cell).should(
          'not.have.css',
          'background-color',
          'rgb(234, 179, 8)',
        );
        cy.wrap(cell).should(
          'not.have.css',
          'background-color',
          'rgb(161, 161, 170)',
        );
      });
  });

  it('appends new guess rows on each submission', () => {
    submitWord('BRTGW');
    submitWord('LALKA');

    cy.get('[role="grid"]')
      .first()
      .find('[role="row"]')
      .eq(0)
      .find('[role="gridcell"]')
      .each((cell) => {
        cy.wrap(cell).should(
          'have.css',
          'background-color',
          'rgb(161, 161, 170)',
        ); // all gray
      });

    cy.get('[role="grid"]')
      .first()
      .find('[role="row"]')
      .eq(1)
      .find('[role="gridcell"]')
      .each((cell) => {
        cy.wrap(cell).should(
          'have.css',
          'background-color',
          'rgb(34, 197, 94)',
        ); // all green
      });
  });
});

// GENAI END
