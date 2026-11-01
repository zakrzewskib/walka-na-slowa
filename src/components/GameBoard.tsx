import { Text, VStack } from '@chakra-ui/react';
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

// A not-yet-submitted row: typed letters first, the rest empty
function toPendingRow(word = ''): EvaluatedGuess {
  return {
    letters: Array.from({ length: WORD_LENGTH }, (_, i) => ({
      value: word[i] ?? '',
      exists: false,
      correctPlace: false,
    })),
  };
}

export const GameBoard = ({ isPlayer, playerName }: GameBoardProps) => {
  const currentGuess = useAppStore((state) => state.currentGuess);

  const guesses = useAppStore(
    useShallow((state) =>
      state.guesses.filter((guess) =>
        isPlayer ? guess.userId === CURRENT_USER_ID : guess.userId !== CURRENT_USER_ID,
      ),
    ),
  );

  const pendingRows = Array.from({ length: Math.max(0, WORDS_LENGTH - guesses.length) }, (_, i) =>
    toPendingRow(isPlayer && i === 0 ? currentGuess : ''),
  );

  return (
    <VStack mdDown={{ width: 'full', alignItems: 'stretch' }}>
      <Text alignSelf={isPlayer ? 'start' : 'end'}>
        {playerName} {isPlayer && '(Ty)'}
      </Text>

      <VStack
        gap="4px"
        smDown={{ gap: '2px' }}
        role="grid"
        aria-label={isPlayer ? 'Twoja plansza' : 'Plansza przeciwnika'}
        data-testid={isPlayer ? 'player-board' : 'opponent-board'}
      >
        {guesses.map(({ id, evaluatedGuess }) => (
          <WordItem key={id} guess={evaluatedGuess} isPlayer={isPlayer} isCurrentTurn={false} />
        ))}

        {pendingRows.map((row, i) => (
          <WordItem key={`pending-${i}`} guess={row} isPlayer={isPlayer} isCurrentTurn={i === 0} />
        ))}
      </VStack>
    </VStack>
  );
};
