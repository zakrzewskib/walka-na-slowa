import { Button, CloseButton, Dialog, HStack, Portal } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useAppStore } from '../../store/store';
import { ErrorAlert } from '../alerts/ErrorAlert';

interface SurrenderDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SurrenderDialog = ({ isOpen, onClose }: SurrenderDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const surrenderGame = useAppStore((state) => state.surrenderGame);
  const ref = useRef<HTMLButtonElement | null>(null);
  const gameMode = useAppStore((state) => state.gameMode);

  async function handleSurrender() {
    setLoading(true);
    setError('');

    try {
      await surrenderGame();
      onClose();
    } catch {
      setError('Nie udało się zakończyć gry. Proszę spróbować ponownie lub odświeżyć stronę.');
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog.Root
      open={isOpen}
      onExitComplete={() => {
        setError('');
      }}
      closeOnEscape={!loading}
      onOpenChange={(e) => !e.open && !loading && close()}
      closeOnInteractOutside={false}
      placement="center"
      lazyMount
      unmountOnExit
      role="alertdialog"
      size={{ smDown: 'xs', sm: 'md' }}
      initialFocusEl={() => ref.current}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content data-testid="surrender-dialog" aria-label="Dialog pozwalający poddać grę">
            <Dialog.Header>
              <Dialog.Title>
                Czy na pewno chcesz {gameMode === 'solo' ? 'zakończyć grę?' : 'się poddać?'}
              </Dialog.Title>
            </Dialog.Header>

            {error && (
              <Dialog.Body>
                <ErrorAlert text={error} />
              </Dialog.Body>
            )}

            <Dialog.Footer justifyContent="center">
              <HStack gap="1">
                <Button
                  onClick={handleSurrender}
                  colorPalette="red"
                  loading={loading}
                  loadingText="Kończenie gry..."
                >
                  Tak
                </Button>

                <Button
                  colorPalette="blackAlpha" // better for accessibility
                  disabled={loading}
                  onClick={onClose}
                  ref={ref}
                >
                  Nie
                </Button>
              </HStack>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={onClose} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
