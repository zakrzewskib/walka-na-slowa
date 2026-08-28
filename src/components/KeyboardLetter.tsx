import { VStack } from '@chakra-ui/react';
import type { LetterStatus, PolishLetter } from '../types';

interface KeyboardLetterProps {
  value: PolishLetter;
  status: LetterStatus;
}
function KeyboardLetter(props: KeyboardLetterProps) {
  const { value, status } = props;

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

  return (
    <VStack
      role="gridcell"
      // todo: add aria-label
      // aria-label={getLetterAriaLabel(letter, isCurrentTurn, isPlayer)}
      justifyContent="center"
      rounded="sm"
      width="60px"
      height="52px"
      fontSize="18px"
      fontWeight="bolder"
      background={calculateBackgroundAndBorderColor()}
      borderColor={calculateBackgroundAndBorderColor()}
      borderWidth="2px"
      color={calculateColor()}
      mdDown={{
        flex: '1',
        width: 'full',
        flexShrink: 1,
        fontSize: '16px',
      }}
    >
      {value.toUpperCase()}
    </VStack>
  );
}

export default KeyboardLetter;
