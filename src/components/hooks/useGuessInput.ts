import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CURRENT_USER_ID, WORD_LENGTH } from '../../constants';
import { useAppStore } from '../../store/store';
import type { KeyboardKey } from '../../types';
import { isPolishLetter } from '../Keyboard/Keyboard.utils';
import { toaster } from '../ui/toaster';

const EDITABLE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

function isEditableTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement && (target.isContentEditable || EDITABLE_TAGS.has(target.tagName))
  );
}

// Controls that Enter activates natively - we must leave Enter to them
function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('button, a[href], [role="button"]') !== null;
}

// While a dialog is open, the keyboard belongs to the dialog
function isInsideDialog(target: EventTarget | null): boolean {
  return (
    target instanceof Element && target.closest('[role="dialog"], [role="alertdialog"]') !== null
  );
}

// Ctrl/Cmd shortcuts (copy, paste, reload...) must not type. AltGr is reported by Windows as
// Ctrl+Alt, so it has to be let through - that is how Polish letters (ą, ę...) are typed.
function hasBlockingModifier(e: KeyboardEvent): boolean {
  return e.metaKey || (e.ctrlKey && !e.getModifierState('AltGraph'));
}

// Always read from the store, so nothing here can go stale
function isInputDisabled(): boolean {
  const { gameId, isSubmittingGuess } = useAppStore.getState();
  return isSubmittingGuess || !gameId;
}

async function submitCurrentGuess(): Promise<void> {
  const { currentGuess, submitGuess } = useAppStore.getState();

  if (currentGuess.length !== WORD_LENGTH) {
    // todo: error animation (word too short)
    return;
  }

  try {
    await submitGuess({
      id: uuidv4(),
      value: currentGuess,
      userId: CURRENT_USER_ID, // todo: get from the current session
    });
  } catch {
    // the store already restored the word, so we only need to tell the user
    toaster.create({
      title: 'Błąd',
      description: 'Nie udało się zgadnąć. Proszę spróbować później',
      type: 'error',
      closable: true,
    });
  }
}

// Shared by the on-screen keyboard and the physical keyboard
function handleKey(key: KeyboardKey): void {
  if (isInputDisabled()) return;

  const { typeLetter, deleteLetter } = useAppStore.getState();

  if (key === 'Enter') {
    void submitCurrentGuess(); // errors are handled inside
  } else if (key === 'Backspace') {
    deleteLetter();
  } else {
    typeLetter(key);
  }
}

function handleKeyDown(e: KeyboardEvent): void {
  // IME composition and events that something else already handled
  if (e.defaultPrevented || e.isComposing) return;

  if (hasBlockingModifier(e)) return;

  // Do not react when the user is typing in a field or working inside a dialog
  if (isEditableTarget(e.target) || isInsideDialog(e.target)) return;

  if (e.key === 'Enter') {
    // A focused button / link activates itself on Enter, so don't swallow it
    if (isInteractiveTarget(e.target) || isInputDisabled()) return;

    e.preventDefault();

    // Holding Enter would send the same word again and again, so only the first press submits
    if (!e.repeat) {
      handleKey('Enter');
    }
    return;
  }

  if (e.key === 'Backspace') {
    if (isInputDisabled()) return;

    e.preventDefault();
    handleKey('Backspace'); // holding Backspace is expected to keep deleting
    return;
  }

  const letter = e.key.toUpperCase();

  if (isPolishLetter(letter)) {
    handleKey(letter);
  }
}

// Registers the physical keyboard listener, so mount it only once in the app
export function useGuessInput() {
  // one boolean selector: the component re-renders only when the value flips
  const isDisabled = useAppStore((state) => state.isSubmittingGuess || !state.gameId);

  // handleKeyDown reads everything from the store, so the listener is attached only once
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isDisabled, handleKey };
}
