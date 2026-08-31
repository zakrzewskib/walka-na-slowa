import { Input } from '@chakra-ui/react';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { WORD_LENGTH } from '../constants';
import type { IWord } from '../types';
import { getGuessResult } from '../utils/gameLogic';

interface WordInputProps {
  onSubmit: (guessResult: IWord) => void;
  correctWord: string;
}

function WordInput(props: WordInputProps) {
  const [value, setValue] = useState('');

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

    const guess = value.toUpperCase();
    // tbd: Think if it's a backend side logic
    const result = getGuessResult(guess, props.correctWord);
    props.onSubmit(result);

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
}

export default WordInput;
