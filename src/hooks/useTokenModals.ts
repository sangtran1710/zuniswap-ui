import { useState, useCallback, useEffect } from 'react';
import { Token } from '../types';
import useCryptoPrice from './useCryptoPrice';

// Map token symbol tới CoinGecko ID
const TOKEN_ID_MAP: Record<string, string> = {
  'ETH': 'ethereum',
  'USDC': 'usd-coin',
  'BTC': 'bitcoin',
  'DAI': 'dai',
  'USDT': 'tether'
};

// Danh sách token mặc định 
const defaultFromToken: Token = {
  name: 'Ethereum',
  symbol: 'ETH',
  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  logoUrl: '/tokens/eth.png',
  logoURI: '/tokens/eth.png',
  balance: '1.245',
  price: 1800
};

const defaultToToken: Token = {
  name: 'USD Coin',
  symbol: 'USDC',
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  logoUrl: '/tokens/usdc.png',
  logoURI: '/tokens/usdc.png',
  balance: '350.75',
  price: 1
};

const useTokenModals = () => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [activeTokenField, setActiveTokenField] = useState<'from' | 'to'>('from');
  const [selectedFromToken, setSelectedFromToken] = useState<Token | null>(defaultFromToken);
  const [selectedToToken, setSelectedToToken] = useState<Token | null>(defaultToToken);

  // Fetch giá realtime
  const coinIds = [
    TOKEN_ID_MAP[defaultFromToken.symbol], 
    TOKEN_ID_MAP[defaultToToken.symbol]
  ].filter(Boolean);
  
  const { prices, loading } = useCryptoPrice(coinIds);

  // Cập nhật giá khi có dữ liệu mới từ API
  useEffect(() => {
    if (!loading && Object.keys(prices).length > 0) {
      // Cập nhật giá ETH
      if (selectedFromToken?.symbol === 'ETH' && prices['ethereum']) {
        setSelectedFromToken(prev => prev ? {
          ...prev,
          price: prices['ethereum']
        } : null);
      }

      // USDC luôn có giá là 1 USD
      if (selectedToToken?.symbol === 'USDC') {
        setSelectedToToken(prev => prev ? {
          ...prev,
          price: 1  // USDC luôn là 1 USD
        } : null);
      }
    }
  }, [prices, loading]);

  const openTokenModal = useCallback(() => {
    setIsTokenModalOpen(true);
  }, []);

  const closeTokenModal = useCallback(() => {
    setIsTokenModalOpen(false);
  }, []);

  const swapTokens = useCallback(() => {
    setSelectedFromToken(prevFromToken => {
      setSelectedToToken(prevToToken => {
        return prevFromToken;
      });
      return selectedToToken;
    });
  }, [selectedToToken]);

  return {
    isTokenModalOpen,
    openTokenModal,
    closeTokenModal,
    selectedFromToken,
    selectedToToken,
    setSelectedFromToken,
    setSelectedToToken,
    activeTokenField,
    setActiveTokenField,
    swapTokens,
    priceLoading: loading
  };
};

export default useTokenModals; 