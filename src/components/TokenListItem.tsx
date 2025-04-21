import { Token } from '../types';

interface TokenListItemProps {
  token: Token;
  isSelected: boolean;
  onSelect: (token: Token) => void;
}

const TokenListItem = ({ token, isSelected, onSelect }: TokenListItemProps) => {
  return (
    <button
      className={`
        w-full flex items-center justify-between px-4 py-3 rounded-xl
        transition-all duration-150 ease-in-out
        hover:bg-[#ffffff0a]
        ${isSelected ? 'ring-1 ring-[#3A81F5] shadow-[0_0_12px_rgba(58,129,245,0.3)]' : ''}
      `}
      onClick={() => onSelect(token)}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={token.logoUrl}
            alt={token.symbol}
            className="w-6 h-6 rounded-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/tokens/placeholder.png';
            }}
          />
        </div>
        <div className="flex flex-col items-start">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-white">{token.symbol}</span>
            <span className="text-xs text-gray-400">{token.name}</span>
          </div>
          <div className="text-xs text-gray-500 truncate max-w-[180px]">
            {token.address.substring(0, 6)}...{token.address.substring(token.address.length - 4)}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-white">{token.balance}</div>
        <div className="text-xs text-gray-400">
          ${(parseFloat(token.balance) * token.price).toFixed(2)}
        </div>
      </div>
    </button>
  );
};

export default TokenListItem; 