import { Input, type InputProps } from '@chakra-ui/react';
import { useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WORD_LENGTH } from '../constants';
import { useAppStore } from '../store/store';
import { toaster } from './ui/toaster';

export const WordInput = ({ ...props }: InputProps) => {
  const [value, setValue] = useState('');
  const submitGuess = useAppStore((state) => state.submitGuess);
  const gameId = useAppStore((state) => state.gameId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (value.length !== WORD_LENGTH) {
      // tbd: Add info about wrong format, for example some kind of error animation would be enough
      return;
    }

    // tbd: Check if word exists in polish language - separate backend endpoint?

    setIsSubmitting(true);

    const normalizedValue = value.trim().toUpperCase();

    try {
      await submitGuess({
        id: uuidv4(),
        value: normalizedValue,
        userId: 'user1', // todo: get that from the current session
      });
      // tbd: Add animation
      setValue('');
    } catch {
      toaster.create({
        title: 'Błąd',
        description:
          'Nie udało się dodać kolejnego zgadnięcia. Proszę odświezyć stronę lub spróbować ponownie później.',
        type: 'error',
        closable: true,
      });
    } finally {
      inputRef.current?.focus();
      setIsSubmitting(false);
    }
  }

  // todo: Hide the input and auto focus
  return (
    <form onSubmit={handleSubmit}>
      <Input
        {...props}
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        data-testid="word-input"
        aria-label={`Wpisac swoje słowo o długości ${WORD_LENGTH}`}
        placeholder="Wpisz swoje słowo..."
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck="false"
        maxLength={WORD_LENGTH}
        autoFocus
        textTransform="uppercase"
        disabled={isSubmitting || !gameId}
      />
    </form>
  );
};
