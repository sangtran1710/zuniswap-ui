import { useState, useEffect } from 'react';
import axios from 'axios';

interface TokenPrice {
  [key: string]: number;
}

const API_KEY = 'CG-Placeholder-API-Key'; // replace with real Coingecko API key in production

/**
 * Custom hook to fetch token prices from CoinGecko API
 * @param tokenIds Array of token IDs to fetch prices for
 * @param currency Currency to fetch prices in (default: usd)
 * @returns Object with token prices and loading/error states
 */
const useTokenPrice = (tokenIds: string[], currency = 'usd') => {
  const [prices, setPrices] = useState<TokenPrice>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      if (!tokenIds.length) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // In a real app, you'd use the CoinGecko API to fetch real-time prices
        // For this demo, we'll use a mock API call
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds.join(',')}&vs_currencies=${currency}`,
          {
            headers: {
              'x-cg-api-key': API_KEY,
            }
          }
        );

        setPrices(response.data);
      } catch (err) {
        console.error('Error fetching token prices:', err);
        setError('Failed to fetch token prices');
        
        // Fallback to mock data in case of API error
        const mockPrices: TokenPrice = {};
        tokenIds.forEach((id) => {
          if (id === 'ethereum') mockPrices[id] = 3000;
          else if (id === 'bitcoin') mockPrices[id] = 60000;
          else if (id === 'usd-coin') mockPrices[id] = 1;
          else if (id === 'dai') mockPrices[id] = 1;
          else mockPrices[id] = 0;
        });
        
        setPrices(mockPrices);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    
    // Set up periodic refresh (every 60 seconds)
    const intervalId = setInterval(fetchPrices, 60000);
    
    return () => clearInterval(intervalId);
  }, [tokenIds.join(','), currency]);

  return { prices, loading, error };
};

export default useTokenPrice; 