import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowDown, ArrowUpDown, X } from 'lucide-react';
import { useSwap } from '../context/SwapContext';
import { useWallet } from '../context/WalletContext';
import TokenSelectModal from './TokenSelectModal';
import { Token } from '../types';

const SwapCard: React.FC = () => {
  const {
    sellToken,
    buyToken,
    sellAmount,
    buyAmount,
    updateTokenSelection,
    updateAmount,
    switchTokens,
    calculateSwapRate,
    isLoading,
    error
  } = useSwap();

  const { isConnected, connectWallet } = useWallet();

  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [selectedTokenType, setSelectedTokenType] = useState<'sell' | 'buy'>('sell');

  const handleTokenSelect = (token: Token) => {
    updateTokenSelection(token, selectedTokenType);
    setIsTokenModalOpen(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'sell' | 'buy') => {
    updateAmount(e.target.value, type);
  };

  const handleSwap = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }
    await calculateSwapRate();
  };

  return (
    <div className="bg-[#1E1E1E] rounded-2xl p-6 shadow-lg border border-gray-800">
      {/* Token Inputs */}
      <div className="space-y-4">
        {/* Sell Token Input */}
        <div className="bg-[#2D2D2D] rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Sell</span>
            <span className="text-gray-400">Balance: {sellToken?.balance || '0.00'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={sellAmount}
              onChange={(e) => handleAmountChange(e, 'sell')}
              placeholder="0.0"
              className="flex-1 bg-transparent text-white text-xl focus:outline-none"
            />
            <button
              onClick={() => {
                setSelectedTokenType('sell');
                setIsTokenModalOpen(true);
              }}
              className="flex items-center space-x-2 bg-[#3D3D3D] px-4 py-2 rounded-lg hover:bg-[#4D4D4D] transition-colors"
            >
              {sellToken ? (
                <>
                  <img src={sellToken.logoURI} alt={sellToken.symbol} className="w-6 h-6" />
                  <span>{sellToken.symbol}</span>
                </>
              ) : (
                <span>Select Token</span>
              )}
            </button>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2">
          <button
            onClick={switchTokens}
            className="bg-[#3D3D3D] p-2 rounded-full hover:bg-[#4D4D4D] transition-colors"
            aria-label="Switch tokens"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Buy Token Input */}
        <div className="bg-[#2D2D2D] rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Buy</span>
            <span className="text-gray-400">Balance: {buyToken?.balance || '0.00'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={buyAmount}
              onChange={(e) => handleAmountChange(e, 'buy')}
              placeholder="0.0"
              className="flex-1 bg-transparent text-white text-xl focus:outline-none"
            />
            <button
              onClick={() => {
                setSelectedTokenType('buy');
                setIsTokenModalOpen(true);
              }}
              className="flex items-center space-x-2 bg-[#3D3D3D] px-4 py-2 rounded-lg hover:bg-[#4D4D4D] transition-colors"
            >
              {buyToken ? (
                <>
                  <img src={buyToken.logoURI} alt={buyToken.symbol} className="w-6 h-6" />
                  <span>{buyToken.symbol}</span>
                </>
              ) : (
                <span>Select Token</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={isLoading}
        className="w-full mt-6 bg-[#FF007A] text-white py-3 rounded-xl font-medium
          hover:bg-[#FF3399] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Calculating...' : isConnected ? 'Swap' : 'Connect Wallet'}
      </button>

      {/* Token Select Modal */}
      <TokenSelectModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        onSelect={handleTokenSelect}
      />
    </div>
  );
};

export default SwapCard; 