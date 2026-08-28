import { VStack } from '@chakra-ui/react';
import type { KeyboardKey, LetterStatus } from '../types';

interface KeyboardLetterProps {
  value: KeyboardKey;
  status: LetterStatus;
  row: number;
}
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
    if (row === 0) {
      return '60px';
    }

    // 10 * 60px / 9 = 66.67px
    if (row === 1 || row === 3) {
      return '67px';
    }

    // 2 * x + 7 * y = 10 * 60 px= 600px => x = 85px => y = 61.4px
    if (row === 2) {
      if (value === 'Backspace') {
        return '85px';
      }
      if (value === 'Enter') {
        return '85px';
      }
      return '62px';
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
      // todo: add aria-label
      // aria-label={getLetterAriaLabel(letter, isCurrentTurn, isPlayer)}
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
