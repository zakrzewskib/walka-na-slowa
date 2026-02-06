import { HStack, VStack } from '@chakra-ui/react';
import Letter from './Letter';

function PlayerBoard() {
  const words = ['ZAMEK', 'LAMPA', 'KWIAT', 'BALON', 'ŻÓŁTY'];

  return (
    <VStack
      gap="4px"
      mdDown={{
        width: 'full',
      }}
    >
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
  );
}

export default PlayerBoard;
