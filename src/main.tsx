import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { PasswordRecovery } from './PasswordRecovery';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <App />
      <PasswordRecovery />
    </>
  </StrictMode>,
);
