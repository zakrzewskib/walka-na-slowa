import { HStack, Text, VStack } from '@chakra-ui/react';
import { WORD_LENGTH, WORDS_LENGTH } from '../constants';
import type { IWord } from '../types';
import Letter from './Letter';

interface GameBoardProps {
  words: IWord[];
  isPlayer: boolean;
  playerName: string;
}

function GameBoard(props: GameBoardProps) {
  const { words, isPlayer, playerName } = props;

  return (
    <VStack
      mdDown={{
        width: 'full',
        alignItems: 'stretch',
      }}
    >
      <Text alignSelf={isPlayer ? 'start' : 'end'}>
        {playerName} {isPlayer && '(Ty)'}
      </Text>
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
                isOpponent={!isPlayer}
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
                isOpponent={!isPlayer}
              />
            ))}
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}

export default GameBoard;
