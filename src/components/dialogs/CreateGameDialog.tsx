import { Button, Dialog, HStack, Image, Portal, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useAppStore } from '../../store/store';
import type { GameMode } from '../../types';
import { ErrorAlert } from '../alerts/ErrorAlert';

export const CreateGameDialog = () => {
  const gameId = useAppStore((state) => state.gameId);
  const createGame = useAppStore((state) => state.createGame);
  const [soloLoading, setSoloLoading] = useState(false);
  const [versusLoading, setVersusLoading] = useState(false);

  const [soloDisabled, setSoloDisabled] = useState(false);
  const [, setVersusDisabled] = useState(false);

  const [error, setError] = useState('');

  async function handleCreateGame(mode: GameMode) {
    if (mode === 'solo') {
      setSoloLoading(true);
      setVersusDisabled(true);
    } else {
      setSoloDisabled(true);
      setVersusLoading(true);
    }

    setError('');

    try {
      // On success the store sets gameId, which closes the dialog
      await createGame(mode);
    } catch {
      if (mode === 'solo') {
        setSoloLoading(false);
      } else {
        setVersusLoading(false);
      }

      setError('Nie udało się stworzyć gry. Proszę spróbować ponownie lub odświeżyć stronę.');
    }
  }
  // todo: Add button to handle login

  function handleOnExitComplete() {
    setSoloLoading(false);
    setVersusLoading(false);
  }

  return (
    <Dialog.Root
      open={!gameId}
      // Reset only after the close animation, so the button doesn't flash back
      onExitComplete={handleOnExitComplete}
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
              <Dialog.Title>Rozpocznij grę</Dialog.Title>
            </Dialog.Header>

            {error && (
              <Dialog.Body>
                <ErrorAlert text={error} />
              </Dialog.Body>
            )}

            <Dialog.Footer justifyContent="center">
              <VStack>
                <HStack>
                  <Button
                    onClick={() => handleCreateGame('solo')}
                    data-testid="create-game-dialog-btn-solo"
                    colorPalette="blackAlpha" // better for accessibility
                    loading={soloLoading}
                    disabled={soloDisabled}
                    loadingText="Tworzenie..."
                  >
                    Zagraj samemu
                  </Button>

                  <Button
                    onClick={() => handleCreateGame('versus')}
                    data-testid="create-game-dialog-btn-versus"
                    colorPalette="blackAlpha" // better for accessibility
                    loading={versusLoading}
                    // disabled={true} // todo: Implement versus mode
                    loadingText="Tworzenie..."
                  >
                    Znajdź przeciwnika (wkrótce 👨🏼‍💻)
                  </Button>
                </HStack>
                <HStack filter="grayscale(100%)">
                  <Image
                    src="src/assets/Facebook_Logo_Primary.png"
                    height="6"
                    width="6"
                    cursor="pointer"
                    alt="Zaloguj się przez facebooka"
                  />
                  <Image
                    src="src/assets/Theme=Neutral, Show text=No, Shape=Square, Platform=Android+Web.png"
                    height="8"
                    width="8"
                    cursor="pointer"
                    alt="Zaloguj się przez Google"
                  />
                </HStack>
              </VStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
