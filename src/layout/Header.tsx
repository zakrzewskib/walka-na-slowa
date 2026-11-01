import { HStack, Image, Text } from '@chakra-ui/react';

export const Header = () => {
  return (
    <HStack
      as="header"
      maxW="7xl"
      w="full"
      mx="auto"
      // todo: unify paddings into some constant
      paddingInline={{ base: '1', sm: '4', md: '6' }}
      paddingBottom={{ base: '0', md: '2' }}
      paddingTop="2"
      justifyContent="space-between"
    >
      <HStack>
        <Image
          src="/logo.webp"
          height={{ base: '36px', sm: '48px' }}
          alt="Logo gry walka na słowa"
        />
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
