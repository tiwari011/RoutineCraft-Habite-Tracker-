import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <StrictMode>

   <GoogleOAuthProvider clientId="126244397787-81u5c64scidst4knvbhm2sajg20aomj5.apps.googleusercontent.com">
        <App />
        </GoogleOAuthProvider>
  </StrictMode>,
)
