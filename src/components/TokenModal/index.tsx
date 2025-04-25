import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  XMarkIcon, 
  MagnifyingGlassIcon,
  StarIcon,
  CheckIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { Token } from '../../types';

// Top tokens by volume on Uniswap (preserving original case)
const TOP_TOKEN_ADDRESSES = [
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
  '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
  '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI
  '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', // MATIC
  '0x514910771AF9Ca656af840dff83E8264EcF986CA'  // LINK
];

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (token: Token) => void;
  selectedToken?: Token;
}

interface TokenRowProps {
  token: Token;
  isSelected: boolean;
  onSelect: (token: Token) => void;
}

const TokenRow: React.FC<TokenRowProps> = ({ token, isSelected, onSelect }) => {
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <button
      onClick={() => onSelect(token)}
      className={`w-full flex items-center px-4 py-2.5 hover:bg-[#1c1f2d] active:bg-[#252936] rounded-xl transition-colors
                ${isSelected ? 'bg-[#1c1f2d]' : ''}`}
    >
      {/* Token Logo */}
      <div className="relative flex-shrink-0">
        <img 
          src={token.logoURI}
          alt={token.symbol}
          className="w-5 h-5 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.parentElement!.innerHTML = `
              <div class="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center">
                <span class="text-xs font-medium text-white">${token.symbol.slice(0, 2)}</span>
              </div>
            `;
          }}
        />
      </div>
      
      {/* Token Info */}
      <div className="flex flex-col items-start flex-grow min-w-0 ml-3">
        <div className="flex items-center w-full">
          <span className="font-medium text-base text-white">{token.symbol}</span>
          <span className="text-xs text-gray-400 ml-2">{token.name}</span>
        </div>
        <span className="text-xs text-gray-500">
          {truncateAddress(token.address)}
        </span>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <CheckIcon className="w-5 h-5 text-blue-500 ml-2 flex-shrink-0" />
      )}
    </button>
  );
};

const TokenModal: React.FC<TokenModalProps> = ({ isOpen, onClose, onSelectToken, selectedToken }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Uniswap Token List
  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('https://tokens.uniswap.org');
        const data = await response.json();
        // Filter for mainnet tokens only
        const mainnetTokens = data.tokens
          .filter((t: any) => t.chainId === 1)
          .map((t: any) => ({
            name: t.name,
            symbol: t.symbol,
            address: t.address, // Preserve original case
            logoURI: t.logoURI,
            decimals: t.decimals
          }));
        setTokens(mainnetTokens);
      } catch (err) {
        console.error('Failed to fetch token list:', err);
        setError('Failed to load token list. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchTokens();
    }
  }, [isOpen]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter and sort tokens
  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Split into featured and other tokens
  const featured = searchTerm ? [] : TOP_TOKEN_ADDRESSES
    .map(addr => tokens.find(t => t.address === addr))
    .filter(Boolean) as Token[];

  const others = filteredTokens
    .filter(t => !featured.find(f => f.address === t.address))
    .sort((a, b) => a.symbol.localeCompare(b.symbol));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-slide-in w-full max-w-md bg-[#101113] rounded-3xl shadow-xl overflow-hidden mx-4">
        <div className="p-4 flex items-center justify-between border-b border-gray-800/60">
          <h2 className="text-xl font-semibold text-white">Select a token</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#282A30] transition-colors"
            aria-label="Close token selection"
          >
            <XMarkIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-800/60">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tokens"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#282A30] rounded-2xl pl-10 pr-24 py-2.5 text-base text-white placeholder-gray-500
                       focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
              autoFocus
            />
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            
            {/* Clear Button */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-[72px] top-2.5 p-1 rounded-lg hover:bg-[#3a3d46] transition-colors"
                aria-label="Clear search"
              >
                <XMarkIcon className="w-4 h-4 text-gray-400" />
              </button>
            )}
            
            {/* Network Selector */}
            <button className="absolute right-2 top-2 px-2 py-1 rounded-xl bg-[#1c1f2d] hover:bg-[#252936] 
                           flex items-center gap-1 text-sm text-white transition-colors">
              <span>Ethereum</span>
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#282A30] scrollbar-track-transparent">
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">
              Loading tokens...
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">
              {error}
            </div>
          ) : (
            <>
              {/* Featured Tokens Section */}
              {featured.length > 0 && (
                <>
                  <div className="px-4 py-2 flex items-center text-sm font-medium text-gray-300">
                    <StarIcon className="w-4 h-4 mr-2 text-gray-400" />
                    Tokens by 24H volume
                  </div>
                  {featured.map(token => (
                    <TokenRow
                      key={token.address}
                      token={token}
                      isSelected={selectedToken?.address === token.address}
                      onSelect={onSelectToken}
                    />
                  ))}
                  {others.length > 0 && (
                    <div className="border-t border-gray-800/40 my-1" />
                  )}
                </>
              )}

              {/* Other Tokens */}
              {others.map(token => (
                <TokenRow
                  key={token.address}
                  token={token}
                  isSelected={selectedToken?.address === token.address}
                  onSelect={onSelectToken}
                />
              ))}

              {/* No Results */}
              {filteredTokens.length === 0 && (
                <div className="py-10 text-center">
                  <p className="text-gray-400">
                    No tokens found for "{searchTerm}"
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenModal; 