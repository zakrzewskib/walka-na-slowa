import { Box, HStack, VStack } from '@chakra-ui/react';
import { gameResultToText } from './App.utils';
import { CreateGameDialog } from './components/dialogs/CreateGameDialog';
import { GameBoard } from './components/GameBoard/GameBoard';
import { Keyboard } from './components/Keyboard/Keyboard';
import { SurrenderButton } from './components/SurrenderButton';
import { Toaster } from './components/ui/toaster';
import { Layout } from './layout/Layout';
import { useAppStore } from './store/store';

function App() {
  const gameMode = useAppStore((state) => state.gameMode);
  const gameResult = useAppStore((state) => state.gameResult);

  console.log(gameResult);

  return (
    <>
      <Toaster />
      <Layout>
        <CreateGameDialog />
        {/* todo: Add finished dialog (has create new game button that calls finish game in store */}

        <VStack w="full" flex="1" justifyContent="space-between">
          <HStack gap="24px" justifyContent="center" w="full">
            <GameBoard isPlayer={true} playerName={`Gracz 1 ${gameResultToText(gameResult)}`} />
            {gameMode === 'versus' && <GameBoard isPlayer={false} playerName="Gracz 2" />}
          </HStack>

          <Keyboard />

          <Box alignSelf="start">
            <SurrenderButton />
          </Box>
        </VStack>
      </Layout>
    </>
  );
}

export default App;
