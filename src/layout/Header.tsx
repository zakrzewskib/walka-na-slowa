import { HStack, Image, Text } from '@chakra-ui/react';
import { responsiveInlinePadding } from './constants';

export const Header = () => {
  return (
    <HStack
      as="header"
      maxW="7xl"
      w="full"
      mx="auto"
      paddingInline={responsiveInlinePadding}
      paddingBottom={{ base: '0', md: '2' }}
      paddingTop="2"
      justifyContent="space-between"
    >
      <HStack>
        <Image alt="logo" src="/logo.webp" height={{ base: '36px', sm: '48px' }} />
        <Text
          as="h1"
          textStyle={{ base: 'md', sm: 'xl' }}
          fontWeight="bold"
          lineHeight="1.05"
          letterSpacing="tighter"
          wordSpacing="-0.05em"
          textWrap="balance"
        >
          walka na słowa
        </Text>
      </HStack>
      {/* todo: Add author etc. */}
    </HStack>
  );
};
