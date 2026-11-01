import { HStack, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useAppStore } from '../../store/store';
import type { KeyboardKey } from '../../types';
import { useGuessInput } from '../hooks/useGuessInput';
import { KeyboardKeyItem } from '../KeyboardKey/KeyboardKey';
import { KEYBOARD_ROWS } from './Keyboard.constants';
import { calculateKeyboardState, isPolishLetter } from './Keyboard.utils';

// todo: add auth and storing user and separate guesses
export const Keyboard = () => {
  const guesses = useAppStore((state) => state.guesses);
  const keyboardState = useMemo(() => calculateKeyboardState(guesses), [guesses]);
  const { handleKey } = useGuessInput();

  const gameId = useAppStore((state) => state.gameId);
  const isSubmittingGuess = useAppStore((state) => state.isSubmittingGuess);

  const isDisabled = isSubmittingGuess || !gameId;

  const getStatus = (key: KeyboardKey) =>
    isPolishLetter(key) ? keyboardState[key].status : 'unused';

  function onKeyPress(key: KeyboardKey) {
    handleKey(key);
  }

  return (
    <VStack
      gap={{ base: '2px', sm: '4px' }}
      mdDown={{ width: 'full', alignItems: 'stretch' }}
      role="group"
      aria-label="Klawiatura"
      data-testid="keyboard"
    >
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <HStack key={rowIndex} gap="4px" mdDown={{ gap: '2px' }}>
          {row.map((key) => (
            <KeyboardKeyItem
              key={key}
              value={key}
              status={getStatus(key)}
              row={rowIndex}
              disabled={isDisabled}
              onPress={onKeyPress}
            />
          ))}
        </HStack>
      ))}
    </VStack>
  );
};
