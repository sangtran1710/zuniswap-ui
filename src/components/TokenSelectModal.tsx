import React from 'react';
import { getTokenImage } from '../utils/tokenUtils';

// Định nghĩa interface cho props
interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (symbol: string) => void;
  tokens: Array<{symbol: string, id: string}>;
}

const TokenSelectModal: React.FC<TokenSelectModalProps> = ({ isOpen, onClose, onSelect, tokens }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl p-4 w-96 max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select token</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          {tokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => {
                onSelect(token.symbol);
                onClose();
              }}
              className="w-full flex items-center p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <img
                src={getTokenImage(token.symbol)}
                alt={token.symbol}
                className="w-8 h-8 rounded-full"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/api/placeholder/32/32";
                }}
              />
              <span className="ml-3 font-medium">{token.symbol}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenSelectModal;