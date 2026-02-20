import { Input } from '@chakra-ui/react';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { MOCK_CORRECT_WORD } from '../App';
import { getGuessResult } from '../utils/gameLogic';

function WordInput() {
  const [value, setValue] = useState('');

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    // tbd: Add validation if word is correct
    const guess = value.toUpperCase();
    const result = getGuessResult(guess, MOCK_CORRECT_WORD);
    console.log(result);
  }

  // tbd: Hide the input and auto focus
  return (
    <form onSubmit={handleSubmit}>
      <Input type="text" value={value} onChange={handleInputChange} />
    </form>
  );
}

export default WordInput;
