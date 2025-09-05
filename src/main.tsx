import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';

import './index.css';

// Force light mode by removing dark class and ensuring light theme
document.documentElement.classList.remove('dark');
document.documentElement.classList.add('light');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
