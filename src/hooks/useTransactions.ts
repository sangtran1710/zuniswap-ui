import { useState, useEffect } from 'react';
import { fetchTransactions, Transaction } from '../services/transactionService';

export function useTransactions(address: string | undefined | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTransactions = async () => {
      if (!address) {
        setTransactions([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchTransactions(address);
        setTransactions(data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [address]);

  const refreshTransactions = async () => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchTransactions(address);
      setTransactions(data);
    } catch (err) {
      console.error('Error refreshing transactions:', err);
      setError('Failed to refresh transactions');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    transactions,
    isLoading,
    error,
    refreshTransactions
  };
} 