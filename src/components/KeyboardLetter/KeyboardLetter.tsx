import { VStack } from '@chakra-ui/react';
import type { KeyboardKey, LetterStatus } from '../../types';
import { getKeyboardLetterAriaLabel } from '../../utils/accessibility';
import {
  calculateBackgroundAndBorderColor,
  calculateColor,
  calculateFontSize,
  calculateFontSizeMdDown,
  calculateValue,
  calculateWidth,
} from './KeyboardLetter.utils';

interface KeyboardLetterProps {
  value: KeyboardKey;
  status: LetterStatus;
  row: number;
}

function KeyboardLetter(props: KeyboardLetterProps) {
  const { value, status, row } = props;

  return (
    <VStack
      role="gridcell"
      aria-label={getKeyboardLetterAriaLabel(value, status)}
      justifyContent="center"
      rounded="sm"
      width={calculateWidth(row, value)}
      height="52px"
      fontSize={calculateFontSize(value)}
      fontWeight="bolder"
      background={calculateBackgroundAndBorderColor(status)}
      borderColor={calculateBackgroundAndBorderColor(status)}
      borderWidth="2px"
      color={calculateColor(status)}
      mdDown={{
        flex: '1',
        width: 'full',
        flexShrink: 1,
        fontSize: calculateFontSizeMdDown(value),
      }}
    >
      {calculateValue(value)}
    </VStack>
  );
}

export default KeyboardLetter;
