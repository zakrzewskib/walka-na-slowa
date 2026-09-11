import { HStack, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useAppStore } from '../../store/store';
import type { KeyboardKey, PolishLetter } from '../../types';
import { KeyboardKeyItem } from '../KeyboardKey/KeyboardKey';
import { calculateKeyboardState } from './Keyboard.utils';

const firstRow: PolishLetter[] = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const secondRow: PolishLetter[] = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
const thirdRow: KeyboardKey[] = ['Backspace', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Enter'];
const fourthRow: PolishLetter[] = ['Ą', 'Ć', 'Ę', 'Ł', 'Ń', 'Ó', 'Ś', 'Ź', 'Ż'];

export const Keyboard = () => {
  const guesses = useAppStore((state) => state.guesses);
  const keyboardState = useMemo(() => calculateKeyboardState(guesses), [guesses]);

  const rowsWithStatus = [firstRow, secondRow, thirdRow, fourthRow].map((row) => {
    return row.map((key) => {
      return {
        key,
        status: key === 'Backspace' || key === 'Enter' ? 'unused' : keyboardState[key].status,
      };
    });
  });

  return (
    <VStack
      gap="4px"
      mdDown={{
        width: 'full',
        alignItems: 'stretch',
      }}
      role="grid"
      data-testid="keyboard"
    >
      {rowsWithStatus.map((row, i) => (
        <HStack key={i} gap="4px" role="row">
          {row.map(({ key, status }) => (
            <KeyboardKeyItem key={key} value={key} status={status} row={i} />
          ))}
        </HStack>
      ))}
    </VStack>
  );
};
