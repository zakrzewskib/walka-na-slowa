import { Button, Dialog, HStack, Portal, Stack, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { CURRENT_USER_ID, ENEMY_USER_ID } from '../../constants';
import { useAppStore } from '../../store/store';
import type { GameMode } from '../../types';
import { gameResultToText } from '../../utils';
import { ErrorAlert } from '../alerts/ErrorAlert';

export const CreateGameDialog = () => {
  const gameStatus = useAppStore((state) => state.gameStatus);
  const gameResult = useAppStore((state) => state.gameResult);
  const createGame = useAppStore((state) => state.createGame);
  const correctWord = useAppStore((state) => state.correctWord);

  const [pendingMode, setPendingMode] = useState<GameMode | null>(null);
  const [error, setError] = useState('');

  const isOpen = gameStatus == 'waiting_for_opponent' || !gameStatus || gameStatus === 'finished';

  async function handleCreateGame(gameMode: GameMode) {
    setPendingMode(gameMode);

    setError('');

    try {
      // On success the store sets gameId, which closes the dialog
      await createGame(gameMode);
    } catch {
      setPendingMode(null);
      setError('Nie udało się stworzyć gry. Proszę spróbować ponownie lub odświeżyć stronę.');
    }
  }
  // todo: Add button to handle login

  function handleOnExitComplete() {
    setPendingMode(null);
  }

  return (
    <Dialog.Root
      open={isOpen}
      // Reset only after the close animation, so the button doesn't flash back
      onExitComplete={handleOnExitComplete}
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
          <Dialog.Content
            data-testid="create-game-dialog"
            aria-label="Dialog pozwalający stworzyć grę"
          >
            <Dialog.Header>
              <Dialog.Title>
                {/* todo: Add Szukanie przeciwnika text */}
                {gameResultToText(gameResult, CURRENT_USER_ID, ENEMY_USER_ID)}
              </Dialog.Title>
            </Dialog.Header>

            {error && (
              <Dialog.Body>
                <ErrorAlert text={error} />
              </Dialog.Body>
            )}

            {/* todo: Do not display this when there is no game */}
            {gameStatus === 'finished' && (
              <Dialog.Body display="flex" flexDir="column" alignItems="center">
                <Text mb="1">Poprawne słowo to:</Text>
                <HStack
                  gap="1"
                  onCopy={(e) => {
                    // Overwrite copy functionality to get for LALKA instead L A L K A
                    e.preventDefault();
                    e.clipboardData.setData('text/plain', correctWord);
                  }}
                >
                  {correctWord.split('').map((letter, idx) => (
                    <HStack
                      key={idx}
                      fontSize="24px"
                      fontWeight="bolder"
                      backgroundColor="green.500"
                      color="white"
                      height="48px"
                      width="48px"
                      alignItems="center"
                      justifyContent="center"
                      rounded="sm"
                    >
                      {letter}
                    </HStack>
                  ))}
                </HStack>
              </Dialog.Body>
            )}

            <Dialog.Footer justifyContent="center">
              <VStack>
                <Stack direction={{ smDown: 'column', base: 'row' }} display="flex" gap="1">
                  <Button
                    onClick={() => handleCreateGame('solo')}
                    data-testid="create-game-dialog-btn-solo"
                    colorPalette="blackAlpha" // better for accessibility
                    loading={pendingMode === 'solo'}
                    disabled={pendingMode !== null}
                    loadingText="Tworzenie..."
                  >
                    {gameResult ? 'Zagraj ponownie' : 'Zagraj samemu'}
                  </Button>

                  <Button
                    onClick={() => handleCreateGame('versus')}
                    data-testid="create-game-dialog-btn-versus"
                    colorPalette="blackAlpha" // better for accessibility
                    loading={pendingMode === 'versus'}
                    disabled={true} // todo: Implement versus mode
                    loadingText="Tworzenie..."
                  >
                    Znajdź przeciwnika (wkrótce 👨🏼‍💻)
                  </Button>
                </Stack>
                {/* <HStack filter="grayscale(100%)">
                  <Image
                    src={facebookLogo}
                    height="6"
                    width="6"
                    cursor="pointer"
                    alt="Zaloguj się przez facebooka"
                  />
                  <Image
                    src={googleLogo}
                    height="8"
                    width="8"
                    cursor="pointer"
                    alt="Zaloguj się przez Google"
                  />
                </HStack> */}
              </VStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
