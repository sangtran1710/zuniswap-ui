import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, Cog6ToothIcon, ArrowsUpDownIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import TokenSelector from './TokenSelector';
import TokenModal from './TokenModal';
import useTokenModals from '../hooks/useTokenModals';
import { Token } from '../types';
import SettingsModal from './SettingsModal';
import { theme } from '../styles/theme';

const SwapCard = () => {
  const { t } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  const handleMaxAmount = () => {
    handleFromAmountChange({ target: { value: selectedFromToken?.balance || '0' } } as React.ChangeEvent<HTMLInputElement>);
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
  };

  const handleTokenSelect = (token: Token) => {
    // Implementation of handleTokenSelect function
  };

  const swapDirection = () => {
    // Implementation of swapDirection function
  };

  return (
    <div className={`card bg-card ${theme.radius.card} ${theme.shadow.card} w-full max-w-lg mx-auto p-4`}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className={`text-xl ${theme.font.family} font-semibold ${theme.colors.text.primary}`}>Swap</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1C2537] hover:bg-[#252d3f] transition-colors"
              aria-label="Settings"
            >
              <Cog6ToothIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* From Input Group */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>From</label>
            <div className="flex items-center gap-1">
              <span className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
                Balance: {selectedFromToken ? `${selectedFromToken.balance} ${selectedFromToken.symbol}` : '-'}
              </span>
              {selectedFromToken && (
                <button 
                  onClick={handleMaxAmount} 
                  className={`${theme.font.size.label} text-blue-500 font-medium`}
                  aria-label="Use maximum amount"
                >
                  MAX
                </button>
              )}
            </div>
          </div>
          
          <div className="flex w-full bg-[#131A2A] rounded-2xl p-1">
            <div className="flex-grow">
              <input
                type="text"
                value={fromAmount}
                onChange={handleFromAmountChange}
                placeholder="0.0"
                className={`
                  w-full h-14 px-4
                  bg-transparent
                  ${theme.font.size.tokenAmount} ${theme.font.family} font-medium
                  ${theme.colors.text.primary}
                  focus:outline-none
                `}
                inputMode="decimal"
              />
              {fromUsdValue && (
                <div className="px-4 pb-2">
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
            onClick={swapDirection}
            className="
              flex items-center justify-center
              w-10 h-10 rounded-full
              bg-[#1C2537] hover:bg-[#252d3f]
              shadow-lg z-10
              transition-colors
            "
            aria-label="Swap direction"
          >
            <ArrowsUpDownIcon className="w-5 h-5 text-blue-500" />
          </button>
        </div>

        {/* To Input Group */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>To</label>
            <div className="flex items-center gap-1">
              <span className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
                Balance: {selectedToToken ? `${selectedToToken.balance} ${selectedToToken.symbol}` : '-'}
              </span>
            </div>
          </div>
          
          <div className="flex w-full bg-[#131A2A] rounded-2xl p-1">
            <div className="flex-grow">
              <input
                type="text"
                value={toAmount}
                onChange={handleToAmountChange}
                placeholder="0.0"
                className={`
                  w-full h-14 px-4
                  bg-transparent
                  ${theme.font.size.tokenAmount} ${theme.font.family} font-medium
                  ${theme.colors.text.primary}
                  focus:outline-none
                `}
                inputMode="decimal"
              />
              {toUsdValue && (
                <div className="px-4 pb-2">
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
        {selectedFromToken && selectedToToken && (
          <div className="flex justify-between items-center px-2 py-2">
            <span className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
              1 {selectedFromToken.symbol} = {getExchangeRate().toFixed(6)} {selectedToToken.symbol}
            </span>
            <button
              onClick={swapDirection}
              className="flex items-center"
              aria-label="Switch rate direction"
            >
              <ArrowsRightLeftIcon className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}

        {/* Action Button */}
        <button
          disabled={!selectedFromToken || !selectedToToken || !fromAmount}
          onClick={handleSwap}
          className={`
            w-full py-4 mt-2 rounded-2xl
            font-semibold ${theme.font.size.button} ${theme.font.family}
            ${(!selectedFromToken || !selectedToToken || !fromAmount) 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'}
            transition-all
          `}
        >
          {!selectedFromToken || !selectedToToken 
            ? 'Select tokens' 
            : !fromAmount 
              ? 'Enter an amount' 
              : 'Swap'}
        </button>
      </div>

      {/* Modals */}
      {isTokenModalOpen && (
        <TokenModal
          isOpen={isTokenModalOpen}
          onClose={closeTokenModal}
          onSelectToken={handleSelectToken}
          selectedToken={getSelected()}
        />
      )}
      
      {isSettingsModalOpen && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SwapCard;
