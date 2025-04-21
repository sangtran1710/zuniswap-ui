import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { WalletProvider } from './contexts/WalletContext.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'

// Import i18n configuration
import './lib/i18n'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <WalletProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </WalletProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
