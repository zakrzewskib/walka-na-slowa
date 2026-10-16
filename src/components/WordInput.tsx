import { Input } from '@chakra-ui/react';
import { useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WORD_LENGTH } from '../constants';
import { useAppStore } from '../store/store';

export const WordInput = () => {
  const [value, setValue] = useState('');
  const submitGuess = useAppStore((state) => state.submitGuess);
  const gameId = useAppStore((state) => state.gameId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // const [error, setError] = useState('');

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (value.length !== WORD_LENGTH) {
      // tbd: Add info about wrong format, for example some kind of error animation would be enough
      return;
    }

    // tbd: Check if word exists in polish language

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
      // todo: Add toast
      console.error(
        'Nie udało się dodać kolejnego zgadnięcia. Proszę odświezyć stronę lub spróbować ponownie później.',
      );
    } finally {
      inputRef.current?.focus();
      setIsSubmitting(false);
    }
  }

  // todo: Hide the input and auto focus
  return (
    <form onSubmit={handleSubmit}>
      <Input
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
