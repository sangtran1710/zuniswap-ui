import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import GlobalMenu from './GlobalMenu';
import ZuniLogo from './ZuniLogo';
import ConnectWallet from './ConnectWallet';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D111C] border-b border-[#1C2537]/40">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 h-[72px] flex justify-between items-center">
        {/* Left section: Logo and main nav */}
        <div className="flex items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <ZuniLogo />
          </Link>
          
          {/* Main Navigation */}
          <nav className="hidden md:flex ml-6 lg:ml-8 space-x-6">
            <NavLink 
              to="/swap" 
              className={({ isActive }) => 
                `text-[15px] font-medium ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-300'} transition-colors`
              }
            >
              Trade
            </NavLink>
            <NavLink 
              to="/explore" 
              className={({ isActive }) => 
                `text-[15px] font-medium ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-300'} transition-colors`
              }
            >
              Explore
            </NavLink>
            <NavLink 
              to="/pool" 
              className={({ isActive }) => 
                `text-[15px] font-medium ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-300'} transition-colors`
              }
            >
              Pool
            </NavLink>
          </nav>
        </div>
        
        {/* Right section: Connect button and menu */}
        <div className="flex items-center space-x-2">
          {/* Connect Wallet Button */}
          <ConnectWallet />
          
          {/* Settings Menu */}
          <GlobalMenu />
        </div>
      </div>
    </header>
  );
};

export default Header; 