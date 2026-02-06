import { VStack } from '@chakra-ui/react';

interface LetterProps {
  value: string;
}

function Letter(props: LetterProps) {
  const { value } = props;

  return (
    <VStack
      justifyContent="center"
      rounded="sm"
      width="60px"
      height="60px"
      fontSize="24px"
      fontWeight="bolder"
      background="gray.400"
      color="white"
      mdDown={{
        flex: '1',
        width: 'full',
        flexShrink: 1,
        fontSize: '22px',
      }}
    >
      {value}
    </VStack>
  );
}

export default Letter;
