import { Button, type ButtonProps } from '@chakra-ui/react';
import { useState } from 'react';
import { useAppStore } from '../store/store';
import { toaster } from './ui/toaster';

export const SurrenderButton = (props: ButtonProps) => {
  const finishGame = useAppStore((state) => state.finishGame);
  const gameId = useAppStore((state) => state.gameId);
  const [loading, setLoading] = useState(false);

  async function handleSurrender() {
    setLoading(true);

    try {
      // todo: Add confirmation
      await finishGame();
    } catch {
      toaster.create({
        title: 'Błąd',
        description: 'Nie udało się zakończyć gry. Proszę spróbować później.',
        type: 'error',
        closable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleSurrender}
      disabled={!gameId}
      loading={loading}
      loadingText="..."
      data-testid="surrender-button"
      {...props}
    >
      Poddaj się
    </Button>
  );
};
