import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

interface WalletState {
  address: string | null;
  balance: string | null;
  network: string | null;
  isConnected: boolean;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
}

const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    balance: null,
    network: null,
    isConnected: false,
    provider: null,
    signer: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if MetaMask is installed
  const checkIfMetaMaskInstalled = useCallback(() => {
    const { ethereum } = window as any;
    return Boolean(ethereum && ethereum.isMetaMask);
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!checkIfMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed');
      }

      const { ethereum } = window as any;
      
      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];

      // Get provider and signer
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      
      // Get network
      const network = await provider.getNetwork();
      
      // Get balance
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.utils.formatEther(balance);

      setWallet({
        address,
        balance: formattedBalance,
        network: network.name,
        isConnected: true,
        provider,
        signer,
      });
      
      // Set up event listeners
      ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          // User has disconnected
          disconnectWallet();
        } else {
          // Account changed
          connectWallet();
        }
      });
      
      ethereum.on('chainChanged', () => {
        // Chain changed, refresh
        connectWallet();
      });
      
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Error connecting wallet:', err);
    } finally {
      setIsLoading(false);
    }
  }, [checkIfMetaMaskInstalled]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWallet({
      address: null,
      balance: null,
      network: null,
      isConnected: false,
      provider: null,
      signer: null,
    });
  }, []);

  // Check if wallet is already connected on first load
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (checkIfMetaMaskInstalled()) {
          const { ethereum } = window as any;
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          
          if (accounts.length > 0) {
            connectWallet();
          }
        }
      } catch (err) {
        console.error('Error checking connection:', err);
      }
    };
    
    checkConnection();
  }, [checkIfMetaMaskInstalled, connectWallet]);

  return {
    wallet,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled: checkIfMetaMaskInstalled(),
  };
};

export default useWallet; 