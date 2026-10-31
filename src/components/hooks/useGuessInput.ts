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
  const submitGuess = useAppStore((state) => state.submitGuess);
  const gameId = useAppStore((state) => state.gameId);
  const [guess, setGuess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled = isSubmitting || !gameId;

  const submit = useCallback(async () => {
    if (guess.length !== WORD_LENGTH) {
      // todo: error animation (word too short)
      return;
    }

    // todo: check if the word exists in Polish - separate backend endpoint?

    setIsSubmitting(true);

    try {
      await submitGuess({
        id: uuidv4(),
        value: guess,
        userId: 'user1', // todo: get from the current session
      });
      setGuess('');
    } catch {
      toaster.create({
        title: 'Błąd',
        description: 'Nie udało się zgadnąć. Proszę spróbować później',
        type: 'error',
        closable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [guess, submitGuess]);

  const handleKey = useCallback(
    (key: KeyboardKey) => {
      if (isDisabled) return;

      if (key === 'Enter') {
        void submit();
      } else if (key === 'Backspace') {
        setGuess((g) => g.slice(0, -1));
      } else {
        setGuess((g) => (g.length < WORD_LENGTH ? g + key : g));
      }
    },
    [isDisabled, submit],
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Allow AltGr (reported as Ctrl+Alt on Windows) - needed for ą, ę, ł...
      if (e.metaKey || (e.ctrlKey && !e.getModifierState('AltGraph'))) return;

      // Prevent onkeydown of user is in editable element
      if (isEditableTarget(e.target)) return;

      if (e.key === 'Enter' || e.key === 'Backspace') {
        e.preventDefault(); // stops Enter from "clicking" a focused button
        if (!e.repeat || e.key === 'Backspace') handleKey(e.key);
        return;
      }

      const letter = e.key.toUpperCase();
      if (isPolishLetter(letter)) handleKey(letter);
    }

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  return { guess, isDisabled, handleKey };
}
