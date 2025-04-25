import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './App.css'
import { useTranslation } from 'react-i18next'
import { ThemeProvider } from './contexts/ThemeContext'
import TokenBackground from './components/TokenBackground';
import ToastProvider from './contexts/ToastContext';
import Header from './components/Header';
import SwapCard from './components/SwapCard';
import ConnectWalletModal from './components/ConnectWalletModal';
import './components/IntroAnimation.css';

function App() {
  const { t } = useTranslation();

  useEffect(() => {
    const preloadDiv = document.createElement('div');
    preloadDiv.style.position = 'absolute';
    preloadDiv.style.width = '0';
    preloadDiv.style.height = '0';
    preloadDiv.style.overflow = 'hidden';
    preloadDiv.style.visibility = 'hidden';
    
    const swapCardPreload = <SwapCard />;
    
    setTimeout(() => {
      if (document.body.contains(preloadDiv)) {
        document.body.removeChild(preloadDiv);
      }
    }, 1000);
    
    document.body.appendChild(preloadDiv);
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="gradient-bg flex flex-col min-h-screen overflow-y-auto">
          {/* Animated token background */}
          <TokenBackground />
          
          {/* Use the Header component */}
          <Header />
          
          {/* Main content */}
          <main className="flex-1 flex flex-col mt-[72px]">
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </main>
          
          {/* Wallet connection modal */}
          <ConnectWalletModal />
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
