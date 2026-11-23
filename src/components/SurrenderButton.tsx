import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useAppStore } from '../store/store';
import { SurrenderDialog } from './dialogs/SurrenderDialog';

export const SurrenderButton = () => {
  const gameStatus = useAppStore((state) => state.gameStatus);
  const gameMode = useAppStore((state) => state.gameMode);
  const gameId = useAppStore((state) => state.gameId);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SurrenderDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <Button
        onClick={() => setIsOpen(true)}
        disabled={gameStatus === 'finished' || !gameId}
        data-testid="surrender-button"
      >
        {gameMode === 'solo' ? 'Zakończ grę' : 'Poddaj się'}
      </Button>
    </>
  );
};
