import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import './i18n';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="77822381207-54l8s2pbgu7jkg4us01edr0tcolil6v0.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);