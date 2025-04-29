import React from 'react';
import { useGlobalStore } from '../store/useGlobalStore';

const MarketplaceInfo: React.FC = () => {
  const { isDarkMode } = useGlobalStore();
  
  return (
    <div className="text-center my-8">
      <p className={`text-base max-w-[500px] mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        The largest onchain marketplace. Buy and sell crypto on Ethereum and 11+ other chains.
      </p>
    </div>
  );
};

export default MarketplaceInfo;