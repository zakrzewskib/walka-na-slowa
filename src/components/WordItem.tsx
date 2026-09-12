import { HStack } from '@chakra-ui/react';
import type { EvaluatedGuess } from '../types';
import { LetterItem } from './LetterItem/LetterItem';

interface WordItemProps {
  guess: EvaluatedGuess;
  isPlayer: boolean;
  isCurrentTurn: boolean;
}

export const WordItem = (props: WordItemProps) => {
  const { guess, isPlayer, isCurrentTurn } = props;

  return (
    <HStack
      gap="4px"
      mdDown={{
        width: 'full',
      }}
      smDown={{
        gap: '2px',
      }}
      role="row"
    >
      {guess.letters.map((letter) => (
        <LetterItem letter={letter} isPlayer={isPlayer} isCurrentTurn={isCurrentTurn} />
      ))}
    </HStack>
  );
};
