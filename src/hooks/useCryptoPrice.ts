import { useState, useEffect } from 'react';
import axios from 'axios';

interface PriceResponse {
  [id: string]: {
    usd: number;
  };
}

/**
 * Custom hook để lấy giá cryptocurrency theo thời gian thực
 * @param coinIds Mảng các ID coin từ CoinGecko (vd: "bitcoin", "ethereum")
 * @returns Object chứa giá và trạng thái loading
 */
const useCryptoPrice = (coinIds: string[]) => {
  const [prices, setPrices] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Tạo chuỗi IDs cho params
        const idsParam = coinIds.join(',');
        
        // Call CoinGecko API
        const response = await axios.get<PriceResponse>(
          `https://api.coingecko.com/api/v3/simple/price`,
          {
            params: {
              ids: idsParam,
              vs_currencies: 'usd'
            }
          }
        );
        
        // Xử lý response thành object giá đơn giản
        const priceData: {[key: string]: number} = {};
        
        for (const id of coinIds) {
          if (response.data[id]) {
            priceData[id] = response.data[id].usd;
          }
        }
        
        setPrices(priceData);
      } catch (err) {
        console.error('Error fetching crypto prices:', err);
        setError('Failed to fetch crypto prices');
        
        // Fallback to default prices in case of error
        const fallbackPrices: {[key: string]: number} = {};
        coinIds.forEach(id => {
          fallbackPrices[id] = id === 'ethereum' ? 1800 : 1;
        });
        setPrices(fallbackPrices);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();

    // Refresh giá mỗi 60 giây
    const interval = setInterval(fetchPrices, 60000);
    
    return () => clearInterval(interval);
  }, [coinIds.join(',')]);

  return { prices, loading, error };
};

export default useCryptoPrice; 