import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  error: string | null;
}

interface WalletContextType extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const initialState: WalletState = {
  isConnected: false,
  address: null,
  error: null,
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WalletState>(initialState);

  const connectWallet = useCallback(async () => {
    try {
      // Mock wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState({
        isConnected: true,
        address: '0x1234...5678', // Mock address
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to connect wallet',
      }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setState(initialState);
  }, []);

  const value = {
    ...state,
    connectWallet,
    disconnectWallet,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 