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
      onMouseDown={(e) => e.preventDefault()} // Keep focus off the key, so a later Enter doesn't re-press it
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      userSelect="none" // Stop the letter from being highlighted on double-click or long-press
      touchAction="manipulation" // Disable double-tap zoom and the tap delay on mobile
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
      size="xs" // only matters on sm breakpoint
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
