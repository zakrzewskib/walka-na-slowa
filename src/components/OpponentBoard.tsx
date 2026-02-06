import { HStack, Text, VStack } from '@chakra-ui/react';
import { WORD_LENGTH, WORDS_LENGTH } from '../constants';
import type { IWord } from '../types';
import Letter from './Letter';

// todo: think about reusing playerBoard component: to consider: different listeners and how many places needs conditions
function OpponentBoard() {
  const words: IWord[] = [
    [
      { value: '-', exists: true, correctPlace: true },
      { value: '-', exists: true, correctPlace: false },
      { value: '-', exists: false, correctPlace: false },
      { value: '-', exists: true, correctPlace: false },
      { value: '-', exists: false, correctPlace: false },
    ],
  ];

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
            {word.map(({ value, correctPlace, exists }) => (
              <Letter
                value={value}
                correctPlace={correctPlace}
                exists={exists}
                isOpponent={true}
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
                isOpponent={true}
              />
            ))}
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}

export default OpponentBoard;
