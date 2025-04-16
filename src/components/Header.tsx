import React from 'react';
import { useWallet } from '../context/WalletContext';

const Header: React.FC = () => {
  const { isConnected, address, connectWallet } = useWallet();

  return (
    <header className="w-full py-4 px-6 flex justify-between items-center">
      <div className="text-xl font-bold">ZuniSwap</div>
      
      <button
        onClick={connectWallet}
        className="px-4 py-2 bg-[#FF007A] rounded-lg hover:bg-[#FF3399] transition-colors"
        disabled={isConnected}
      >
        {isConnected ? address : 'Connect Wallet'}
      </button>
    </header>
  );
};

export default Header; 