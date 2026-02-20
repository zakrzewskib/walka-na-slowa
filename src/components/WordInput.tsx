import { Input } from '@chakra-ui/react';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { MOCK_CORRECT_WORD } from '../App';
import { WORD_LENGTH } from '../constants';
import type { IWord } from '../types';
import { getGuessResult } from '../utils/gameLogic';

interface WordInputProps {
  onSubmit: (guessResult: IWord) => void;
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
    const result = getGuessResult(guess, MOCK_CORRECT_WORD);
    props.onSubmit(result);

    // tbd: Add animation
    setValue('');
  }

  // tbd: Hide the input and auto focus
  return (
    <form onSubmit={handleSubmit}>
      <Input type="text" value={value} onChange={handleInputChange} />
    </form>
  );
}

export default WordInput;
