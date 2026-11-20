import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useAppStore } from '../store/store';
import { SurrenderDialog } from './dialogs/SurrenderDialog';

export const SurrenderButton = () => {
  const gameStatus = useAppStore((state) => state.gameStatus);
  const gameId = useAppStore((state) => state.gameId);
  const [open, setOpen] = useState(false);

  return (
    <>
      <SurrenderDialog open={open} close={() => setOpen(false)} />
      <Button
        onClick={() => setOpen(true)}
        disabled={gameStatus === 'finished' || !gameId}
        data-testid="surrender-button"
      >
        Poddaj się
      </Button>
    </>
  );
};
