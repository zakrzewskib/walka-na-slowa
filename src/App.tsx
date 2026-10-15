import { HStack, VStack } from '@chakra-ui/react';
import { CreateGameDialog } from './components/dialogs/CreateGameDialog';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard/Keyboard';
import { WordInput } from './components/WordInput';
import Layout from './layout/Layout';

function App() {
  return (
    <Layout>
      <CreateGameDialog />
      <VStack w="full" flex="1" justifyContent="space-between">
        <HStack gap="24px" justifyContent="center" w="full">
          <GameBoard isPlayer={true} playerName="Gracz 1" />
          <GameBoard isPlayer={false} playerName="Gracz 2" />
        </HStack>

        <Keyboard />
        <WordInput />
      </VStack>
    </Layout>
  );
}

export default App;
