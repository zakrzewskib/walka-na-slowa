import { HStack, VStack } from '@chakra-ui/react';
import { CreateGameDialog } from './components/dialogs/CreateGameDialog';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard/Keyboard';
import SurrenderButton from './components/SurrenderButton';
import { Toaster } from './components/ui/toaster';
import { WordInput } from './components/WordInput';
import Layout from './layout/Layout';

function App() {
  return (
    <>
      <Toaster />
      <Layout>
        <CreateGameDialog />
        <VStack w="full" flex="1" justifyContent="space-between">
          <HStack gap="24px" justifyContent="center" w="full">
            <GameBoard isPlayer={true} playerName="Gracz 1" />
            <GameBoard isPlayer={false} playerName="Gracz 2" />
          </HStack>

          <Keyboard />
          <HStack width="full" justifyContent="center" position="relative">
            <SurrenderButton position="absolute" left="0.5" translateX="-0.5" />
            <WordInput />
          </HStack>
        </VStack>
      </Layout>
    </>
  );
}

export default App;
