import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GlobalMenu from '../GlobalMenu';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import classNames from 'classnames';
import ThemeSwitcher from '../ThemeSwitcher';
import { useGlobalStore } from '../../store/useGlobalStore';
import TokenSearchDropdown from '../TokenSearchDropdown';

type Token = {
  name: string;
  symbol: string;
  address: string;
  logoURI: string;
  price: number;
  priceChangePercentage24h: number;
};

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openWalletModal, isDarkMode } = useGlobalStore();
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  
  // Handle menu toggle
  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(menuRef, () => {
    if (isMenuOpen) setIsMenuOpen(false);
  });

  // Handle outside click for token dropdown
  const tokenDropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(tokenDropdownRef, () => {
    if (isTokenDropdownOpen) setIsTokenDropdownOpen(false);
  });

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 backdrop-filter backdrop-blur-md ${isDarkMode ? 'bg-transparent' : 'bg-white/50'}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="grid grid-cols-[1fr_auto_1fr] h-[72px] items-center relative bg-transparent">
          {/* Left: Logo + Navigation (flush left) */}
          <div className="flex items-center">
            <div 
              onClick={() => window.ZuniswapUI.reloadWithAnimation()} 
              className="flex items-center mr-6 cursor-pointer"
            >
              <div className="text-2xl font-extrabold flex items-center">
                <span className="bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 text-transparent bg-clip-text drop-shadow-sm">ZuniSwap</span>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-1">
              <NavLink 
                to="/swap" 
                className={({ isActive }) => 
                  classNames(
                    "px-3 py-2 text-base font-medium rounded-xl transition-colors",
                    isActive 
                      ? isDarkMode 
                        ? "bg-white/[0.08] text-white" 
                        : "bg-gray-100 text-gray-900"
                      : isDarkMode
                        ? "text-white/70 hover:text-white hover:bg-white/[0.08]"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/80"
                  )
                }
              >
                {t('Trade')}
              </NavLink>
              <NavLink 
                to="/tokens" 
                className={({ isActive }) => 
                  classNames(
                    "px-3 py-2 text-base font-medium rounded-xl transition-colors",
                    isActive 
                      ? isDarkMode 
                        ? "bg-white/[0.08] text-white" 
                        : "bg-gray-100 text-gray-900"
                      : isDarkMode
                        ? "text-white/70 hover:text-white hover:bg-white/[0.08]"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/80"
                  )
                }
              >
                {t('Explore')}
              </NavLink>
              <NavLink 
                to="/pools" 
                className={({ isActive }) => 
                  classNames(
                    "px-3 py-2 text-base font-medium rounded-xl transition-colors",
                    isActive 
                      ? isDarkMode 
                        ? "bg-white/[0.08] text-white" 
                        : "bg-gray-100 text-gray-900"
                      : isDarkMode
                        ? "text-white/70 hover:text-white hover:bg-white/[0.08]"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/80"
                  )
                }
              >
                {t('Pool')}
              </NavLink>
            </nav>
          </div>

          {/* Center: Search bar - Exactly centered in the grid */}
          <div className="w-[384px] mx-auto" ref={tokenDropdownRef}>
            <button
              onClick={() => setIsTokenDropdownOpen(true)}
              className={`w-full flex items-center px-4 py-[10px] rounded-[12px] text-sm transition-all focus:outline-none ${isDarkMode ? 'bg-[#22252D] border border-[#383D4D]/40 text-white/80 hover:border-[#383D4D]' : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'}`}
            >
              <svg className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              {selectedToken ? (
                <>
                  <img src={selectedToken.logoURI} alt={selectedToken.symbol} className="w-5 h-5 rounded-full mr-2" />
                  <span className="font-medium">{selectedToken.symbol}</span>
                </>
              ) : (
                <span>Search tokens</span>
              )}
            </button>
            <TokenSearchDropdown
              isOpen={isTokenDropdownOpen}
              onClose={() => setIsTokenDropdownOpen(false)}
              initialSearchTerm=""
              onSelectToken={(token) => {
                setSelectedToken(token);
                setIsTokenDropdownOpen(false);
              }}
              anchorToInput={true}
            />
          </div>

          {/* Right: Connect, Theme, GlobalMenu (flush right) */}
          <div className="flex items-center space-x-3 justify-end">
            <button 
              onClick={() => openWalletModal()}
              className="px-3 py-[8px] text-sm font-medium rounded-[12px] bg-pink-600 hover:bg-pink-700 text-white transition-colors"
            >
              {t('Connect')}
            </button>
            <ThemeSwitcher className="hidden md:block" />
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-xl ${isDarkMode ? 'bg-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.12]' : 'bg-gray-100 text-gray-700 hover:text-gray-900 hover:bg-gray-200'}`}
                aria-label="Menu"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              {isMenuOpen && <GlobalMenu />}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 