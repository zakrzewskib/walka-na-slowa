import { HStack, Text, VStack } from '@chakra-ui/react';
import Letter from './Letter';

function OpponentBoard() {
  const words = ['     ', '     ', '     ', '     ', '     '];

  return (
    <VStack
      mdDown={{
        width: 'full',
        alignItems: 'stretch',
      }}
    >
      <Text alignSelf="end">Gracz 2</Text>
      <VStack gap="4px">
        {words.map((word) => (
          <HStack
            gap="4px"
            mdDown={{
              width: 'full',
            }}
          >
            {word.split('').map((letter) => (
              <Letter value={letter} />
            ))}
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}

export default OpponentBoard;
