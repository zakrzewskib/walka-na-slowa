import { Grid, GridItem, HStack, VStack } from '@chakra-ui/react';
import { CreateGameDialog } from './components/dialogs/CreateGameDialog';
import { GameBoard } from './components/GameBoard';
import { Keyboard } from './components/Keyboard/Keyboard';
import { SurrenderButton } from './components/SurrenderButton';
import { Toaster } from './components/ui/toaster';
import { WordInput } from './components/WordInput';
import { Layout } from './layout/Layout';

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
          <Grid
            width="full"
            gridTemplateColumns={{
              base: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
            }}
            alignItems="center"
          >
            <GridItem justifySelf="start" minWidth="0">
              <SurrenderButton />
            </GridItem>

            <GridItem justifySelf="center" width="full" minWidth="0">
              <WordInput width="full" />
            </GridItem>

            <GridItem display={{ base: 'none', md: 'block' }} />
          </Grid>
        </VStack>
      </Layout>
    </>
  );
}

export default App;
