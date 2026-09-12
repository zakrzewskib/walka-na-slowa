import { Text, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { WORD_LENGTH, WORDS_LENGTH } from '../constants';
import type { EvaluatedGuess, Guess } from '../types';
import { WordItem } from './WordItem';

interface GameBoardProps {
  guesses: Guess[];
  isPlayer: boolean;
  playerName: string;
}

export const GameBoard = (props: GameBoardProps) => {
  const { guesses, isPlayer, playerName } = props;

  const emptyGuesses: EvaluatedGuess[] = useMemo(() => {
    const result: EvaluatedGuess[] = [];

    for (let i = 0; i < WORDS_LENGTH - guesses.length; i++) {
      result.push({
        letters: Array.from({ length: WORD_LENGTH }, () => ({
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
        {guesses.map(({ evaluatedGuess }) => (
          <WordItem guess={evaluatedGuess} isPlayer={isPlayer} isCurrentTurn={false} />
        ))}

        {emptyGuesses.map((evaluatedGuess, idx) => (
          <WordItem guess={evaluatedGuess} isPlayer={isPlayer} isCurrentTurn={idx === 0} />
        ))}
      </VStack>
    </VStack>
  );
};
