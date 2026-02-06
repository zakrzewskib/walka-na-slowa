import { VStack } from '@chakra-ui/react';
import { HIDDEN_LETTER } from '../constants';
import type { ILetter } from '../types';
import { getLetterAriaLabel } from '../utils/accessibility';

interface LetterProps {
  letter: ILetter;
  isCurrentTurn: boolean;
  isPlayer: boolean;
}
function Letter(props: LetterProps) {
  const { letter } = props;
  const { value, exists, correctPlace } = letter;
  const { isCurrentTurn, isPlayer } = props;

  const isHiddenLetter = value === HIDDEN_LETTER;
  const calculatedValue = isHiddenLetter ? '' : value;

  function calculateBackgroundColor() {
    if (correctPlace) {
      return 'green.500';
    }
    if (exists) {
      return 'yellow.500';
    }

    if (value || isHiddenLetter) {
      return 'gray.400';
    }

    return 'gray.100';
  }

  function calculateBorderColor() {
    if (isCurrentTurn && isPlayer) {
      return 'blue.500';
    }

    if (isCurrentTurn) {
      return 'red.500';
    }

    return 'gray.400';
  }

  return (
    <VStack
      role="gridcell"
      aria-label={getLetterAriaLabel(letter, isCurrentTurn, isPlayer)}
      justifyContent="center"
      rounded="sm"
      width="60px"
      height="60px"
      fontSize="24px"
      fontWeight="bolder"
      background={calculateBackgroundColor()}
      borderColor={calculateBorderColor()}
      borderWidth={value ? '0px' : '2px'}
      color="white"
      mdDown={{
        flex: '1',
        width: 'full',
        flexShrink: 1,
        fontSize: '22px',
      }}
    >
      {calculatedValue}
    </VStack>
  );
}

export default Letter;
