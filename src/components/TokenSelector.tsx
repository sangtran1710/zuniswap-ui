import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

interface Token {
  id: string;
  name: string;
  symbol: string;
  logoURI: string;
  balance?: string;
}

interface TokenSelectorProps {
  selectedToken: Token | null;
  onSelectToken: (token: Token) => void;
  position?: 'top' | 'bottom';
  tokensList: Token[];
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onSelectToken,
  position = 'bottom',
  tokensList
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredTokens = tokensList.filter(token =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-[#2D2D2D] px-4 py-2 rounded-lg hover:bg-[#3D3D3D] transition-colors"
        aria-label={selectedToken ? `Selected token: ${selectedToken.symbol}` : 'Select token'}
      >
        {selectedToken ? (
          <>
            <img 
              src={selectedToken.logoURI} 
              alt={selectedToken.symbol}
              className="w-6 h-6 rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/24';
              }}
            />
            <span className="text-white">{selectedToken.symbol}</span>
          </>
        ) : (
          <span className="text-white">Select Token</span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 w-80 bg-[#1E1E1E] rounded-xl shadow-lg border border-gray-800 z-50`}>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search token name or symbol"
                className="w-full pl-10 pr-4 py-2 bg-[#2D2D2D] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF007A]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {filteredTokens.map((token) => (
              <button
                key={token.id}
                onClick={() => {
                  onSelectToken(token);
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-4 p-4 hover:bg-[#2D2D2D] transition-colors"
              >
                <img 
                  src={token.logoURI} 
                  alt={token.symbol}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/32';
                  }}
                />
                <div className="flex-1 text-left">
                  <div className="text-white">{token.name}</div>
                  <div className="text-gray-400 text-sm">{token.symbol}</div>
                </div>
                {token.balance && (
                  <div className="text-gray-400 text-sm">
                    {token.balance}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenSelector;