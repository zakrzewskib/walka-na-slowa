import { Text } from '@chakra-ui/react';

interface CorrectWordProps {
  correctWord: string;
}

export const CorrectWord = ({ correctWord }: CorrectWordProps) => {
  return (
    <Text fontSize="24px" fontWeight="bolder" letterSpacing="wider" mt="1">
      {correctWord}
    </Text>
  );
};

export default CorrectWord;
