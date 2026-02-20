import { HStack, Image, Text } from '@chakra-ui/react';

export default function Header() {
  return (
    <HStack
      as="header"
      maxW="7xl"
      w="full"
      mx="auto"
      paddingInline={{ base: '4', md: '6' }}
      paddingBottom={{ base: '0', md: '2' }}
      paddingTop="2"
      justifyContent="space-between"
    >
      <HStack>
        <Image src="/logo.webp" height="48px" />
        <Text as="h1" textStyle={{ base: 'md', sm: 'xl' }} fontWeight="bold">
          Walka na słowa
        </Text>
      </HStack>
      {/* tbd: Add author etc. */}
    </HStack>
  );
}
