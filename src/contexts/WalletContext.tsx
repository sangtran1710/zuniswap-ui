import React, { createContext, useContext, ReactNode } from 'react';
import useWallet from '../hooks/useWallet';

interface WalletContextProps {
  address: string | null;
  balance: string | null;
  network: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  isMetaMaskInstalled: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    wallet,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled,
  } = useWallet();

  const value = {
    address: wallet.address,
    balance: wallet.balance,
    network: wallet.network,
    isConnected: wallet.isConnected,
    isLoading,
    error,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};

export default WalletContext; 