import { HStack, Text, VStack } from '@chakra-ui/react';
import Letter from './Letter';

function OpponentBoard() {
  const words = ['     ', '     ', '     ', '     ', '     '];

  return (
    <VStack alignItems="end">
      <Text>Gracz 2</Text>
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
    </VStack>
  );
}

export default OpponentBoard;
