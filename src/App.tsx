import { HStack } from '@chakra-ui/react';
import Page from './components/Page';
import PlayerBoard from './components/PlayerBoard';

function App() {
  return (
    <Page>
      <HStack gap="24px" justifyContent="center">
        <PlayerBoard />
        <PlayerBoard />
      </HStack>
    </Page>
  );
}

export default App;
