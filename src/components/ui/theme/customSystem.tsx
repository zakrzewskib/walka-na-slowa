import { createSystem, defaultConfig } from '@chakra-ui/react';

export const customSystem = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        body: {
          value:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        },
        heading: {
          value:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        },
      },
    },
  },
});
