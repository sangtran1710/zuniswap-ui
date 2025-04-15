import React from 'react';

// Định nghĩa interface cho props
interface PriceInfoProps {
  fromToken: string;
  toToken: string;
  exchangeRate: number | null;
  loading: boolean;
  fromAmount: string;
}

const PriceInfo: React.FC<PriceInfoProps> = ({ fromToken, toToken, exchangeRate, loading, fromAmount }) => {
  return (
    <div className="text-sm mt-4">
      {/* Price Row */}
      <div className="flex justify-between items-center text-gray-500">
        <span>Price</span>
        <span className="flex items-center">
          {loading ? (
            <span className="text-gray-400">Fetching best price...</span>
          ) : (
            <>
              {`1 ${fromToken} = ${exchangeRate ? exchangeRate.toFixed(8) : '0.00'} ${toToken}`}
              <button className="ml-2 text-gray-400 hover:text-gray-600 transition-colors">
                🔄
              </button>
            </>
          )}
        </span>
      </div>

      {/* Price Impact Row */}
      <div className="flex justify-between items-center text-gray-500 mt-1">
        <span>Price Impact</span>
        <span className="text-green-500">{fromAmount ? '<0.01%' : '-'}</span>
      </div>

      {/* Liquidity Provider Fee */}
      <div className="flex justify-between items-center text-gray-500 mt-1">
        <span>Liquidity Provider Fee</span>
        <span>
          {fromAmount ? `0.003 ${fromToken}` : '-'}
        </span>
      </div>
    </div>
  );
};

export default PriceInfo;