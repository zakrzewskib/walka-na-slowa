import { VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { Page } from '../components/Page';
import { Header } from './Header';

interface ILayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: ILayoutProps) => {
  return (
    <VStack minH="100dvh" align="stretch">
      <Header />
      <Page>{children}</Page>
    </VStack>
  );
};
