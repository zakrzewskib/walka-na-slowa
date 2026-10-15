import { Text, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import { WORD_LENGTH, WORDS_LENGTH } from '../constants';
import { useAppStore } from '../store/store';
import type { EvaluatedGuess } from '../types';
import { WordItem } from './WordItem';

interface GameBoardProps {
  isPlayer: boolean;
  playerName: string;
}

// todo: add auth and storing user and separate guesses
const CURRENT_USER_ID = 'user1';

export const GameBoard = ({ isPlayer, playerName }: GameBoardProps) => {
  const guesses = useAppStore(
    useShallow((state) =>
      state.guesses.filter((guess) =>
        isPlayer ? guess.userId == CURRENT_USER_ID : guess.userId !== CURRENT_USER_ID,
      ),
    ),
  );

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
        {guesses.map(({ id, evaluatedGuess }) => (
          <WordItem key={id} guess={evaluatedGuess} isPlayer={isPlayer} isCurrentTurn={false} />
        ))}

        {emptyGuesses.map((evaluatedGuess, idx) => (
          <WordItem
            key={`empty-${idx}`}
            guess={evaluatedGuess}
            isPlayer={isPlayer}
            isCurrentTurn={idx === 0}
          />
        ))}
      </VStack>
    </VStack>
  );
};
