import { Button } from '@chakra-ui/react';
import type { KeyboardKey, KeyboardLetterStatus } from '../../types';
import { getKeyboardLetterAriaLabel } from '../../utils/accessibility';
import {
  calculateBackgroundAndBorderColor,
  calculateColor,
  calculateFontSize,
  calculateFontSizeMdDown,
  calculateValue,
  calculateWidth,
} from './KeyboardKey.utils';

interface KeyboardKeyItemProps {
  value: KeyboardKey;
  status: KeyboardLetterStatus;
  row: number;
  disabled?: boolean;
  onPress: (key: KeyboardKey) => void;
}

export const KeyboardKeyItem = ({
  value,
  status,
  row,
  disabled,
  onPress,
}: KeyboardKeyItemProps) => {
  return (
    <Button
      type="button"
      data-testid={`key-${value}`}
      aria-label={getKeyboardLetterAriaLabel(value, status)}
      disabled={disabled}
      // todo: Add animation when typing specific key
      onClick={() => onPress(value)}
      // Keep focus where it is, so a later Enter doesn't re-press this key
      onMouseDown={(e) => e.preventDefault()}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      userSelect="none"
      touchAction="manipulation"
      _disabled={{ cursor: 'not-allowed', opacity: 0.6 }}
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
    </Button>
  );
};
