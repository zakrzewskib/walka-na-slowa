import { HStack } from '@chakra-ui/react';
import type { IWord } from '../types';
import Letter from './Letter';

interface WordProps {
  word: IWord;
  isPlayer: boolean;
  isCurrentTurn: boolean;
}

function Word(props: WordProps) {
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
      {word.letters.map((letter) => (
        <Letter
          key={letter.id}
          letter={letter}
          isPlayer={isPlayer}
          isCurrentTurn={isCurrentTurn}
        />
      ))}
    </HStack>
  );
}

export default Word;
