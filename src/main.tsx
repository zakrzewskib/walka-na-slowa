import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Provider } from './components/ui/provider.tsx';

// todo: Delete
console.log('Vite running in mode: ', import.meta.env.MODE);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider forcedTheme="light">
      <App />
    </Provider>
  </StrictMode>,
);
