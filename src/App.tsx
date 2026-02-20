import { HStack, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import GameBoard from './components/GameBoard';
import WordInput from './components/WordInput';
import { HIDDEN_LETTER, MOCK_CORRECT_WORD } from './constants';
import Layout from './layout/Layout';
import type { IWord } from './types';

const MOCK_OPPONENT_WORDS: IWord[] = [
  {
    id: uuidv4(),
    letters: [
      {
        value: HIDDEN_LETTER,
        exists: true,
        correctPlace: true,
      },
      {
        value: HIDDEN_LETTER,
        exists: true,
        correctPlace: false,
      },
      {
        value: HIDDEN_LETTER,
        exists: false,
        correctPlace: false,
      },
      {
        value: HIDDEN_LETTER,
        exists: true,
        correctPlace: false,
      },
      {
        value: HIDDEN_LETTER,
        exists: false,
        correctPlace: false,
      },
    ],
  },
];

function App() {
  const [userWords, setUserWords] = useState<IWord[]>([]);

  function handleSubmit(guessResult: IWord) {
    setUserWords((prev) => [...prev, guessResult]);
  }

  return (
    <Layout>
      <VStack w="full" flex="1" justifyContent="space-between">
        <HStack gap="24px" justifyContent="center" w="full">
          <GameBoard words={userWords} isPlayer={true} playerName="Gracz 1" />
          <GameBoard
            words={MOCK_OPPONENT_WORDS}
            isPlayer={false}
            playerName="Gracz 2"
          />
        </HStack>

        <WordInput onSubmit={handleSubmit} correctWord={MOCK_CORRECT_WORD} />
      </VStack>
    </Layout>
  );
}

export default App;
