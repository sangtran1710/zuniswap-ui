import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Token } from '../../types';
import { theme } from '../../styles/theme';

interface TokenSearchAdvancedProps {
  onSelectToken: (token: Token) => void;
  onClose: () => void;
}

// Mock data for popular tokens
const popularTokens: Token[] = [
  { id: '1', name: 'Ethereum', symbol: 'ETH', logoURI: '', decimals: 18, price: 3500, balance: '0.5' },
  { id: '2', name: 'USD Coin', symbol: 'USDC', logoURI: '', decimals: 6, price: 1, balance: '100' },
  { id: '3', name: 'Tether', symbol: 'USDT', logoURI: '', decimals: 6, price: 1, balance: '50' },
  { id: '4', name: 'Wrapped Bitcoin', symbol: 'WBTC', logoURI: '', decimals: 8, price: 62000, balance: '0.01' },
  { id: '5', name: 'Binance USD', symbol: 'BUSD', logoURI: '', decimals: 18, price: 1, balance: '200' },
  { id: '6', name: 'Dai', symbol: 'DAI', logoURI: '', decimals: 18, price: 1, balance: '75' },
];

// Mock data for all tokens
const allTokens: Token[] = [
  ...popularTokens,
  { id: '7', name: 'Chainlink', symbol: 'LINK', logoURI: '', decimals: 18, price: 13.5, balance: '10' },
  { id: '8', name: 'Uniswap', symbol: 'UNI', logoURI: '', decimals: 18, price: 7.2, balance: '15' },
  { id: '9', name: 'Aave', symbol: 'AAVE', logoURI: '', decimals: 18, price: 92, balance: '1.2' },
  { id: '10', name: 'Compound', symbol: 'COMP', logoURI: '', decimals: 18, price: 45, balance: '0.5' },
  { id: '11', name: 'Maker', symbol: 'MKR', logoURI: '', decimals: 18, price: 1350, balance: '0.1' },
  { id: '12', name: 'Synthetix', symbol: 'SNX', logoURI: '', decimals: 18, price: 3.2, balance: '20' },
];

const TokenSearchAdvanced: React.FC<TokenSearchAdvancedProps> = ({ onSelectToken, onClose }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTokens, setFilteredTokens] = useState<Token[]>(allTokens);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'popular'>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus search input on mount
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Filter tokens based on search query and active tab
    let tokens = activeTab === 'all' ? allTokens : popularTokens;
    
    if (showFavoritesOnly) {
      tokens = tokens.filter(token => favorites.includes(token.id));
    }
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      tokens = tokens.filter(
        token =>
          token.name.toLowerCase().includes(lowerQuery) ||
          token.symbol.toLowerCase().includes(lowerQuery)
      );
    }
    
    setFilteredTokens(tokens);
  }, [searchQuery, activeTab, favorites, showFavoritesOnly]);

  const toggleFavorite = (tokenId: string) => {
    setFavorites(prev => 
      prev.includes(tokenId)
        ? prev.filter(id => id !== tokenId)
        : [...prev, tokenId]
    );
  };

  const handleSelectToken = (token: Token) => {
    onSelectToken(token);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="w-full max-w-md bg-[#0D111C] rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#1C2537] flex justify-between items-center">
          <h2 className={`${theme.font.size.subtitle} ${theme.colors.text.primary} font-semibold`}>
            {t('tokens.selectToken')}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#1C2537] text-gray-400 hover:text-white"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('tokens.searchPlaceholder')}
              className="w-full bg-[#131A2A] rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 flex space-x-2 border-b border-[#1C2537]">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-3 text-sm font-medium ${
              activeTab === 'all'
                ? 'text-white border-b-2 border-[#FC72FF]'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t('tokens.allTokens')}
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`py-2 px-3 text-sm font-medium ${
              activeTab === 'popular'
                ? 'text-white border-b-2 border-[#FC72FF]'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t('tokens.popularTokens')}
          </button>
          <div className="flex-grow"></div>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`py-2 px-3 text-sm font-medium flex items-center ${
              showFavoritesOnly
                ? 'text-[#FC72FF]'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {showFavoritesOnly ? <StarIconSolid className="w-4 h-4 mr-1" /> : <StarIcon className="w-4 h-4 mr-1" />}
            {t('tokens.favorites')}
          </button>
        </div>

        {/* Token List */}
        <div className="max-h-[400px] overflow-y-auto">
          {filteredTokens.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>{t('tokens.noResults')}</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1C2537]">
              {filteredTokens.map((token) => (
                <div
                  key={token.id}
                  className="p-4 hover:bg-[#1C2537] flex items-center justify-between cursor-pointer"
                  onClick={() => handleSelectToken(token)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {token.symbol.substring(0, 1)}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-white">{token.name}</div>
                      <div className="text-sm text-gray-500">{token.symbol}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-3">
                      <div className="font-medium text-white">{token.balance}</div>
                      <div className="text-sm text-gray-500">
                        ${(parseFloat(token.balance) * token.price).toFixed(2)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(token.id);
                      }}
                      className="p-1 rounded-full hover:bg-[#131A2A]"
                    >
                      {favorites.includes(token.id) ? (
                        <StarIconSolid className="w-5 h-5 text-[#FC72FF]" />
                      ) : (
                        <StarIcon className="w-5 h-5 text-gray-500 hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manage Token Lists */}
        <div className="p-4 border-t border-[#1C2537]">
          <button className="w-full py-2 text-center text-[#FC72FF] font-medium hover:text-[#fd8aff]">
            {t('tokens.manageTokenLists')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenSearchAdvanced;
