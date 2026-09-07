import { HStack, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { STARTING_LETTERS_USED } from '../constants';
import type { KeyboardKey, LetterStatusMap, PolishLetter } from '../types';
import KeyboardLetter from './KeyboardLetter/KeyboardLetter';

const firstRow: PolishLetter[] = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const secondRow: PolishLetter[] = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const thirdRow: KeyboardKey[] = ['Backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Enter'];
const fourthRow: PolishLetter[] = ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'];

const Keyboard = () => {
  const [keyboardState] = useState<LetterStatusMap>(STARTING_LETTERS_USED);

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
            <KeyboardLetter key={key} value={key} status={status} row={i} />
          ))}
        </HStack>
      ))}
    </VStack>
  );
};

export default Keyboard;
