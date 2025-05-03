import React from 'react';

interface TokenBadgeProps {
  badge: string;
}

const TokenBadge: React.FC<TokenBadgeProps> = ({ badge }) => {
  if (badge === 'B') {
    return (
      <span className="bg-[#3498DB] text-white text-[10px] font-bold px-1 py-0.5 rounded group relative cursor-help">
        B
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-32 bg-[#191B1F] text-white text-xs p-2 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          Base Network Token
        </div>
      </span>
    );
  } else if (badge === '+') {
    return (
      <span className="bg-[#FC72FF] text-white text-[10px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full group relative cursor-help">
        +
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-32 bg-[#191B1F] text-white text-xs p-2 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          Unichain Network Token
        </div>
      </span>
    );
  }
  
  return null;
};

export default TokenBadge;
