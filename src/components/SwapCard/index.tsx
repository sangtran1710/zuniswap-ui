import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, Cog6ToothIcon, ArrowsUpDownIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import TokenSelector from '../TokenSelector';
import TokenModal from '../TokenModal';
import useTokenModals from '../../hooks/useTokenModals';
import { Token } from '../../types';
import SettingsModal from '../SettingsModal';
import { theme } from '../../styles/theme';

// Tab type
type TabType = 'swap' | 'limit' | 'send' | 'buy';

// Add props interface
interface SwapCardProps {
  initialActiveTab?: TabType;
}

const SwapCard = ({ initialActiveTab = 'swap' }: SwapCardProps) => {
  const { t } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // Active tab state - initialize with prop
  const [activeTab, setActiveTab] = useState<TabType>(initialActiveTab);
  
  const {
    selectedFromToken,
    selectedToToken,
    isTokenModalOpen,
    openTokenModal,
    closeTokenModal,
    setActiveTokenField,
    setSelectedFromToken,
    setSelectedToToken,
    activeTokenField,
    swapTokens,
    priceLoading
  } = useTokenModals();
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [fromUsdValue, setFromUsdValue] = useState<string>('0.00');
  const [toUsdValue, setToUsdValue] = useState<string>('0.00');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [deadline, setDeadline] = useState(30);
  const [selectingForFrom, setSelectingForFrom] = useState(true);

  // Tính tỷ giá chuyển đổi (exchange rate)
  const getExchangeRate = () => {
    if (!selectedFromToken || !selectedToToken) return 1;
    
    // Nếu token bán là ETH và mua là USDC, lấy giá ETH/USDC
    if (selectedFromToken.symbol === 'ETH' && selectedToToken.symbol === 'USDC') {
      return selectedFromToken.price; // Vì USDC có giá 1, nên tỷ giá = giá ETH
    }
    
    // Nếu token bán là USDC và mua là ETH, lấy tỷ lệ USDC/ETH
    if (selectedFromToken.symbol === 'USDC' && selectedToToken.symbol === 'ETH') {
      return 1 / selectedToToken.price; // Tỷ lệ ngược lại
    }
    
    // Trường hợp khác, sử dụng công thức cũ
    return selectedToToken.price / selectedFromToken.price;
  };

  // Tính toán giá trị USD
  const calculateUsdValue = (amount: string, tokenPrice: number) => {
    const numericAmount = parseFloat(amount) || 0;
    const usdValue = numericAmount * tokenPrice;
    return usdValue.toFixed(2);
  };

  // Cập nhật giá trị USD khi số lượng hoặc giá token thay đổi
  useEffect(() => {
    if (selectedFromToken) {
      setFromUsdValue(calculateUsdValue(fromAmount, selectedFromToken.price));
    }
    if (selectedToToken) {
      setToUsdValue(calculateUsdValue(toAmount, selectedToToken.price));
    }
  }, [fromAmount, toAmount, selectedFromToken, selectedToToken]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Chỉ cho phép nhập số và dấu chấm
    const value = e.target.value.replace(/[^0-9.]/g, '');
    // Ngăn chặn nhiều dấu chấm
    const formattedValue = value.replace(/(\..*)\./g, '$1');
    
    setFromAmount(formattedValue);
    
    const numeric = parseFloat(formattedValue) || 0;
    // Sử dụng tỷ giá thực từ token
    const exchangeRate = getExchangeRate();
    setToAmount(numeric ? (numeric * exchangeRate).toString() : '');
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Chỉ cho phép nhập số và dấu chấm
    const value = e.target.value.replace(/[^0-9.]/g, '');
    // Ngăn chặn nhiều dấu chấm
    const formattedValue = value.replace(/(\..*)\./g, '$1');
    
    setToAmount(formattedValue);
    
    const numeric = parseFloat(formattedValue) || 0;
    // Sử dụng tỷ giá thực từ token
    const exchangeRate = getExchangeRate();
    setFromAmount(numeric ? (numeric / exchangeRate).toString() : '');
  };

  const handleSwapTokens = () => {
    swapTokens();
    const temp = fromAmount;
    setFromAmount(toAmount);
    setToAmount(temp);
    // Cũng swap giá trị USD
    const tempUsd = fromUsdValue;
    setFromUsdValue(toUsdValue);
    setToUsdValue(tempUsd);
  };

  const handleTokenClick = (field: 'from' | 'to') => {
    setActiveTokenField(field);
    openTokenModal();
  };

  const handleSelectToken = (token: Token) => {
    activeTokenField === 'from'
      ? setSelectedFromToken(token)
      : setSelectedToToken(token);
    closeTokenModal();
  };

  const getSelected = () =>
    activeTokenField === 'from' ? selectedFromToken || undefined : selectedToToken || undefined;

  const handleSwap = () => {
    // Implementation of handleSwap function
    console.log('Swap executed with settings:', {
      fromToken: selectedFromToken?.symbol,
      toToken: selectedToToken?.symbol,
      fromAmount,
      toAmount,
      slippage,
      deadline
    });
  };

  // Tab content components
  const SwapContent = () => (
    <>
      {/* From Input Group */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>{t('swap.from')}</label>
        </div>
        
        <div className="flex w-full bg-[#131A2A] rounded-2xl p-1">
          <div className="flex-grow">
            <input
              type="text"
              value={fromAmount}
              onChange={handleFromAmountChange}
              placeholder="0.0"
              className={`
                w-full h-12 px-3
                bg-transparent
                ${theme.font.size.tokenAmount} ${theme.font.family} font-medium
                ${theme.colors.text.primary}
                focus:outline-none focus:ring-0 focus:border-transparent
                outline-none border-none
              `}
              inputMode="decimal"
            />
            {fromUsdValue && (
              <div className="px-3 pb-1">
                <span className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
                  ≈ ${fromUsdValue}
                </span>
              </div>
            )}
          </div>
          
          <TokenSelector
            token={selectedFromToken}
            onTokenClick={() => { handleTokenClick('from'); setSelectingForFrom(true); }}
            className="self-start my-1 mr-1"
          />
        </div>
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center -my-1">
        <button
          onClick={handleSwapTokens}
          className="
            flex items-center justify-center
            w-8 h-8 rounded-full
            bg-[#1C2537] hover:bg-[#252d3f]
            shadow-lg z-10
            transition-colors
          "
          aria-label={t('swap.switchDirection')}
        >
          <ArrowsUpDownIcon className="w-4 h-4 text-blue-500" />
        </button>
      </div>

      {/* To Input Group */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>{t('swap.to')}</label>
        </div>
        
        <div className="flex w-full bg-[#131A2A] rounded-2xl p-1">
          <div className="flex-grow">
            <input
              type="text"
              value={toAmount}
              onChange={handleToAmountChange}
              placeholder="0.0"
              className={`
                w-full h-12 px-3
                bg-transparent
                ${theme.font.size.tokenAmount} ${theme.font.family} font-medium
                ${theme.colors.text.primary}
                focus:outline-none focus:ring-0 focus:border-transparent
                outline-none border-none
              `}
              inputMode="decimal"
            />
            {toUsdValue && (
              <div className="px-3 pb-1">
                <span className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
                  ≈ ${toUsdValue}
                </span>
              </div>
            )}
          </div>
          
          <TokenSelector
            token={selectedToToken}
            onTokenClick={() => { handleTokenClick('to'); setSelectingForFrom(false); }}
            className="self-start my-1 mr-1"
          />
        </div>
      </div>

      {/* Exchange Rate */}
      {selectedFromToken && selectedToToken && fromAmount && toAmount && (
        <div className="flex justify-between items-center px-2 py-2 rounded-lg bg-[#131A2A] mt-2">
          <span className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
            {t('swap.rate')}
          </span>
          <span className={`${theme.font.size.label} ${theme.colors.text.primary}`}>
            1 {selectedFromToken.symbol} ≈ {getExchangeRate().toFixed(6)} {selectedToToken.symbol}
          </span>
        </div>
      )}

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={!fromAmount || !toAmount || !selectedFromToken || !selectedToToken}
        className={`
          w-full py-3 mt-2 rounded-xl
          font-semibold text-white
          ${(!fromAmount || !toAmount || !selectedFromToken || !selectedToToken)
            ? 'bg-gray-600/50 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#4338CA] to-[#60A5FA] hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all'
          }
        `}
      >
        {!selectedFromToken || !selectedToToken
          ? t('tokens.selectToken')
          : !fromAmount || !toAmount
            ? t('swap.enterAmount')
            : t('swap.swapButton')}
      </button>
    </>
  );

  // Placeholder components for other tabs
  const LimitContent = () => {
    const [priceValue, setPriceValue] = useState<string>('');
    
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9.]/g, '');
      const formattedValue = value.replace(/(\..*)\./g, '$1');
      setPriceValue(formattedValue);
    };
    
    return (
      <>
        {/* Price Header */}
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-[#A0A0A0]">
            When 1 <span className="text-white">{selectedFromToken?.symbol || 'ETH'}</span> is worth
          </div>
          <div className="flex items-center">
            <button
              className="flex items-center text-sm text-[#A0A0A0] hover:text-white"
              onClick={() => {
                if (selectedFromToken && selectedToToken) {
                  setPriceValue(getExchangeRate().toFixed(2));
                }
              }}
              aria-label="Use current market price"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{selectedToToken?.symbol || 'USDC'}</span>
            </button>
          </div>
        </div>
        
        {/* Price Input */}
        <div className="mb-4">
          <div className="flex w-full bg-[#131A2A] rounded-2xl p-3">
            <input
              type="text"
              value={priceValue}
              onChange={handlePriceChange}
              placeholder="0.00"
              className="w-full bg-transparent text-[28px] text-white font-medium focus:outline-none"
              inputMode="decimal"
            />
          </div>
        </div>
        
        {/* Market/Price Options */}
        <div className="flex gap-2 mb-4">
          <button className="px-3 py-1.5 bg-[#131A2A] rounded-full text-sm font-medium text-white">
            Market
          </button>
          <button className="px-3 py-1.5 bg-[#131A2A] rounded-full text-sm font-medium text-[#A0A0A0] hover:text-white">
            +1%
          </button>
          <button className="px-3 py-1.5 bg-[#131A2A] rounded-full text-sm font-medium text-[#A0A0A0] hover:text-white">
            +5%
          </button>
          <button className="px-3 py-1.5 bg-[#131A2A] rounded-full text-sm font-medium text-[#A0A0A0] hover:text-white">
            +10%
          </button>
        </div>
        
        {/* Sell Section */}
        <div className="mb-1">
          <div className="text-sm text-[#A0A0A0] mb-2">Sell</div>
          <div className="flex w-full bg-[#131A2A] rounded-2xl p-3">
            <input
              type="text"
              value={fromAmount}
              onChange={handleFromAmountChange}
              placeholder="0"
              className="w-full bg-transparent text-[28px] text-white font-medium focus:outline-none"
              inputMode="decimal"
            />
            <TokenSelector
              token={selectedFromToken}
              onTokenClick={() => { handleTokenClick('from'); setSelectingForFrom(true); }}
              className="self-center"
            />
          </div>
          {selectedFromToken && (
            <div className="text-xs text-[#A0A0A0] mt-1 px-2">
              Balance: {selectedFromToken.balance || '<0.001'}
            </div>
          )}
        </div>
        
        {/* Swap Direction Button */}
        <div className="flex justify-center my-2">
          <button
            onClick={handleSwapTokens}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1C2537] hover:bg-[#252d3f] shadow-lg transition-colors"
            aria-label={t('swap.switchDirection')}
          >
            <ArrowsUpDownIcon className="w-4 h-4 text-blue-500" />
          </button>
        </div>
        
        {/* Buy Section */}
        <div className="mb-4">
          <div className="text-sm text-[#A0A0A0] mb-2">Buy</div>
          <div className="flex w-full bg-[#131A2A] rounded-2xl p-3">
            <input
              type="text"
              value={toAmount}
              onChange={handleToAmountChange}
              placeholder="0"
              className="w-full bg-transparent text-[28px] text-white font-medium focus:outline-none"
              inputMode="decimal"
            />
            <TokenSelector
              token={selectedToToken}
              onTokenClick={() => { handleTokenClick('to'); setSelectingForFrom(false); }}
              className="self-center"
            />
          </div>
        </div>
        
        {/* Expiry Options */}
        <div className="mb-4">
          <div className="text-sm text-[#A0A0A0] mb-2">Expiry</div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-[#131A2A] rounded-full text-sm font-medium text-white">
              1 day
            </button>
            <button className="px-3 py-1.5 bg-[#131A2A] rounded-full text-sm font-medium text-[#A0A0A0] hover:text-white">
              1 week
            </button>
            <button className="px-3 py-1.5 bg-[#131A2A] rounded-full text-sm font-medium text-[#A0A0A0] hover:text-white">
              1 month
            </button>
            <button className="px-3 py-1.5 bg-[#131A2A] rounded-full text-sm font-medium text-[#A0A0A0] hover:text-white">
              1 year
            </button>
          </div>
        </div>
        
        {/* Confirm Button */}
        <button
          className="w-full py-3 bg-[#7C4DFF] hover:bg-[#5B2ED9] rounded-xl text-white font-medium transition-colors mt-2"
        >
          Confirm
        </button>
        
        {/* Warning Message */}
        <div className="flex items-start mt-3 p-3 bg-[#131A2A] rounded-xl">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5 mr-2 text-yellow-500">
            <path d="M12 9V12M12 16V16.01M12 3L4 19H20L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="text-sm text-[#A0A0A0]">
            Limits may not execute exactly when tokens reach the specified price.{" "}
            <span className="text-[#7C4DFF] hover:text-[#5B2ED9] cursor-pointer">Learn more</span>
          </div>
        </div>
      </>
    );
  };

  const SendContent = () => {
    const [recipientAddress, setRecipientAddress] = useState<string>('');
    const [sendAmount, setSendAmount] = useState<string>('');
    
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRecipientAddress(e.target.value);
    };
    
    const handleSendAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9.]/g, '');
      const formattedValue = value.replace(/(\..*)\./g, '$1');
      setSendAmount(formattedValue);
    };
    
    return (
      <>
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-[#A0A0A0]">You're sending</div>
        </div>
        
        {/* Amount Input */}
        <div className="mb-4">
          <div className="w-full bg-[#131A2A] rounded-2xl p-4 text-center">
            <div className="text-[32px] text-white font-medium mb-1">
              {sendAmount ? `$${sendAmount}` : '$0'}
            </div>
            <div className="text-sm text-[#A0A0A0]">
              {sendAmount ? `${sendAmount} ${selectedFromToken?.symbol || 'ETH'}` : `0 ${selectedFromToken?.symbol || 'ETH'}`} 
            </div>
          </div>
        </div>
        
        {/* Token Selection */}
        <div className="mb-4">
          <div className="flex w-full bg-[#131A2A] rounded-2xl p-3 items-center">
            <div className="flex items-center flex-grow">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                {selectedFromToken?.symbol?.charAt(0) || 'E'}
              </div>
              <div>
                <div className="text-white">{selectedFromToken?.symbol || 'ETH'}</div>
                <div className="text-xs text-[#A0A0A0]">
                  Balance: {selectedFromToken?.balance || '<0.001'} ({selectedFromToken?.price ? `$${selectedFromToken.price.toFixed(2)}` : '$0.00'})
                </div>
              </div>
            </div>
            <button 
              onClick={() => { handleTokenClick('from'); setSelectingForFrom(true); }}
              className="text-[#A0A0A0] hover:text-white">
              <ChevronDownIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Recipient Address */}
        <div className="mb-4">
          <div className="text-sm text-[#A0A0A0] mb-2">To</div>
          <div className="flex w-full bg-[#131A2A] rounded-2xl p-3">
            <input
              type="text"
              value={recipientAddress}
              onChange={handleAddressChange}
              placeholder="Wallet address or ENS name"
              className="w-full bg-transparent text-white focus:outline-none"
            />
          </div>
        </div>
        
        {/* Amount Input */}
        <div className="mb-4">
          <div className="text-sm text-[#A0A0A0] mb-2">Amount</div>
          <div className="flex w-full bg-[#131A2A] rounded-2xl p-3">
            <input
              type="text"
              value={sendAmount}
              onChange={handleSendAmountChange}
              placeholder="0"
              className="w-full bg-transparent text-[28px] text-white font-medium focus:outline-none"
              inputMode="decimal"
            />
          </div>
        </div>
        
        {/* Send Button */}
        <button
          className="w-full py-3 bg-[#7C4DFF] hover:bg-[#5B2ED9] rounded-xl text-white font-medium transition-colors"
          disabled={!recipientAddress || !sendAmount || !selectedFromToken}
        >
          {!selectedFromToken 
            ? "Select a token" 
            : !sendAmount 
              ? "Enter an amount" 
              : !recipientAddress 
                ? "Enter recipient" 
                : "Send"}
        </button>
      </>
    );
  };

  const BuyContent = () => {
    const [buyAmount, setBuyAmount] = useState<string>('');
    
    const handleBuyAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9.]/g, '');
      const formattedValue = value.replace(/(\..*)\./g, '$1');
      setBuyAmount(formattedValue);
    };
    
    return (
      <>
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-[#A0A0A0]">You're buying</div>
          <div className="flex">
            <button className="flex items-center bg-red-500 rounded-full px-2 py-1 text-xs text-white">
              <span className="mr-1">•</span>
              USD
            </button>
          </div>
        </div>
        
        {/* Amount Input */}
        <div className="mb-4">
          <div className="w-full bg-[#131A2A] rounded-2xl p-4 text-center">
            <div className="text-[32px] text-white font-medium mb-2">
              {buyAmount ? `$${buyAmount}` : '$0'}
            </div>
          </div>
        </div>
        
        {/* Quick Amount Buttons */}
        <div className="flex gap-2 mb-4 justify-center">
          <button 
            onClick={() => setBuyAmount('100')}
            className="px-4 py-2 bg-[#131A2A] rounded-full text-sm font-medium text-white hover:bg-[#252d3f]">
            $100
          </button>
          <button 
            onClick={() => setBuyAmount('300')}
            className="px-4 py-2 bg-[#131A2A] rounded-full text-sm font-medium text-white hover:bg-[#252d3f]">
            $300
          </button>
          <button 
            onClick={() => setBuyAmount('1000')}
            className="px-4 py-2 bg-[#131A2A] rounded-full text-sm font-medium text-white hover:bg-[#252d3f]">
            $1000
          </button>
        </div>
        
        {/* Token Selection */}
        <div className="mb-6">
          <button 
            onClick={() => { handleTokenClick('to'); setSelectingForFrom(false); }}
            className="w-full py-3 flex items-center justify-center bg-[#FF69B4] hover:bg-[#FF1493] rounded-xl text-white font-medium transition-colors">
            {selectedToToken 
              ? <span className="flex items-center">
                  <span className="mr-2">{selectedToToken.symbol}</span>
                  <ChevronDownIcon className="w-5 h-5" />
                </span>
              : <span className="flex items-center">
                  Select a token
                  <ChevronDownIcon className="w-5 h-5 ml-1" />
                </span>
            }
          </button>
        </div>
        
        {/* Provider Selection */}
        <div className="mb-4">
          <div className="text-sm text-white mb-2">Choose a provider:</div>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-[#131A2A] hover:bg-[#252d3f] rounded-xl flex flex-col items-center justify-center transition-colors">
              <div className="text-white font-medium mb-1">MoonPay</div>
              <div className="text-xs text-[#A0A0A0]">Credit Card, Bank</div>
            </button>
            
            <button className="p-3 bg-[#131A2A] hover:bg-[#252d3f] rounded-xl flex flex-col items-center justify-center transition-colors">
              <div className="text-white font-medium mb-1">Transak</div>
              <div className="text-xs text-[#A0A0A0]">Apple Pay, Credit Card</div>
            </button>
          </div>
        </div>
        
        {/* Buy Button */}
        <button
          className="w-full py-3 bg-[#7C4DFF] hover:bg-[#5B2ED9] rounded-xl text-white font-medium transition-colors mt-2"
          disabled={!buyAmount || !selectedToToken}
        >
          {!selectedToToken 
            ? "Select a token" 
            : !buyAmount 
              ? "Enter an amount" 
              : "Buy Crypto"}
        </button>
      </>
    );
  };

  // Helper function to render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'swap':
        return <SwapContent />;
      case 'limit':
        return <LimitContent />;
      case 'send':
        return <SendContent />;
      case 'buy':
        return <BuyContent />;
      default:
        return <SwapContent />;
    }
  };

  // Add a custom event dispatch when tab changes
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    
    // Dispatch a custom event that the parent component can listen for
    const event = new CustomEvent('tab-change', { 
      detail: tab 
    });
    window.dispatchEvent(event);
  };

  return (
    <div className={`card bg-card ${theme.radius.card} ${theme.shadow.card} w-full max-w-md mx-auto p-3`}>
      <div className="flex flex-col gap-3">
        {/* Tab Navigation */}
        <div className="flex items-center mb-3 border-b border-[#2C2F36]">
          {(['swap', 'limit', 'send', 'buy'] as const).map((tabKey) => (
            <button
              key={tabKey}
              aria-label={`${tabKey} tab`}
              onClick={() => handleTabChange(tabKey)}
              className={`
                flex-1 py-2 text-center relative
                text-sm leading-5 font-medium transition-colors
                ${activeTab === tabKey ? 'text-white' : 'text-gray-400 hover:text-white'}
              `}
            >
              {t(`tabs.${tabKey}`, tabKey.charAt(0).toUpperCase() + tabKey.slice(1))}
              {activeTab === tabKey && (
                <span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7C4DFF]
                         origin-left scale-x-100 transition-transform duration-200"
                />
              )}
            </button>
          ))}
        </div>

        {/* Header with settings */}
        <div className="flex justify-between items-center mb-1">
          <h2 className={`text-lg ${theme.font.family} font-semibold ${theme.colors.text.primary}`}>
            {activeTab === 'swap' && t('swap.title')}
            {activeTab === 'limit' && t('limit.title', 'Limit Order')}
            {activeTab === 'send' && t('send.title', 'Send')}
            {activeTab === 'buy' && t('buy.title', 'Buy')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1C2537] hover:bg-[#252d3f] transition-colors"
              aria-label={t('common.settings')}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 122.88 122.878" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-400"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M101.589,14.7l8.818,8.819c2.321,2.321,2.321,6.118,0,8.439l-7.101,7.101 c1.959,3.658,3.454,7.601,4.405,11.752h9.199c3.283,0,5.969,2.686,5.969,5.968V69.25c0,3.283-2.686,5.969-5.969,5.969h-10.039 c-1.231,4.063-2.992,7.896-5.204,11.418l6.512,6.51c2.321,2.323,2.321,6.12,0,8.44l-8.818,8.819c-2.321,2.32-6.119,2.32-8.439,0 l-7.102-7.102c-3.657,1.96-7.601,3.456-11.753,4.406v9.199c0,3.282-2.685,5.968-5.968,5.968H53.629 c-3.283,0-5.969-2.686-5.969-5.968v-10.039c-4.063-1.232-7.896-2.993-11.417-5.205l-6.511,6.512c-2.323,2.321-6.12,2.321-8.441,0 l-8.818-8.818c-2.321-2.321-2.321-6.118,0-8.439l7.102-7.102c-1.96-3.657-3.456-7.6-4.405-11.751H5.968 C2.686,72.067,0,69.382,0,66.099V53.628c0-3.283,2.686-5.968,5.968-5.968h10.039c1.232-4.063,2.993-7.896,5.204-11.418l-6.511-6.51 c-2.321-2.322-2.321-6.12,0-8.44l8.819-8.819c2.321-2.321,6.118-2.321,8.439,0l7.101,7.101c3.658-1.96,7.601-3.456,11.753-4.406 V5.969C50.812,2.686,53.498,0,56.78,0h12.471c3.282,0,5.968,2.686,5.968,5.969v10.036c4.064,1.231,7.898,2.992,11.422,5.204 l6.507-6.509C95.471,12.379,99.268,12.379,101.589,14.7L101.589,14.7z M61.44,36.92c13.54,0,24.519,10.98,24.519,24.519 c0,13.538-10.979,24.519-24.519,24.519c-13.539,0-24.519-10.98-24.519-24.519C36.921,47.9,47.901,36.92,61.44,36.92L61.44,36.92z" 
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          slippage={slippage}
          deadline={deadline}
          onSlippageChange={(value) => setSlippage(value)}
          onDeadlineChange={(value) => setDeadline(value)}
        />
      )}

      {/* Token Modal */}
      {isTokenModalOpen && (
        <TokenModal
          isOpen={isTokenModalOpen}
          onClose={closeTokenModal}
          onSelectToken={handleSelectToken}
          selectedToken={getSelected()}
        />
      )}
    </div>
  );
};

export default SwapCard; 