import { HStack, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { STARTING_LETTERS_USED } from '../constants';
import type { LettersUsed, PolishLetter } from '../types';
import KeyboardLetter from './KeyboardLetter';

// prettier-ignore
const firstRow: PolishLetter[] = ['q','w','e','r','t','y','u','i','o','p'];
// prettier-ignore
const secondRow: PolishLetter[] = ['a','s','d','f','g','h','j','k','l'];
// prettier-ignore
const thirdRow: PolishLetter[] = ['z','x','c','v','b','n','m'];
// prettier-ignore
const fourthRow: PolishLetter[] = ['ą','ć','ę','ł','ń','ó','ś','ź','ż'];

const Keyboard = () => {
  const [keyboardState] = useState<LettersUsed>(STARTING_LETTERS_USED);

  const rowsWithStatus = [firstRow, secondRow, thirdRow, fourthRow].map(
    (row) => {
      return row.map((key) => ({
        key,
        status: keyboardState[key].status,
      }));
    },
  );

  // todo: Add backspace and enter

  return (
    <VStack
      gap="4px"
      mdDown={{
        width: 'full',
        alignItems: 'stretch',
      }}
      role="grid"
    >
      {rowsWithStatus.map((row) => (
        <HStack gap="4px" role="row">
          {row.map(({ key, status }) => (
            <KeyboardLetter value={key} status={status} />
          ))}
        </HStack>
      ))}
    </VStack>
  );
};

export default Keyboard;
