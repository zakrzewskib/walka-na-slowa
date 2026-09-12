import { Button, Dialog, Portal, Spinner } from '@chakra-ui/react';
import { useState } from 'react';
import { useAppStore } from '../../store/store';

export const CreateGameDialog = () => {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState('');
  const createGame = useAppStore((state) => state.createGame);

  async function handleCreateGame() {
    setLoading(true);

    try {
      await createGame();
      setOpen(false);
    } catch (error) {
      console.log(error);
      setLoading(false); // only set loading to false on error to prevent flashing
      setError('Nie udało się stworzyć gry. Proszę odświeżyć stronę.');
    }
  }

  // todo: Add button to handle login

  return (
    <Dialog.Root
      lazyMount
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      closeOnEscape={false}
      closeOnInteractOutside={false}
      placement="center"
      aria-label="Dialog pozwalający stworzyć grę"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Walka na słowa</Dialog.Title>
            </Dialog.Header>
            <Dialog.Footer>
              <Button onClick={handleCreateGame}>
                {loading ? <Spinner size="sm" /> : 'Stwórz grę bez logowania'}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
