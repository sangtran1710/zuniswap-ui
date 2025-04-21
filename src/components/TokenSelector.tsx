import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Token } from '../types';
import { theme } from '../styles/theme';

interface TokenSelectorProps {
  token: Token | null;
  onTokenClick: () => void;
  className?: string;
}

const getTokenEmoji = (symbol: string) => {
  const emojiMap: { [key: string]: string } = {
    'ETH': '⚡',
    'BTC': '₿',
    'USDT': '💵',
    'USDC': '💲',
    'DAI': '🔸',
  };
  return emojiMap[symbol] || '🪙';
};

export default function TokenSelector({ token, onTokenClick, className = '' }: TokenSelectorProps) {
  return (
    <button
      onClick={onTokenClick}
      className={`
        flex items-center gap-2
        px-4 py-3
        min-w-[120px]
        h-full
        ${theme.radius.input} 
        bg-[#1C2537] hover:bg-[#252d3f] 
        ${theme.shadow.glow}
        transition-all duration-200 
        ${className}
      `}
      aria-label={token ? `Select ${token.symbol} token` : "Select token"}
    >
      <div className="flex items-center gap-2">
        {token ? (
          <>
            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#2C2F36]">
              {token.logoURI ? (
                <img 
                  src={token.logoURI}
                  alt={token.symbol}
                  className="w-5 h-5 rounded-full"
                  onError={(e) => {
                    if (!e.currentTarget.src.includes("default.png")) {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/icons/default.png";
                    }
                  }}
                />
              ) : (
                <span>{getTokenEmoji(token.symbol)}</span>
              )}
            </div>
            <span className={`${theme.font.size.label} font-semibold ${theme.colors.text.primary} ${theme.font.family}`}>
              {token?.symbol}
            </span>
          </>
        ) : (
          <span className={`${theme.font.size.label} font-semibold text-blue-500 ${theme.font.family}`}>
            Select token
          </span>
        )}
      </div>
      <ChevronDownIcon className={`w-4 h-4 ${theme.colors.text.secondary}`} />
    </button>
  );
}