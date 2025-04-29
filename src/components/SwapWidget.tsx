import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

// ETH SVG logo component to ensure visibility
const EthLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="12" cy="12" r="12" fill="#627EEA"/>
    <path d="M12.3735 5.25V9.6579L16.0211 11.2793L12.3735 5.25Z" fill="white" fillOpacity="0.602"/>
    <path d="M12.3735 5.25L8.72595 11.2793L12.3735 9.6579V5.25Z" fill="white"/>
    <path d="M12.3735 16.4171V19.4999L16.0248 13.1816L12.3735 16.4171Z" fill="white" fillOpacity="0.602"/>
    <path d="M12.3735 19.4999V16.4171L8.72595 13.1816L12.3735 19.4999Z" fill="white"/>
    <path d="M12.3735 15.4527L16.0211 12.2172L12.3735 10.5994V15.4527Z" fill="white" fillOpacity="0.2"/>
    <path d="M8.72595 12.2172L12.3735 15.4527V10.5994L8.72595 12.2172Z" fill="white" fillOpacity="0.602"/>
  </svg>
);

const SwapWidget: React.FC = () => {
  // Không sử dụng t nhưng giữ lại để tương thích với các phần khác
  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [widgetWidth, setWidgetWidth] = useState(480);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [activeTokenField, setActiveTokenField] = useState<'sell' | 'buy'>('sell');
  
  // Handle responsive changes
  useEffect(() => {
    const handleResize = () => {
      const cssWidgetWidth = getComputedStyle(document.documentElement).getPropertyValue('--widget-width').trim();
      if (cssWidgetWidth) {
        const newWidth = parseInt(cssWidgetWidth) || 480;
        setWidgetWidth(newWidth);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
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
    } else if (value >= 1) {
      return `$${value.toFixed(2)}`;
    } else if (value >= 0.01) {
      return `$${value.toFixed(4)}`;
    } else {
      return `$${value.toFixed(6)}`;
    }
  };
  
  // Xử lý khi thay đổi giá trị bán
  const handleSellAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value.replace(/[^0-9.]/g, '');
    setSellAmount(newAmount);
    
    // Tính giá trị USD
    const usdValue = calculateUSDValue(newAmount, sellToken.symbol);
    setSellValueUSD(usdValue);
    
    // Quy đổi sang token mua nếu đã chọn
    if (buyToken) {
      const convertedAmount = convertTokenValue(newAmount, sellToken.symbol, buyToken.symbol);
      setBuyAmount(convertedAmount);
      
      // Cập nhật giá trị USD của token mua
      const buyUsdValue = calculateUSDValue(convertedAmount, buyToken.symbol);
      setBuyValueUSD(buyUsdValue);
    }
  };
  
  // Xử lý khi thay đổi giá trị mua
  const handleBuyAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value.replace(/[^0-9.]/g, '');
    setBuyAmount(newAmount);
    
    // Tính giá trị USD
    if (buyToken) {
      const usdValue = calculateUSDValue(newAmount, buyToken.symbol);
      setBuyValueUSD(usdValue);
      
      // Quy đổi ngược lại token bán
      const convertedAmount = convertTokenValue(newAmount, buyToken.symbol, sellToken.symbol);
      setSellAmount(convertedAmount);
      
      // Cập nhật giá trị USD của token bán
      const sellUsdValue = calculateUSDValue(convertedAmount, sellToken.symbol);
      setSellValueUSD(sellUsdValue);
    }
  };
  
  // Hàm xử lý khi chọn token
  const handleSelectToken = (token: any) => {
    if (activeTokenField === 'sell') {
      setSellToken(token);
      
      // Cập nhật giá trị USD và quy đổi
      if (sellAmount) {
        const usdValue = calculateUSDValue(sellAmount, token.symbol);
        setSellValueUSD(usdValue);
        
        if (buyToken) {
          const convertedAmount = convertTokenValue(sellAmount, token.symbol, buyToken.symbol);
          setBuyAmount(convertedAmount);
          
          const buyUsdValue = calculateUSDValue(convertedAmount, buyToken.symbol);
          setBuyValueUSD(buyUsdValue);
        }
      }
    } else {
      setBuyToken(token);
      
      // Cập nhật giá trị quy đổi
      if (sellAmount) {
        const convertedAmount = convertTokenValue(sellAmount, sellToken.symbol, token.symbol);
        setBuyAmount(convertedAmount);
        
        const buyUsdValue = calculateUSDValue(convertedAmount, token.symbol);
        setBuyValueUSD(buyUsdValue);
      }
    }
    setIsTokenModalOpen(false);
  };
  
  // Hàm mở modal chọn token
  const openTokenModal = (field: 'sell' | 'buy') => {
    setActiveTokenField(field);
    setIsTokenModalOpen(true);
  };
  
  // Hàm đảo chiều token và giá trị
  const handleSwapDirection = () => {
    // Lưu trữ giá trị hiện tại
    const tempToken = sellToken;
    const tempAmount = sellAmount;
    const tempValueUSD = sellValueUSD;
    
    // Đảo token
    setSellToken(buyToken || tempToken);
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
    <div 
      id="swap-widget" 
      className={`swap-widget-container relative z-10 mx-auto p-4 rounded-[24px] transition-all duration-300 ease-in-out 
                 bg-white border border-gray-200 shadow-sm`}
      style={{ width: `${widgetWidth}px` }} 
    >
      {/* Sell Section */}
      <div 
        className={`p-4 rounded-[16px] mb-1 border 
                   bg-gray-50 border-gray-200`}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">Sell</span>
          <input
            type="text"
            value={sellAmount}
            onChange={handleSellAmountChange}
            placeholder="0"
            className={`token-input w-full bg-transparent border-none outline-none text-[36px] font-normal leading-[44px] placeholder-gray-400 
                       text-gray-900`}
          />
          {/* Token Selector Button */}
          <button 
            onClick={() => openTokenModal('sell')} 
            className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors duration-200 
                       bg-pink-50 hover:bg-pink-100 text-pink-600`}
          >
            {sellToken.logo === '/token-logos/eth.png' ? (
              <EthLogo />
            ) : (
              <img src={sellToken.logoURI || sellToken.logo} alt={sellToken.symbol} className="w-6 h-6 rounded-full" />
            )}
            <span className="font-medium text-lg whitespace-nowrap">{sellToken.symbol}</span>
            <ChevronDownIcon className="w-5 h-5 text-current" />
          </button>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{sellValueUSD}</span>
          <span>Balance: 0</span>
        </div>
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center my-[-14px] z-20 relative">
        <button 
          onClick={handleSwapDirection}
          className={`p-2 rounded-xl border transition-colors 
                     bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-500`}
        >
          <ArrowDownIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Buy Section */}
      <div 
        className={`p-4 rounded-[16px] 
                   bg-gray-50 border border-gray-200`}
      >
       <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">Buy</span>
          <input
            type="text"
            value={buyAmount}
            onChange={handleBuyAmountChange}
            placeholder="0"
            className={`token-input w-full bg-transparent border-none outline-none text-[36px] font-normal leading-[44px] placeholder-gray-400 
                       text-gray-900`}
          />
          {/* Token Selector Button */}
          <button 
            onClick={() => openTokenModal('buy')} 
            className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors duration-200 whitespace-nowrap ${ 
              buyToken 
                ? 'bg-pink-50 hover:bg-pink-100 text-pink-600' 
                : 'bg-pink-500 hover:bg-pink-600 text-white' 
            }`}
          >
            {buyToken ? (
              <>
                {buyToken.logo === '/token-logos/eth.png' ? (
                  <EthLogo />
                ) : (
                  <img src={buyToken.logoURI || buyToken.logo} alt={buyToken.symbol} className="w-6 h-6 rounded-full" />
                )}
                <span className="font-medium text-lg">{buyToken.symbol}</span>
              </>
            ) : (
              <span>Select Token</span>
            )}
            <ChevronDownIcon className="w-5 h-5 text-current" />
          </button>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{buyValueUSD}</span>
        </div>
      </div>

      {/* Get Started Button */}
      <button 
        className={`w-full mt-4 p-4 rounded-[16px] text-lg font-semibold transition-colors duration-200 
                   bg-pink-100 hover:bg-pink-200 text-pink-700`}
      >
        Get started
      </button>
      
      {/* Token Selection Modal */}
      {isTokenModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#0D111C] rounded-2xl max-w-md w-full border border-[#3A3F50]">
            <div className="p-4 border-b border-[#3A3F50] flex justify-between items-center">
              <h2 className="text-white text-lg font-medium">Select a token</h2>
              <button onClick={() => setIsTokenModalOpen(false)} className="text-gray-400 hover:text-white">
                &times;
              </button>
            </div>
            <div className="p-4">
              <p className="text-white">Token List would go here...</p>
              <button onClick={() => handleSelectToken({symbol: 'USDC', name: 'USD Coin', logoURI: '...', price: 1.00})} className="text-white block w-full text-left p-2 hover:bg-gray-700 rounded">
                USDC
              </button>
              {/* Add back your actual token list rendering here */} 
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapWidget;