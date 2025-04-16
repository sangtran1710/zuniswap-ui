import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CHAIN_IDS, RPC_URLS } from '../constants';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string;
  error: string | null;
  isConnecting: boolean;
}

interface WalletActions {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getBalance: (address: string) => Promise<string>;
  switchChain: (chainId: number) => Promise<void>;
}

const MOCK_ADDRESS = '0x1234567890123456789012345678901234567890';
const MOCK_BALANCE = '1.2345';

export const useWallet = (): WalletState & WalletActions => {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    balance: '0',
    error: null,
    isConnecting: false,
  });

  // Check if Web3 is available
  const isWeb3Available = typeof window !== 'undefined' && window.ethereum;

  // Initialize provider
  const getProvider = useCallback(() => {
    if (isWeb3Available) {
      return new ethers.providers.Web3Provider(window.ethereum);
    }
    return null;
  }, [isWeb3Available]);

  // Handle chain changes
  useEffect(() => {
    if (!isWeb3Available) return;

    const handleChainChanged = (chainId: string) => {
      setState(prev => ({
        ...prev,
        chainId: parseInt(chainId, 16),
      }));
    };

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        disconnectWallet();
      } else {
        setState(prev => ({
          ...prev,
          address: accounts[0],
        }));
      }
    };

    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [isWeb3Available]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      if (isWeb3Available) {
        const provider = getProvider();
        if (!provider) throw new Error('Provider not available');

        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        // Get chain ID
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });

        // Get balance
        const balance = await getBalance(accounts[0]);

        setState({
          isConnected: true,
          address: accounts[0],
          chainId: parseInt(chainId, 16),
          balance,
          error: null,
          isConnecting: false,
        });
      } else {
        // Mock connection for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        setState({
          isConnected: true,
          address: MOCK_ADDRESS,
          chainId: CHAIN_IDS.MAINNET,
          balance: MOCK_BALANCE,
          error: null,
          isConnecting: false,
        });
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to connect wallet',
        isConnecting: false,
      }));
    }
  }, [isWeb3Available, getProvider]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setState({
      isConnected: false,
      address: null,
      chainId: null,
      balance: '0',
      error: null,
      isConnecting: false,
    });
  }, []);

  // Get balance
  const getBalance = useCallback(async (address: string): Promise<string> => {
    try {
      if (isWeb3Available) {
        const provider = getProvider();
        if (!provider) throw new Error('Provider not available');

        const balance = await provider.getBalance(address);
        return ethers.utils.formatEther(balance);
      } else {
        // Mock balance for development
        return MOCK_BALANCE;
      }
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }, [isWeb3Available, getProvider]);

  // Switch chain
  const switchChain = useCallback(async (chainId: number): Promise<void> => {
    try {
      if (isWeb3Available) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
      } else {
        // Mock chain switch for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        setState(prev => ({
          ...prev,
          chainId,
        }));
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unrecognized chain ID')) {
        // Chain not added to wallet, try to add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: 'Ethereum Mainnet',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [RPC_URLS[chainId]],
                blockExplorerUrls: ['https://etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          setState(prev => ({
            ...prev,
            error: 'Failed to add network to wallet',
          }));
        }
      } else {
        setState(prev => ({
          ...prev,
          error: 'Failed to switch network',
        }));
      }
    }
  }, [isWeb3Available]);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    getBalance,
    switchChain,
  };
}; 