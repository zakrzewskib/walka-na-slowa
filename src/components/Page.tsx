import { VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { responsiveInlinePadding } from './ui/constants';

export const Page = ({ children }: { children: ReactNode }) => {
  return (
    <VStack
      as="main"
      flex="1"
      maxW="7xl"
      w="full"
      mx="auto"
      paddingInline={responsiveInlinePadding}
      paddingBottom="2"
    >
      {children}
    </VStack>
  );
};
