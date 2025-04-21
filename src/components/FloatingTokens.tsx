import React from 'react';

// Token data với vị trí ngẫu nhiên và biểu tượng
const tokens = [
  { id: 1, symbol: 'ETH', color: 'bg-blue-500', top: 'top-[15%]', left: 'left-[10%]', size: 'w-12 h-12' },
  { id: 2, symbol: 'USDC', color: 'bg-blue-400', top: 'top-[25%]', right: 'right-[15%]', size: 'w-10 h-10' },
  { id: 3, symbol: 'DAI', color: 'bg-yellow-400', top: 'top-[75%]', left: 'left-[20%]', size: 'w-14 h-14' },
  { id: 4, symbol: 'UNI', color: 'bg-pink-500', bottom: 'bottom-[20%]', right: 'right-[25%]', size: 'w-11 h-11' },
  { id: 5, symbol: 'WBTC', color: 'bg-orange-500', top: 'top-[40%]', left: 'left-[85%]', size: 'w-9 h-9' },
  { id: 6, symbol: 'LINK', color: 'bg-blue-600', bottom: 'bottom-[30%]', left: 'left-[30%]', size: 'w-10 h-10' },
  { id: 7, symbol: 'AAVE', color: 'bg-purple-500', top: 'top-[10%]', left: 'left-[50%]', size: 'w-8 h-8' },
  { id: 8, symbol: 'MATIC', color: 'bg-purple-600', bottom: 'bottom-[15%]', left: 'left-[75%]', size: 'w-12 h-12' },
  { id: 9, symbol: 'COMP', color: 'bg-green-500', top: 'top-[60%]', right: 'right-[10%]', size: 'w-9 h-9' },
  { id: 10, symbol: 'SNX', color: 'bg-blue-300', bottom: 'bottom-[40%]', right: 'right-[30%]', size: 'w-11 h-11' },
];

const FloatingTokens: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {tokens.map((token) => (
        <div
          key={token.id}
          className={`absolute rounded-full ${token.color} ${token.top} ${token.left} ${token.right} ${token.bottom} ${token.size} opacity-30 blur-md animate-float`}
          style={{ 
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 15}s` 
          }}
        >
          <div className="flex items-center justify-center h-full text-white font-bold text-sm">
            {token.symbol}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingTokens; 