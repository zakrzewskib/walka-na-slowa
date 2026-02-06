import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

function Page({ children }: { children: ReactNode }) {
  return (
    <Box maxW="7xl" mx="auto" p={{ base: '4', md: '6' }}>
      {children}
    </Box>
  );
}

export default Page;
