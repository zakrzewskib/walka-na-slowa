import { HStack, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useAppStore } from '../../store/store';
import type { KeyboardKey } from '../../types';
import { KeyboardKeyItem } from '../KeyboardKey/KeyboardKey';
import { KEYBOARD_ROWS } from './Keyboard.constants';
import { calculateKeyboardState, isPolishLetter } from './Keyboard.utils';

interface KeyboardProps {
  onKeyPress: (key: KeyboardKey) => void;
  disabled?: boolean;
}

// todo: add auth and storing user and separate guesses
export const Keyboard = (props: KeyboardProps) => {
  const guesses = useAppStore((state) => state.guesses);
  const keyboardState = useMemo(() => calculateKeyboardState(guesses), [guesses]);

  const getStatus = (key: KeyboardKey) =>
    isPolishLetter(key) ? keyboardState[key].status : 'unused';

  function onKeyPress(key: KeyboardKey) {
    props.onKeyPress(key);
  }

  return (
    <VStack
      gap="4px"
      mdDown={{ width: 'full', alignItems: 'stretch' }}
      role="group"
      aria-label="Klawiatura"
      data-testid="keyboard"
    >
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <HStack key={rowIndex} gap="4px">
          {row.map((key) => (
            <KeyboardKeyItem
              key={key}
              value={key}
              status={getStatus(key)}
              row={rowIndex}
              disabled={props.disabled}
              onPress={onKeyPress}
            />
          ))}
        </HStack>
      ))}
    </VStack>
  );
};
