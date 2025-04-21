import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './App.css'
import { useTranslation } from 'react-i18next'
import { ThemeProvider } from './contexts/ThemeContext'
import FloatingTokens from './components/FloatingTokens';
import ToastProvider from './contexts/ToastContext';
import Header from './components/Header';

function App() {
  const { t } = useTranslation();

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="gradient-bg flex flex-col min-h-screen overflow-y-auto">
          {/* Floating tokens */}
          <FloatingTokens />
          
          {/* Use the Header component */}
          <Header />
          
          {/* Main content */}
          <main className="flex-1 flex flex-col mt-[72px]">
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
