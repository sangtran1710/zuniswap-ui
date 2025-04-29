import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TokenBackground from '../TokenBackground';
import FooterText from '../FooterText';
import { MagnifyingGlassIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

const LandingLayout = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col min-h-screen overflow-y-auto bg-[#0D111C]">
      {/* Background effects */}
      <TokenBackground />
      
      {/* Header - styled like Uniswap */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-white translate-y-[1px]">ZuniSwap</span>
            </Link>
            
            {/* Navigation - moved closer to logo */}
            <nav className="hidden md:flex items-center ml-6 space-x-4">
              <Link to="/" className="text-white font-medium hover:opacity-70 transition-opacity">
                Trade
              </Link>
              <Link to="/" className="text-white font-medium hover:opacity-70 transition-opacity">
                Explore
              </Link>
              <Link to="/" className="text-white font-medium hover:opacity-70 transition-opacity">
                Pool
              </Link>
            </nav>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center max-w-md w-full mx-2">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tokens"
                className="block w-full pl-10 pr-3 py-2 border-0 bg-[#202023] rounded-full placeholder-gray-500 text-white text-sm focus:outline-none focus:ring-0 shadow-inner shadow-black/20"
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <div className="text-gray-400 text-xs">/</div>
              </div>
            </div>
          </div>
          
          {/* Right-side buttons - Connect button and ellipsis */}
          <div className="flex items-center space-x-2">
            <button 
              className="hidden md:flex items-center justify-center w-6 h-6 text-white hover:opacity-70 transition-opacity px-1"
              aria-label="More options"
            >
              <EllipsisHorizontalIcon className="w-4 h-4 scale-75" />
            </button>
            <Link 
              to="/swap" 
              className="px-4 py-2 bg-[#FF0080] hover:brightness-95 text-white font-medium rounded-xl transition-all"
            >
              Connect
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col mt-[72px]">
        <Outlet />
      </main>
      
      {/* Footer - simplified like Uniswap */}
      <footer className="py-8 text-center">
        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} ZuniSwap. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingLayout; 