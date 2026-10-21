import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import './i18n';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="593707094639-k22gun79a2nrr7htnd8bhkvac8apcb5f.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);