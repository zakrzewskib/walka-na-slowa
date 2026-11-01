import { createSystem, defaultConfig } from '@chakra-ui/react';

export const customSystem = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        body: {
          value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        },
        heading: {
          value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        },
      },
    },
  },
  // for example: toaster close trigger
  globalCss: {
    'button:not(:disabled), [role="button"]:not([aria-disabled="true"])': {
      cursor: 'pointer',
    },
  },
});

// Chakra breakpoints:
// https://chakra-ui.com/docs/theming/breakpoints

// sm @media screen (min-width >= 480px)
// md @media screen (min-width >= 768px)
// lg @media screen (min-width >= 1024px)
// xl @media screen (min-width >= 1280px)
// 2xl @media screen (min-width >= 1536px)

// gap={{ base: '2px', sm: '4px' }} = >= sm: 4px, < sm: px
