import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo-ZC-SWAP.svg';

interface HeaderProps {
  // Add props if needed in the future
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="flex justify-between items-center py-4 px-6 w-full">
      {/* Logo bên trái */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Zuniswap Logo" className="h-8 w-auto" />
        </Link>
      </div>

      {/* Buttons bên phải */}
      <div className="flex items-center space-x-3">
        {/* Connect Wallet Button */}
        <button 
          className="bg-black text-white rounded-full px-4 py-2 flex items-center space-x-2 hover:opacity-90 transition-opacity"
          aria-label="Connect Wallet"
        >
          <span className="text-sm font-medium">Connect</span>
        </button>

        {/* Settings Button */}
        <button 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header; 