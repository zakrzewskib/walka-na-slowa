import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WORD_LENGTH } from '../../constants';
import { useAppStore } from '../../store/store';
import type { KeyboardKey } from '../../types';
import { isPolishLetter } from '../Keyboard/Keyboard.utils';
import { toaster } from '../ui/toaster';

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  );
}

export function useGuessInput() {
  const gameId = useAppStore((state) => state.gameId);
  const typeLetter = useAppStore((state) => state.typeLetter);
  const deleteLetter = useAppStore((state) => state.deleteLetter);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled = isSubmitting || !gameId; // todo: think about moving it to store

  const submit = useCallback(async () => {
    // read the latest values from the store, so this callback never goes stale
    const { currentGuess, submitGuess } = useAppStore.getState();

    if (currentGuess.length !== WORD_LENGTH) {
      // todo: error animation (word too short)
      return;
    }

    setIsSubmitting(true);

    try {
      await submitGuess({
        id: uuidv4(),
        value: currentGuess,
        userId: 'user1', // todo: get from the current session
      });
    } catch {
      // the store already restored the word, so we only need to tell the user
      toaster.create({
        title: 'Błąd',
        description: 'Nie udało się zgadnąć. Proszę spróbować później',
        type: 'error',
        closable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleKey = useCallback(
    (key: KeyboardKey) => {
      if (isDisabled) return;

      if (key === 'Enter') {
        void submit(); // Ignore promise
      } else if (key === 'Backspace') {
        deleteLetter();
      } else {
        typeLetter(key);
      }
    },
    [isDisabled, submit, typeLetter, deleteLetter],
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Add polish letters: ą ę etc.
      if (e.metaKey || (e.ctrlKey && !e.getModifierState('AltGraph'))) {
        return;
      }
      if (isEditableTarget(e.target)) {
        return;
      }

      if (e.key === 'Enter' || e.key === 'Backspace') {
        e.preventDefault();

        if (!e.repeat || e.key === 'Backspace') {
          handleKey(e.key);
        }
        return;
      }

      const letter = e.key.toLocaleUpperCase('pl-PL');

      if (isPolishLetter(letter)) {
        handleKey(letter);
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  return { isDisabled, handleKey };
}
