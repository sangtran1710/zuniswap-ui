import { useState, useEffect } from 'react';
import axios from 'axios';

interface TokenPrice {
  [key: string]: { [key: string]: number };
}

// CoinGecko free API không yêu cầu API key
// Nếu bạn có API key Pro, bạn có thể thêm vào đây
const USE_MOCK_DATA = true; // Set to false to use real API

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

        // Nếu sử dụng mock data, không gọi API thực
        if (USE_MOCK_DATA) {
          throw new Error('Using mock data instead of real API');
        }
        
        // Sử dụng CoinGecko API miễn phí (không cần API key)
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds.join(',')}&vs_currencies=${currency}`,
          {
            timeout: 5000 // Timeout sau 5 giây
          }
        );

        // Kiểm tra response
        if (!response.data) {
          throw new Error('Empty response from CoinGecko API');
        }
        
        setPrices(response.data);
      } catch (err) {
        console.error('Error fetching token prices:', err);
        setError('Failed to fetch token prices');
        
        console.log('Sử dụng dữ liệu mẫu cho giá token');
        // Fallback to mock data in case of API error
        const mockPrices: TokenPrice = {};
        tokenIds.forEach((id) => {
          if (id === 'ethereum') mockPrices[id] = { usd: 3000 };
          else if (id === 'bitcoin') mockPrices[id] = { usd: 60000 };
          else if (id === 'usd-coin') mockPrices[id] = { usd: 1 };
          else if (id === 'dai') mockPrices[id] = { usd: 1 };
          else if (id === 'tether') mockPrices[id] = { usd: 1 };
          else if (id === 'binancecoin') mockPrices[id] = { usd: 500 };
          else if (id === 'ripple') mockPrices[id] = { usd: 0.5 };
          else if (id === 'cardano') mockPrices[id] = { usd: 0.4 };
          else if (id === 'solana') mockPrices[id] = { usd: 120 };
          else if (id === 'polkadot') mockPrices[id] = { usd: 6 };
          else mockPrices[id] = { usd: 1 };
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