// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

import 'cypress-axe';

beforeEach(() => {
  // Real emulation at the browser level, so CSS media queries see it too.
  // CDP is only available in Chromium-based browsers (Chrome, Edge, Electron).
  if (Cypress.isBrowser({ family: 'chromium' })) {
    Cypress.automation('remote:debugger:protocol', {
      command: 'Emulation.setEmulatedMedia',
      params: { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] },
    });
  }
});
