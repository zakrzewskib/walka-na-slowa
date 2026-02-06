import { HStack } from '@chakra-ui/react';
import GameBoard from './components/GameBoard';
import Page from './components/Page';
import type { IWord } from './types';

function App() {
  const playerWords: IWord[] = [
    [
      { value: 'Z', exists: true, correctPlace: true },
      { value: 'A', exists: true, correctPlace: false },
      { value: 'M', exists: false, correctPlace: false },
      { value: 'E', exists: true, correctPlace: false },
      { value: 'K', exists: false, correctPlace: false },
    ],
  ];

  const opponentWords: IWord[] = [
    [
      { value: '-', exists: true, correctPlace: true },
      { value: '-', exists: true, correctPlace: false },
      { value: '-', exists: false, correctPlace: false },
      { value: '-', exists: true, correctPlace: false },
      { value: '-', exists: false, correctPlace: false },
    ],
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
