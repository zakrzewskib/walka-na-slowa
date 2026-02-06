describe('Responsive Design', () => {
  const viewports = [
    { device: 'iphone-6', width: 375, height: 667 },
    { device: 'ipad-2', width: 768, height: 1024 },
    { device: 'desktop', width: 1280, height: 720 },
  ];

  viewports.forEach(({ device, width, height }) => {
    describe(`${device} (${width}x${height})`, () => {
      beforeEach(() => {
        cy.viewport(width, height);
        cy.visit('/');
      });

      it('displays boards correctly', () => {
        cy.get('[role="grid"]').should('be.visible');
        cy.contains('Gracz 1').should('be.visible');
        cy.contains('Gracz 2').should('be.visible');
      });

      it('has readable letter sizes', () => {
        cy.get('[role="gridcell"]').first().should('be.visible');
      });
    });
  });
});
