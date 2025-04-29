import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TokenBackground from '../TokenBackground';
import WalletSidebar from '../WalletSidebar';

const AppLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isWalletSidebarOpen, setIsWalletSidebarOpen] = useState(false);
  
  // Helper to check active route
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Function to toggle wallet sidebar
  const toggleWalletSidebar = () => {
    setIsWalletSidebarOpen(!isWalletSidebarOpen);
  };
  
  return (
    <div className="gradient-bg flex flex-col min-h-screen overflow-y-auto">
      {/* Background with reduced opacity */}
      <div className="fixed inset-0 z-0 opacity-50">
        <TokenBackground />
      </div>
      
      {/* Header with navigation */}
      <header className="fixed top-0 left-0 right-0 h-[72px] bg-[#0D111C]/80 backdrop-blur-md z-20 border-b border-[#1C2537]">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold mr-8">ZuniSwap</Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/swap" className={`text-sm font-medium ${isActive('/swap') ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                {t('nav.swap')}
              </Link>
              <Link to="/pool" className={`text-sm font-medium ${isActive('/pool') ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                {t('nav.pool')}
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleWalletSidebar}
              className="px-4 py-2 bg-gradient-to-r from-[#4338CA] to-[#60A5FA] rounded-xl text-white font-medium hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all"
            >
              {t('wallet.connectWallet')}
            </button>
          </div>
        </div>
      </header>

      {/* Main content - centered with padding */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-6 z-10 mt-[72px]">
        <div className="w-full max-w-md mx-auto">
          <Outlet />
        </div>
      </main>
      
      {/* Wallet sidebar */}
      <WalletSidebar isOpen={isWalletSidebarOpen} onClose={() => setIsWalletSidebarOpen(false)} />
    </div>
  );
};

export default AppLayout;