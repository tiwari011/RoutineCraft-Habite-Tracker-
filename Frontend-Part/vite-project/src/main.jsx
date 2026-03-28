import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "126244397787-81u5c64scidst4knvbhm2sajg20aomj5.apps.googleusercontent.com";

// #region agent log
fetch("http://127.0.0.1:7561/ingest/a683136e-24a1-46cf-94e9-cb4f073f632c", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Debug-Session-Id": "3fef36",
  },
  body: JSON.stringify({
    sessionId: "3fef36",
    runId: "initial",
    hypothesisId: "H2",
    location: "main.jsx:bootstrap",
    message: "Frontend bootstrapped with Google OAuth provider",
    data: {
      origin: window.location.origin,
      googleClientId,
      apiBase: import.meta.env.VITE_API_URL || "http://localhost:8080",
    },
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion

createRoot(document.getElementById('root')).render(
  <StrictMode>

   <GoogleOAuthProvider clientId={googleClientId}>
        <App />
        </GoogleOAuthProvider>
  </StrictMode>,
)
