import { VStack } from '@chakra-ui/react';
import type { ILetter } from '../types';

interface LetterProps extends ILetter {
  isCurrentTurn?: boolean;
  isOpponent?: boolean;
}
function Letter(props: LetterProps) {
  const { value, exists, correctPlace, isCurrentTurn, isOpponent } = props;
  const isHiddenLetter = value === '-';
  const calculatedValue = isHiddenLetter ? '' : value;

  function calculateBackgroundColor() {
    if (exists && correctPlace) {
      return 'green.500';
    }
    if (exists && !correctPlace) {
      return 'yellow.500';
    }

    if (value || isHiddenLetter) {
      return 'gray.400';
    }

    return 'gray.100';
  }

  function calculateBorderColor() {
    if (isCurrentTurn && !isOpponent) {
      return 'blue.500';
    }

    if (isCurrentTurn && isOpponent) {
      return 'red.500';
    }

    return 'gray.400';
  }

  return (
    <VStack
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
