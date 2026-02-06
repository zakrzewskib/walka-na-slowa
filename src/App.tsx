import { HStack } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import GameBoard from './components/GameBoard';
import Page from './components/Page';
import { HIDDEN_LETTER } from './constants';
import type { IWord } from './types';

function App() {
  const playerWords: IWord[] = [
    {
      id: uuidv4(),
      letters: [
        { id: uuidv4(), value: 'Z', exists: true, correctPlace: true },
        { id: uuidv4(), value: 'A', exists: true, correctPlace: false },
        { id: uuidv4(), value: 'M', exists: false, correctPlace: false },
        { id: uuidv4(), value: 'E', exists: true, correctPlace: false },
        { id: uuidv4(), value: 'K', exists: false, correctPlace: false },
      ],
    },
  ];

  const opponentWords: IWord[] = [
    {
      id: uuidv4(),
      letters: [
        {
          id: uuidv4(),
          value: HIDDEN_LETTER,
          exists: true,
          correctPlace: true,
        },
        {
          id: uuidv4(),
          value: HIDDEN_LETTER,
          exists: true,
          correctPlace: false,
        },
        {
          id: uuidv4(),
          value: HIDDEN_LETTER,
          exists: false,
          correctPlace: false,
        },
        {
          id: uuidv4(),
          value: HIDDEN_LETTER,
          exists: true,
          correctPlace: false,
        },
        {
          id: uuidv4(),
          value: HIDDEN_LETTER,
          exists: false,
          correctPlace: false,
        },
      ],
    },
  ];

  return (
    <Page>
      <HStack gap="24px" justifyContent="center">
        <GameBoard words={playerWords} isPlayer={true} playerName="Gracz 1" />
        <GameBoard
          words={opponentWords}
          isPlayer={false}
          playerName="Gracz 2"
        />
      </HStack>
    </Page>
  );
}

export default App;
