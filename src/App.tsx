import React from 'react';
import { WalletProvider } from './context/WalletContext';
import { SwapProvider } from './context/SwapContext';
import { NotificationProvider } from './context/NotificationContext';
import Header from './components/Header';
import SwapCard from './components/SwapCard';
import Background from './components/Background';

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <WalletProvider>
        <SwapProvider>
          <div className="min-h-screen bg-background text-text-1">
            <Background />
            <div className="relative z-10">
              <Header />
              <main className="container mx-auto px-4 py-8">
                <SwapCard />
              </main>
            </div>
          </div>
        </SwapProvider>
      </WalletProvider>
    </NotificationProvider>
  );
};

export default App; 