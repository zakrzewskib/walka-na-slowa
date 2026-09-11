import { Text, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WORD_LENGTH, WORDS_LENGTH } from '../constants';
import type { Guess, Word } from '../types';
import { WordItem } from './WordItem';

interface GameBoardProps {
  guesses: Guess[];
  isPlayer: boolean;
  playerName: string;
}

export const GameBoard = (props: GameBoardProps) => {
  const { guesses, isPlayer, playerName } = props;

  const emptyWords: Word[] = useMemo(() => {
    const result: Word[] = [];

    for (let i = 0; i < WORDS_LENGTH - guesses.length; i++) {
      result.push({
        id: uuidv4(),
        letters: Array.from({ length: WORD_LENGTH }, () => ({
          id: uuidv4(),
          value: '',
          exists: false,
          correctPlace: false,
        })),
      });
    }

    return result;
  }, [guesses.length]); // Only regenerate if number of words changes

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
        role="grid"
        aria-label={isPlayer ? 'Twoja plansza' : 'Plansza przeciwnika'}
        data-testid={isPlayer ? 'player-board' : 'opponent-board'}
      >
        {guesses.map(({ word, id }) => (
          <WordItem key={id} word={word} isPlayer={isPlayer} isCurrentTurn={false} />
        ))}

        {emptyWords.map((word, idx) => (
          <WordItem key={word.id} word={word} isPlayer={isPlayer} isCurrentTurn={idx === 0} />
        ))}
      </VStack>
    </VStack>
  );
};
