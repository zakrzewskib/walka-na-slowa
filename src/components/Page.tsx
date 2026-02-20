import { VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';

function Page({ children }: { children: ReactNode }) {
  return (
    <VStack flex="1" maxW="7xl" mx="auto" p={{ base: '4', md: '6' }} as="main">
      {children}
    </VStack>
  );
}

export default Page;
