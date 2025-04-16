import React from 'react';
import { Token } from '../types';

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
}

const mockTokens: Token[] = [
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    logoURI: 'https://token-icons.com/eth.png',
    balance: '1.23'
  },
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    logoURI: 'https://token-icons.com/usdc.png',
    balance: '100.00'
  },
  {
    id: 'usdt',
    name: 'Tether',
    symbol: 'USDT',
    logoURI: 'https://token-icons.com/usdt.png',
    balance: '50.00'
  },
  {
    id: 'dai',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    logoURI: 'https://token-icons.com/dai.png',
    balance: '75.00'
  },
  {
    id: 'wbtc',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    logoURI: 'https://token-icons.com/wbtc.png',
    balance: '0.01'
  }
];

const TokenSelectModal: React.FC<TokenSelectModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-medium">Select Token</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close token selection"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-2">
          {mockTokens.map((token) => (
            <button
              key={token.id}
              onClick={() => onSelect(token)}
              className="w-full flex items-center space-x-4 p-3 rounded-lg hover:bg-[#2D2D2D] transition-colors"
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
    </div>
  );
};

export default TokenSelectModal;