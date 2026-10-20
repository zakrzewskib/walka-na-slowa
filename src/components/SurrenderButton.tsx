import { Button, type ButtonProps } from '@chakra-ui/react';
import { useAppStore } from '../store/store';
import { toaster } from './ui/toaster';

const SurrenderButton = (props: ButtonProps) => {
  const finishGame = useAppStore((state) => state.finishGame);

  async function handleSurrender() {
    try {
      await finishGame();
    } catch {
      toaster.create({
        title: 'Błąd',
        description: 'Nie udało się zakończyć gry. Proszę spróbować później.',
        type: 'error',
        closable: true,
      });
    }
  }

  return (
    <Button onClick={handleSurrender} data-testid="surrender-button" {...props}>
      Poddaj się
    </Button>
  );
};

export default SurrenderButton;
