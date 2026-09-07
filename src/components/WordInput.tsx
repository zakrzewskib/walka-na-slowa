import { Input } from '@chakra-ui/react';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MOCK_CORRECT_WORD, WORD_LENGTH } from '../constants';
import { useAppStore } from '../store/store';
import { getWordResult } from '../utils/gameLogic';

export const WordInput = () => {
  const [value, setValue] = useState('');
  const addGuess = useAppStore((state) => state.addGuess);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (value.length !== WORD_LENGTH) {
      // tbd: Add info about wrong format, for example some kind of error animation would be enough
      return;
    }

    // tbd: Check if word exists in polish language

    // tbd: Think if it's a backend side logic
    const wordResult = getWordResult(value, MOCK_CORRECT_WORD);
    addGuess({
      id: uuidv4(),
      userId: uuidv4(),
      word: wordResult,
      createdAt: new Date(),
    });
    // tbd: Add animation
    setValue('');
  }

  // tbd: Hide the input and auto focus
  return (
    <form onSubmit={handleSubmit}>
      <Input
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
      />
    </form>
  );
};
