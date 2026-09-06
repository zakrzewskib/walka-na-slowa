import { VStack } from '@chakra-ui/react';
import type { ILetter } from '../../types';
import { getLetterAriaLabel } from '../../utils/accessibility';
import {
  calculateBackgroundColor,
  calculateBorderColor,
  calculateDisplayValue,
} from './Letter.utils';

interface LetterProps {
  letter: ILetter;
  isCurrentTurn: boolean;
  isPlayer: boolean;
}
function Letter(props: LetterProps) {
  const { letter } = props;
  const { value } = letter;
  const { isCurrentTurn, isPlayer } = props;

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
      background={calculateBackgroundColor(letter)}
      borderColor={calculateBorderColor(isCurrentTurn, isPlayer)}
      borderWidth={value ? '0px' : '2px'}
      color="white"
      mdDown={{
        flex: '1',
        width: 'full',
        flexShrink: 1,
        fontSize: '22px',
      }}
    >
      {calculateDisplayValue(value)}
    </VStack>
  );
}

export default Letter;
