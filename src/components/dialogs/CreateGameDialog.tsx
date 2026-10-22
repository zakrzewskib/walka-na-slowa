import { Button, Dialog, Portal } from '@chakra-ui/react';
import { useState } from 'react';
import { useAppStore } from '../../store/store';
import { ErrorAlert } from '../alerts/ErrorAlert';

export const CreateGameDialog = () => {
  const gameId = useAppStore((state) => state.gameId);
  const createGame = useAppStore((state) => state.createGame);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreateGame() {
    setLoading(true);
    setError('');

    try {
      // On success the store sets gameId, which closes the dialog
      await createGame();
    } catch {
      setLoading(false);
      setError('Nie udało się stworzyć gry. Proszę spróbować ponownie lub odświeżyć stronę.');
    }
  }
  // todo: Add button to handle login

  return (
    <Dialog.Root
      open={!gameId}
      // Reset only after the close animation, so the button doesn't flash back
      onExitComplete={() => setLoading(false)}
      closeOnEscape={false}
      closeOnInteractOutside={false}
      placement="center"
      lazyMount
      unmountOnExit
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            data-testid="create-game-dialog"
            aria-label="Dialog pozwalający stworzyć grę"
          >
            <Dialog.Header>
              <Dialog.Title>Walka na słowa</Dialog.Title>
            </Dialog.Header>

            {error && (
              <Dialog.Body>
                <ErrorAlert text={error} />
              </Dialog.Body>
            )}

            <Dialog.Footer>
              <Button
                onClick={handleCreateGame}
                data-testid="create-game-dialog-btn"
                colorPalette="blackAlpha" // better for accessibility
                loading={loading}
                loadingText="Tworzenie..."
              >
                Stwórz grę bez logowania
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
