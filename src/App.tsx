import { GridItem, HStack, VStack } from '@chakra-ui/react';
import { CreateGameDialog } from './components/dialogs/CreateGameDialog';
import { GameBoard } from './components/GameBoard';
import { useGuessInput } from './components/hooks/useGuessInput';
import { Keyboard } from './components/Keyboard/Keyboard';
import { SurrenderButton } from './components/SurrenderButton';
import { Toaster } from './components/ui/toaster';
import { Layout } from './layout/Layout';

function App() {
  const { isDisabled: isKeyboardDisabled, handleKey } = useGuessInput();

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

          <Keyboard disabled={isKeyboardDisabled} onKeyPress={handleKey} />

          <GridItem alignSelf="start">
            <SurrenderButton />
          </GridItem>
        </VStack>
      </Layout>
    </>
  );
}

export default App;
