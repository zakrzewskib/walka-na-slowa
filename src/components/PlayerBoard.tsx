import { HStack, Text, VStack } from '@chakra-ui/react';
import Letter from './Letter';

function PlayerBoard() {
  const words = ['ZAMEK', 'LAMPA', 'KWIAT', 'BALON', 'ŻÓŁTY'];

  return (
    <VStack
      mdDown={{
        width: 'full',
        alignItems: 'stretch',
      }}
    >
      <Text alignSelf="start">Gracz 1 (Ty)</Text>
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

export default PlayerBoard;
