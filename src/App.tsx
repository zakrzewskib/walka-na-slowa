import { HStack } from '@chakra-ui/react';
import OpponentBoard from './components/OpponentBoard';
import Page from './components/Page';
import PlayerBoard from './components/PlayerBoard';

function App() {
  return (
    <Page>
      <HStack gap="24px" justifyContent="center">
        <PlayerBoard />
        <OpponentBoard />
      </HStack>
    </Page>
  );
}

export default App;
