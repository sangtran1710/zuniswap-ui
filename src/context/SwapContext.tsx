import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Token } from '../types';

interface SwapState {
  sellToken: Token | null;
  buyToken: Token | null;
  sellAmount: string;
  buyAmount: string;
  slippageTolerance: number;
  swapRoute: string[];
  isLoading: boolean;
  error: string | null;
}

interface SwapContextType extends SwapState {
  updateTokenSelection: (token: Token, type: 'sell' | 'buy') => void;
  updateAmount: (amount: string, type: 'sell' | 'buy') => void;
  switchTokens: () => void;
  calculateSwapRate: () => Promise<void>;
  setSlippageTolerance: (value: number) => void;
}

const initialState: SwapState = {
  sellToken: null,
  buyToken: null,
  sellAmount: '',
  buyAmount: '',
  slippageTolerance: 0.5, // 0.5%
  swapRoute: [],
  isLoading: false,
  error: null,
};

const SwapContext = createContext<SwapContextType | undefined>(undefined);

export const SwapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SwapState>(initialState);

  const updateTokenSelection = useCallback((token: Token, type: 'sell' | 'buy') => {
    setState(prev => ({
      ...prev,
      [type === 'sell' ? 'sellToken' : 'buyToken']: token,
      error: null,
    }));
  }, []);

  const updateAmount = useCallback((amount: string, type: 'sell' | 'buy') => {
    setState(prev => ({
      ...prev,
      [type === 'sell' ? 'sellAmount' : 'buyAmount']: amount,
      error: null,
    }));
  }, []);

  const switchTokens = useCallback(() => {
    setState(prev => ({
      ...prev,
      sellToken: prev.buyToken,
      buyToken: prev.sellToken,
      sellAmount: prev.buyAmount,
      buyAmount: prev.sellAmount,
      error: null,
    }));
  }, []);

  const setSlippageTolerance = useCallback((value: number) => {
    setState(prev => ({
      ...prev,
      slippageTolerance: value,
    }));
  }, []);

  const calculateSwapRate = useCallback(async () => {
    if (!state.sellToken || !state.buyToken || !state.sellAmount) {
      setState(prev => ({ ...prev, error: 'Please select tokens and enter amount' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Mock API call to calculate swap rate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      const mockRate = 1.5; // 1 sell token = 1.5 buy tokens
      const calculatedAmount = (parseFloat(state.sellAmount) * mockRate).toString();
      
      setState(prev => ({
        ...prev,
        buyAmount: calculatedAmount,
        swapRoute: [state.sellToken?.symbol || '', state.buyToken?.symbol || ''],
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to calculate swap rate',
        isLoading: false,
      }));
    }
  }, [state.sellToken, state.buyToken, state.sellAmount]);

  const value = {
    ...state,
    updateTokenSelection,
    updateAmount,
    switchTokens,
    calculateSwapRate,
    setSlippageTolerance,
  };

  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>;
};

export const useSwap = () => {
  const context = useContext(SwapContext);
  if (context === undefined) {
    throw new Error('useSwap must be used within a SwapProvider');
  }
  return context;
}; 