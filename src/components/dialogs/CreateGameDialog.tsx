import { Button, Dialog, Portal, Spinner } from '@chakra-ui/react';
import { useState } from 'react';

export const CreateGameDialog = () => {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleCreateGame() {
    setLoading(true);
    // create game

    // timeout - to be deleted
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    // setLoading(false); // <- only set loading to false on error to prevent flashing

    setOpen(false);
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
