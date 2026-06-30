import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './mockApi.js' // Backend simulado en el navegador (modo demo). Quitar para usar un backend real.
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
