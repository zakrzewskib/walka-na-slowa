import { Text, VStack } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { WORD_LENGTH, WORDS_LENGTH } from '../constants';
import type { ILetter, IWord } from '../types';
import Word from './Word';

interface GameBoardProps {
  words: IWord[];
  isPlayer: boolean;
  playerName: string;
}

function GameBoard(props: GameBoardProps) {
  const { words, isPlayer, playerName } = props;

  const emptyWords: IWord[] = [];

  const emptyLetter: ILetter = {
    id: uuidv4(),
    value: '',
    exists: false,
    correctPlace: false,
  };

  for (let i = 0; i < WORDS_LENGTH - words.length; i++) {
    emptyWords.push({
      id: uuidv4(),
      letters: [...new Array(WORD_LENGTH).fill(emptyLetter)],
    });
  }

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

      <VStack
        gap="4px"
        smDown={{
          gap: '2px',
        }}
      >
        {words.map((word) => (
          <Word
            key={word.id}
            word={word}
            isPlayer={isPlayer}
            isCurrentTurn={false}
          />
        ))}

        {emptyWords.map((word, idx) => (
          <Word
            key={word.id}
            word={word}
            isPlayer={isPlayer}
            isCurrentTurn={idx === 0}
          />
        ))}
      </VStack>
    </VStack>
  );
}

export default GameBoard;
