import { Box, Button, Dialog, Portal, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useAppStore } from '../../store/store';
import { ErrorAlert } from '../alerts/ErrorAlert';

export const SurrenderDialog = ({ open, close }: { open: boolean; close: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const surrenderGame = useAppStore((state) => state.surrenderGame);

  async function handleSurrender() {
    setLoading(true);
    setError('');

    try {
      await surrenderGame();
      close();
    } catch {
      setError('Nie udało się zakończyć gry. Proszę spróbować ponownie lub odświeżyć stronę.');
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog.Root
      open={open}
      onExitComplete={() => {
        setLoading(false);
        setError('');
      }}
      closeOnEscape={false}
      closeOnInteractOutside={false}
      placement="center"
      lazyMount
      unmountOnExit
      size={{ smDown: 'xs', sm: 'md' }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content data-testid="surrender-dialog" aria-label="Dialog pozwalający poddać grę">
            <Dialog.Header>
              <Dialog.Title>Czy na pewno chcesz się poddać?</Dialog.Title>
            </Dialog.Header>

            {error && (
              <Dialog.Body>
                <ErrorAlert text={error} />
              </Dialog.Body>
            )}

            <Dialog.Footer justifyContent="center">
              <VStack>
                <Box display="flex" gap="1">
                  <Button
                    onClick={handleSurrender}
                    colorPalette="red"
                    loading={loading}
                    disabled={loading}
                    loadingText="Kończenie gry..."
                  >
                    Tak
                  </Button>

                  <Button
                    colorPalette="blackAlpha" // better for accessibility
                    disabled={loading}
                    onClick={close}
                  >
                    Nie
                  </Button>
                </Box>
              </VStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
