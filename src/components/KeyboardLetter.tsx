import { VStack } from '@chakra-ui/react';
import type { KeyboardKey, LetterStatus } from '../types';
import { getKeyboardLetterAriaLabel } from '../utils/accessibility';

type KeyboardRow = 0 | 1 | 2 | 3;

interface KeyboardLetterProps {
  value: KeyboardKey;
  status: LetterStatus;
  row: KeyboardRow;
}

// Row 2 (bottom row): Enter/Backspace are wider special keys, letters share the remaining space
// 2 * SPECIAL_KEY_WIDTH + 7 * LETTER_KEY_WIDTH = 10 * FIRST_ROW_KEY_WIDTH (600px)
const FIRST_ROW_KEY_WIDTH = '60px';
const SECOND_AND_FOURTH_ROW_KEY_WIDTH = '67px'; // 10 * 60px / 9 rounded
const THIRD_ROW_SPECIAL_KEY_WIDTH = '85px'; // Enter / Backspace
const THIRD_ROW_LETTER_WIDTH = '62px'; // remaining letter keys

function KeyboardLetter(props: KeyboardLetterProps) {
  const { value, status, row } = props;

  function calculateBackgroundAndBorderColor() {
    if (status === 'correct') {
      return 'green.500';
    }
    if (status === 'present') {
      return 'yellow.500';
    }
    if (status === 'absent') {
      return 'gray.400';
    }

    return 'gray.200';
  }

  function calculateColor() {
    return status === 'unused' ? 'black' : 'white';
  }

  function calculateValue() {
    if (value === 'Backspace') {
      return '⌫';
    }

    if (value === 'Enter') {
      return value;
    }

    return value.toLocaleUpperCase();
  }

  function calculateWidth() {
    switch (row) {
      case 0:
        return FIRST_ROW_KEY_WIDTH;
      case 1:
      case 3:
        return SECOND_AND_FOURTH_ROW_KEY_WIDTH;
      case 2:
        return value === 'Backspace' || value === 'Enter'
          ? THIRD_ROW_SPECIAL_KEY_WIDTH
          : THIRD_ROW_LETTER_WIDTH;
      default: {
        const exhaustiveCheck: never = row;
        throw new Error(`Unexpected keyboard row: ${exhaustiveCheck}`);
      }
    }
  }

  function calculateFontSize() {
    if (value === 'Backspace') {
      return '24px';
    }
    return '18px';
  }

  function calculateFontSizeMdDown() {
    if (value === 'Backspace') {
      return '20px';
    }
    return '16px';
  }

  return (
    <VStack
      role="gridcell"
      aria-label={getKeyboardLetterAriaLabel(value, status)}
      justifyContent="center"
      rounded="sm"
      width={calculateWidth()}
      height="52px"
      fontSize={calculateFontSize()}
      fontWeight="bolder"
      background={calculateBackgroundAndBorderColor()}
      borderColor={calculateBackgroundAndBorderColor()}
      borderWidth="2px"
      color={calculateColor()}
      mdDown={{
        flex: '1',
        width: 'full',
        flexShrink: 1,
        fontSize: calculateFontSizeMdDown(),
      }}
    >
      {calculateValue()}
    </VStack>
  );
}

export default KeyboardLetter;
