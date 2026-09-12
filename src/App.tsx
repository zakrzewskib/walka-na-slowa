import { HStack, VStack } from '@chakra-ui/react';
import { CreateGameDialog } from './components/dialogs/CreateGameDialog';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard/Keyboard';
import { WordInput } from './components/WordInput';
import { MOCK_CORRECT_WORD } from './constants';
import Layout from './layout/Layout';
import { useAppStore } from './store/store';

function App() {
  const guesses = useAppStore((state) => state.guesses);

  return (
    <Layout>
      <CreateGameDialog />
      <VStack w="full" flex="1" justifyContent="space-between">
        <HStack gap="24px" justifyContent="center" w="full">
          <GameBoard guesses={guesses} isPlayer={true} playerName="Gracz 1" />
          <GameBoard guesses={[]} isPlayer={false} playerName="Gracz 2" />
        </HStack>

        <Keyboard />
        <WordInput correctWord={MOCK_CORRECT_WORD} />
      </VStack>
    </Layout>
  );
}

export default App;
