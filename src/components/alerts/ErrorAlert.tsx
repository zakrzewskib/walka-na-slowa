import { Alert } from '@chakra-ui/react';

interface ErrorAlertProps {
  text: string;
}

const ErrorAlert = ({ text }: ErrorAlertProps) => {
  return (
    <Alert.Root
      status="error"
      aria-label={`Error: ${text}`}
      role="alert"
      data-testid={`alert-${text}`}
    >
      <Alert.Indicator />
      <Alert.Title>{text}</Alert.Title>
    </Alert.Root>
  );
};

export default ErrorAlert;
