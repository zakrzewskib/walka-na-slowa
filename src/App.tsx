import { HStack, VStack } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard/Keyboard';
import { WordInput } from './components/WordInput';
import { HIDDEN_LETTER, MOCK_CORRECT_WORD } from './constants';
import Layout from './layout/Layout';
import { useAppStore } from './store/store';
import type { Guess } from './types';

const MOCK_OPPONENT_WORDS: Guess[] = [
  {
    userId: uuidv4(),
    createdAt: new Date(),
    id: uuidv4(),
    word: {
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
  },
];

function App() {
  const guesses = useAppStore((state) => state.guesses);

  return (
    <Layout>
      <VStack w="full" flex="1" justifyContent="space-between">
        <HStack gap="24px" justifyContent="center" w="full">
          <GameBoard guesses={guesses} isPlayer={true} playerName="Gracz 1" />
          <GameBoard guesses={MOCK_OPPONENT_WORDS} isPlayer={false} playerName="Gracz 2" />
        </HStack>

        <Keyboard />
        <WordInput correctWord={MOCK_CORRECT_WORD} />
      </VStack>
    </Layout>
  );
}

export default App;
