import { HStack } from '@chakra-ui/react';
import type { Word } from '../types';
import { LetterItem } from './LetterItem/LetterItem';

interface WordItemProps {
  word: Word;
  isPlayer: boolean;
  isCurrentTurn: boolean;
}

export const WordItem = (props: WordItemProps) => {
  const { word, isPlayer, isCurrentTurn } = props;

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
      {word.letters.map((letter, idx) => (
        <LetterItem
          key={`${word.id}-${idx}`}
          letter={letter}
          isPlayer={isPlayer}
          isCurrentTurn={isCurrentTurn}
        />
      ))}
    </HStack>
  );
};
