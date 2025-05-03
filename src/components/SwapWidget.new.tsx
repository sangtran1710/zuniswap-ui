import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import './SearchInput.css';
import './ButtonEffects.css';
import TokenIcon from './TokenIcons';
import TokenSelectorModal from './TokenSelectorModal';

// Uniswap Token List fetch logic
const UNISWAP_TOKEN_LIST = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org';
const POPULAR_SYMBOLS = ['ETH','USDC','USDT','WBTC','WETH'];

// Hardcoded token images to ensure they always display correctly
const TOKEN_LOGOS = {
  'ETH': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  'USDC': 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
  'USDT': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  'WBTC': 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
  'WETH': 'https://assets.coingecko.com/coins/images/2518/small/weth.png'
};

const SwapWidget: React.FC = () => {
  // State and logic must be inside the component
  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [activeTokenField, setActiveTokenField] = useState<'sell' | 'buy'>('sell');
  const [tokenList, setTokenList] = useState<any[]>([]);
  const [popularTokens, setPopularTokens] = useState<any[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [tokenFetchError, setTokenFetchError] = useState<string | null>(null);

  // Token price data
  const tokenPrices = {
    ETH: 1770.72,
    USDC: 1.00,
    USDT: 1.00,
    WBTC: 91040.63,
    WETH: 1770.72,
    DAI: 1.00,
    BUSD: 1.00
  };
  
  // Tokens for display
  const [sellToken, setSellToken] = useState({
    symbol: 'ETH',
    name: 'Ethereum',
    logo: '/token-logos/eth.png',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    price: tokenPrices.ETH,
    priceChangePercentage24h: -1.43
  });
  
  const [buyToken, setBuyToken] = useState<any>(null);
  
  // Calculated USD values
  const [sellValueUSD, setSellValueUSD] = useState('$0.00');
  const [buyValueUSD, setBuyValueUSD] = useState('$0.00');
  
  // Hàm quy đổi giá trị giữa các token
  const convertTokenValue = (amount: string, fromToken: string, toToken: string) => {
    if (!amount || isNaN(parseFloat(amount))) return '';
    
    const fromPrice = tokenPrices[fromToken as keyof typeof tokenPrices] || 0;
    const toPrice = tokenPrices[toToken as keyof typeof tokenPrices] || 0;
    
    if (fromPrice === 0 || toPrice === 0) return '';
    
    // Tính tỷ giá và quy đổi
    const rate = fromPrice / toPrice;
    const convertedAmount = parseFloat(amount) * rate;
    
    // Làm tròn số thập phân dựa trên giá trị
    if (convertedAmount > 1000) {
      return convertedAmount.toFixed(2);
    } else if (convertedAmount > 1) {
      return convertedAmount.toFixed(4);
    } else if (convertedAmount > 0.0001) {
      return convertedAmount.toFixed(6);
    } else {
      return convertedAmount.toExponential(4);
    }
  };
  
  // Hàm tính giá trị USD
  const calculateUSDValue = (amount: string, tokenSymbol: string) => {
    if (!amount || isNaN(parseFloat(amount))) return '$0.00';
    
    const price = tokenPrices[tokenSymbol as keyof typeof tokenPrices] || 0;
    const value = parseFloat(amount) * price;
    
    // Định dạng giá trị USD
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };
  
  // Xử lý khi thay đổi giá trị bán
  const handleSellAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Chỉ chấp nhận số và dấu chấm
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setSellAmount(value);
      
      // Tính giá trị USD
      setSellValueUSD(calculateUSDValue(value, sellToken.symbol));
      
      // Tính giá trị token mua tương ứng
      if (buyToken) {
        const convertedValue = convertTokenValue(value, sellToken.symbol, buyToken.symbol);
        setBuyAmount(convertedValue);
        setBuyValueUSD(calculateUSDValue(convertedValue, buyToken.symbol));
      }
    }
  };
  
  // Xử lý khi thay đổi giá trị mua
  const handleBuyAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Chỉ chấp nhận số và dấu chấm
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setBuyAmount(value);
      
      // Tính giá trị USD
      if (buyToken) {
        setBuyValueUSD(calculateUSDValue(value, buyToken.symbol));
      }
      
      // Tính giá trị token bán tương ứng
      if (buyToken) {
        const convertedValue = convertTokenValue(value, buyToken.symbol, sellToken.symbol);
        setSellAmount(convertedValue);
        setSellValueUSD(calculateUSDValue(convertedValue, sellToken.symbol));
      }
    }
  };
  
  // Hàm xử lý khi chọn token
  const handleSelectToken = (token: any) => {
    if (activeTokenField === 'sell') {
      setSellToken({
        symbol: token.symbol,
        name: token.name,
        logo: token.logoURI,
        address: token.address,
        logoURI: token.logoURI,
        price: tokenPrices[token.symbol as keyof typeof tokenPrices] || 0,
        priceChangePercentage24h: -1.43
      });
      
      // Cập nhật giá trị USD
      setSellValueUSD(calculateUSDValue(sellAmount, token.symbol));
      
      // Cập nhật giá trị token mua tương ứng
      if (buyToken) {
        const convertedValue = convertTokenValue(sellAmount, token.symbol, buyToken.symbol);
        setBuyAmount(convertedValue);
        setBuyValueUSD(calculateUSDValue(convertedValue, buyToken.symbol));
      }
    } else {
      setBuyToken({
        symbol: token.symbol,
        name: token.name,
        logo: token.logoURI,
        address: token.address,
        logoURI: token.logoURI,
        price: tokenPrices[token.symbol as keyof typeof tokenPrices] || 0,
        priceChangePercentage24h: -1.43
      });
      
      // Cập nhật giá trị USD
      setBuyValueUSD(calculateUSDValue(buyAmount, token.symbol));
      
      // Cập nhật giá trị token bán tương ứng
      const convertedValue = convertTokenValue(buyAmount, token.symbol, sellToken.symbol);
      setSellAmount(convertedValue);
      setSellValueUSD(calculateUSDValue(convertedValue, sellToken.symbol));
    }
    
    // Đóng modal
    setIsTokenModalOpen(false);
  };
  
  // Hàm mở modal chọn token
  const openTokenModal = (field: 'sell' | 'buy') => {
    setActiveTokenField(field);
    setIsTokenModalOpen(true);
  };
  
  // Hàm đảo chiều token và giá trị
  const handleSwapDirection = () => {
    // Lưu tạm giá trị
    const tempToken = sellToken;
    const tempAmount = sellAmount;
    const tempValueUSD = sellValueUSD;
    
    // Đảo token
    setSellToken({
      symbol: buyToken ? buyToken.symbol : 'USDC',
      name: buyToken ? buyToken.name : 'USD Coin',
      logo: buyToken ? buyToken.logo : '/token-logos/usdc.png',
      address: buyToken ? buyToken.address : '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      logoURI: buyToken ? buyToken.logoURI : 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
      price: buyToken ? buyToken.price : tokenPrices.USDC,
      priceChangePercentage24h: buyToken ? buyToken.priceChangePercentage24h : 0
    });
    
    if (buyToken) {
      setBuyToken(tempToken);
    }
    
    // Đảo giá trị
    setSellAmount(buyAmount);
    setBuyAmount(tempAmount);
    
    // Đảo giá trị USD
    setSellValueUSD(buyValueUSD);
    setBuyValueUSD(tempValueUSD);
  };
  
  return (
    <div id="zuniswap-widget" className="relative z-20 swap-widget-container" style={{ position: 'relative', zIndex: 20 }}>
      <div className="max-w-md mx-auto relative z-10">
        <div className="bg-white dark:bg-[#131A2A] rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
        {/* Sell Section - Updated to match Uniswap */}
        <div className="bg-white dark:bg-[#131A2A] p-4 relative">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-[#666666] dark:text-[#7D85A5]">Sell</span>
          </div>
          <div className="flex items-center justify-between relative h-12"> {/* Main Input Row */} 
            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={sellAmount}
              onChange={handleSellAmountChange}
              className="text-[36px] font-semibold text-black dark:text-white bg-transparent border-none outline-none focus:ring-0 w-full placeholder-gray-400 dark:placeholder-gray-600 pr-28"
            />
            {/* Token Selector Button - Improved Uniswap style */} 
            <button 
              onClick={() => openTokenModal('sell')}
              className="absolute right-0 flex items-center bg-[#F9F9F9] hover:bg-[#EDEEF2] dark:bg-[#212429] dark:hover:bg-[#2C2F36] rounded-[20px] h-10 px-3 justify-center transition-colors gap-2 border border-[#E8E9EA] dark:border-[#40444F]"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-[#627EEA] shadow-sm">
                <TokenIcon symbol="ETH" className="w-6 h-6" />
              </div>
              <span className="text-[16px] font-medium text-black dark:text-white">{sellToken.symbol}</span>
              <ChevronDownIcon className="w-5 h-5 text-[#7D85A5]" />
            </button>
          </div>
          <div className="text-sm text-[#666666] dark:text-[#7D85A5] mt-0.5">
            {sellValueUSD}
          </div>
        </div>

        {/* Divider with Swap Button */}
        <div className="relative z-10">
          <div className="border-t border-[#EEEEEE] dark:border-[#252525]"></div>
          <button 
            onClick={handleSwapDirection}
            className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white dark:bg-[#131A2A] border border-[#EEEEEE] dark:border-[#252525] flex items-center justify-center hover:bg-[#F9F9F9] dark:hover:bg-[#212429] transition-colors"
          >
            <ArrowsUpDownIcon className="w-5 h-5 text-[#7D85A5]" />
          </button>
        </div>

        {/* Buy Section - Updated to match Uniswap */}
        <div className="bg-white dark:bg-[#131A2A] p-4 relative">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-[#666666] dark:text-[#7D85A5]">Buy</span>
          </div>
          <div className="flex items-center justify-between relative h-12"> {/* Main Input Row */}
            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={buyAmount}
              onChange={handleBuyAmountChange}
              className="text-[36px] font-semibold text-black dark:text-white bg-transparent border-none outline-none focus:ring-0 w-full placeholder-gray-400 dark:placeholder-gray-600 pr-28"
            />
            {/* Token Selector Button - Improved Uniswap style */}
            <button 
              onClick={() => openTokenModal('buy')}
              className="absolute right-0 flex items-center bg-[#F9F9F9] hover:bg-[#EDEEF2] dark:bg-[#212429] dark:hover:bg-[#2C2F36] rounded-[20px] h-10 px-3 justify-center transition-colors gap-2 border border-[#E8E9EA] dark:border-[#40444F]"
            >
              {buyToken ? (
                <>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-[#627EEA] shadow-sm">
                    <TokenIcon symbol={buyToken.symbol} className="w-6 h-6" />
                  </div>
                  <span className="text-[16px] font-medium text-black dark:text-white">{buyToken.symbol}</span>
                </>
              ) : (
                <span className="text-[16px] font-medium text-[#2172E5] dark:text-[#4C82FB]">Select token</span>
              )}
              <ChevronDownIcon className="w-5 h-5 text-[#7D85A5]" />
            </button>
          </div>
          <div className="text-sm text-[#666666] dark:text-[#7D85A5] mt-0.5">
            {buyValueUSD}
          </div>
        </div>

        {/* Get Started Button - Updated with gradient and shimmer effect */}
        <div className="p-4 pt-0">
          <button 
            className="gradient-button shimmer-effect"
          >
            Get started
          </button>
        </div>
      </div>

      {/* Descriptive text - matches Uniswap */}
      <div className="text-center mt-4 text-sm text-[#666666] dark:text-[#7D85A5]">
        The largest onchain marketplace. Buy and sell crypto on<br /> 
        Ethereum and 11+ other chains.
      </div>
        
        {/* Token Selection Modal - Sử dụng component mới */}
        <TokenSelectorModal 
          isOpen={isTokenModalOpen}
          onClose={() => setIsTokenModalOpen(false)}
          onSelectToken={handleSelectToken}
          from="swap"
        />
      </div>
    </div>
  );
};

export default SwapWidget;
