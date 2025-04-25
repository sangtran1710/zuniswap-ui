import React, { createContext, useContext, ReactNode } from 'react';
import { useWagmi } from '../hooks/useWagmi';

interface WalletContextProps {
  address: string | null;
  balance: string | null;
  network: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  isMetaMaskInstalled: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    address,
    balance,
    balanceSymbol,
    isConnected,
    isPending,
    error,
    chainId,
    isMetaMaskAvailable,
    connectWallet: connectWithWagmi,
    disconnectWallet,
  } = useWagmi();

  // Simplified connect function that connects to MetaMask by default
  const connectWallet = () => {
    // This is just a placeholder - actual connection is handled in the modal
    // where specific connectors are used
  };

  const value = {
    address: address || null,
    balance: balance ? `${balance} ${balanceSymbol}` : null,
    network: chainId ? `Chain ID: ${chainId}` : null,
    isConnected,
    isLoading: isPending,
    error,
    isMetaMaskInstalled: isMetaMaskAvailable,
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