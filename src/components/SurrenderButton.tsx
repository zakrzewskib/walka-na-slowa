import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useAppStore } from '../store/store';
import { SurrenderDialog } from './dialogs/SurrenderDialog';

export const SurrenderButton = () => {
  const gameId = useAppStore((state) => state.gameId);
  const [open, setOpen] = useState(false);

  function handleSurrender() {
    setOpen(true);
  }

  return (
    <>
      <SurrenderDialog open={open} close={() => setOpen(false)} />
      <Button onClick={handleSurrender} disabled={!gameId} data-testid="surrender-button">
        Poddaj się
      </Button>
    </>
  );
};
