import { VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';

export const Page = ({ children }: { children: ReactNode }) => {
  return (
    <VStack as="main" flex="1" maxW="7xl" w="full" mx="auto" p={{ base: '1', sm: '4', md: '6' }}>
      {children}
    </VStack>
  );
};
