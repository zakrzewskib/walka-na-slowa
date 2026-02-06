import { HStack, Text, VStack } from '@chakra-ui/react';
import { WORD_LENGTH, WORDS_LENGTH } from '../constants';
import type { IWord } from '../types';
import Letter from './Letter';

function PlayerBoard() {
  const words: IWord[] = [
    [
      { value: 'Z', exists: true, correctPlace: true },
      { value: 'A', exists: true, correctPlace: false },
      { value: 'M', exists: false, correctPlace: false },
      { value: 'E', exists: true, correctPlace: false },
      { value: 'K', exists: false, correctPlace: false },
    ],
  ];

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
            {word.map(({ value, correctPlace, exists }) => (
              <Letter
                value={value}
                correctPlace={correctPlace}
                exists={exists}
              />
            ))}
          </HStack>
        ))}

        {new Array(WORDS_LENGTH - words.length).fill('').map((_, idx) => (
          <HStack
            gap="4px"
            mdDown={{
              width: 'full',
            }}
          >
            {new Array(WORD_LENGTH).fill('').map(() => (
              <Letter
                value=""
                exists={false}
                correctPlace={false}
                isCurrentTurn={idx === 0}
              />
            ))}
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}

export default PlayerBoard;
