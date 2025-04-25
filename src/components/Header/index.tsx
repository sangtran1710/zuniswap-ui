import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import GlobalMenu from '../GlobalMenu';
import ZuniLogo from '../ZuniLogo';
import ConnectWallet from '../ConnectWallet';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import TokenSearchDropdown from '../TokenSearchDropdown';

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchFocus = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    // Không xóa searchQuery khi đóng để giữ giá trị tìm kiếm
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!isSearchOpen) {
      setIsSearchOpen(true);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent border-b border-[#1C2537]/20 backdrop-blur-sm overflow-visible">
      <div className="h-[72px] flex items-center px-4 md:px-6 max-w-[1600px] mx-auto">
        {/* Left section: Logo + Navigation */}
        <div className="flex items-center h-full w-1/4 md:w-1/3 min-w-[120px]">
          {/* Logo */}
          <Link to="/" className="h-full flex items-center">
            <ZuniLogo />
          </Link>
          
          {/* Main Navigation */}
          <nav className="hidden md:flex ml-4 space-x-6">
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
        
        {/* Center section: Search Tokens (always centered) */}
        <div className="flex-1 flex justify-center items-center w-1/2 md:w-1/3 px-2 md:px-4">
          <div className="relative w-full max-w-[480px]">
            <div className="flex items-center absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search tokens"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              className="w-full bg-[#1a1e2e]/70 text-gray-300 rounded-2xl py-3 md:py-3.5 pl-10 pr-4 text-base focus:outline-none focus:ring-1 focus:ring-purple-500 border border-[#1C2537]/40 hover:border-purple-500/30 shadow-md hover:shadow-lg transition-all"
            />
            
            {/* Token search dropdown */}
            <TokenSearchDropdown 
              isOpen={isSearchOpen} 
              onClose={handleSearchClose} 
              initialSearchTerm={searchQuery}
            />
          </div>
        </div>
        
        {/* Right section: Connect button and menu */}
        <div className="flex items-center justify-end space-x-2 w-1/4 md:w-1/3 min-w-[120px]">
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