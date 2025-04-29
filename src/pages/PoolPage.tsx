import React, { useState } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import TokenSelector from '../components/TokenSelector';
import { Token } from '../types';
import useTokenModals from '../hooks/useTokenModals';
import { theme } from '../styles/theme';

type PoolAction = 'add' | 'remove';

const PoolPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeAction, setActiveAction] = useState<PoolAction>('add');
  const [amount0, setAmount0] = useState<string>('');
  const [amount1, setAmount1] = useState<string>('');
  const [slippage, setSlippage] = useState<number>(0.5);
  
  const {
    selectedFromToken,
    selectedToToken,
    openTokenModal,
    closeTokenModal,
    setActiveTokenField,
    setSelectedFromToken,
    setSelectedToToken,
    activeTokenField,
  } = useTokenModals();

  const handleTokenClick = (field: 'from' | 'to') => {
    setActiveTokenField(field);
    openTokenModal();
  };

  const handleAmount0Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    const formattedValue = value.replace(/(\..*)\./g, '$1');
    setAmount0(formattedValue);
  };

  const handleAmount1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    const formattedValue = value.replace(/(\..*)\./g, '$1');
    setAmount1(formattedValue);
  };

  const handleAddLiquidity = () => {
    console.log('Add liquidity with:', {
      token0: selectedFromToken?.symbol,
      token1: selectedToToken?.symbol,
      amount0,
      amount1,
      slippage
    });
  };

  const handleRemoveLiquidity = () => {
    console.log('Remove liquidity with:', {
      token0: selectedFromToken?.symbol,
      token1: selectedToToken?.symbol,
      amount0,
      amount1,
      slippage
    });
  };

  return (
    <div className="w-full max-w-[480px] mx-auto mt-8">
      <div className="bg-[#0D111C] rounded-2xl shadow-lg overflow-hidden border border-[#1C2537]">
        {/* Header */}
        <div className="p-4 border-b border-[#1C2537]">
          <h2 className={`${theme.font.size.title} ${theme.colors.text.primary} font-semibold`}>
            {t('pool.title')}
          </h2>
          <p className={`${theme.font.size.label} ${theme.colors.text.secondary} mt-1`}>
            {t('pool.description')}
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex p-4">
          <button
            onClick={() => setActiveAction('add')}
            className={`flex items-center justify-center rounded-xl py-2 px-4 mr-2 ${
              activeAction === 'add'
                ? 'bg-[#1C2537] text-white'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            {t('pool.addLiquidity')}
          </button>
          <button
            onClick={() => setActiveAction('remove')}
            className={`flex items-center justify-center rounded-xl py-2 px-4 ${
              activeAction === 'remove'
                ? 'bg-[#1C2537] text-white'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <MinusIcon className="w-4 h-4 mr-1" />
            {t('pool.removeLiquidity')}
          </button>
        </div>

        <div className="p-4">
          {/* First Token Input */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
                {t('pool.firstToken')}
              </label>
              {selectedFromToken && (
                <span className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
                  {t('pool.balance')}: {selectedFromToken.balance || '0'}
                </span>
              )}
            </div>
            <div className="flex w-full bg-[#131A2A] rounded-2xl p-1">
              <div className="flex-grow">
                <input
                  type="text"
                  value={amount0}
                  onChange={handleAmount0Change}
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
              </div>
              <TokenSelector
                token={selectedFromToken}
                onTokenClick={() => handleTokenClick('from')}
                className="self-start my-1 mr-1"
              />
            </div>
          </div>

          {/* Plus Icon */}
          <div className="flex justify-center -my-1 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#1C2537] flex items-center justify-center">
              <PlusIcon className="w-4 h-4 text-blue-500" />
            </div>
          </div>

          {/* Second Token Input */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
                {t('pool.secondToken')}
              </label>
              {selectedToToken && (
                <span className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
                  {t('pool.balance')}: {selectedToToken.balance || '0'}
                </span>
              )}
            </div>
            <div className="flex w-full bg-[#131A2A] rounded-2xl p-1">
              <div className="flex-grow">
                <input
                  type="text"
                  value={amount1}
                  onChange={handleAmount1Change}
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
              </div>
              <TokenSelector
                token={selectedToToken}
                onTokenClick={() => handleTokenClick('to')}
                className="self-start my-1 mr-1"
              />
            </div>
          </div>

          {/* Fee Tier Selection - Only for Add Liquidity */}
          {activeAction === 'add' && (
            <div className="mb-4">
              <label className={`block ${theme.font.size.label} ${theme.colors.text.secondary} mb-2`}>
                {t('pool.feeTier')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button className="bg-[#1C2537] text-white rounded-xl py-2 text-sm font-medium">
                  0.05% {t('pool.bestForStable')}
                </button>
                <button className="bg-[#131A2A] text-gray-400 hover:bg-[#1C2537] hover:text-white rounded-xl py-2 text-sm font-medium">
                  0.3% {t('pool.bestForMost')}
                </button>
                <button className="bg-[#131A2A] text-gray-400 hover:bg-[#1C2537] hover:text-white rounded-xl py-2 text-sm font-medium">
                  1% {t('pool.bestForExotic')}
                </button>
              </div>
            </div>
          )}

          {/* Slippage Settings */}
          <div className="mb-4">
            <label className={`block ${theme.font.size.label} ${theme.colors.text.secondary} mb-2`}>
              {t('settings.slippageTolerance')}
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setSlippage(0.1)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  slippage === 0.1 ? 'bg-[#1C2537] text-white' : 'bg-[#131A2A] text-gray-400'
                }`}
              >
                0.1%
              </button>
              <button
                onClick={() => setSlippage(0.5)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  slippage === 0.5 ? 'bg-[#1C2537] text-white' : 'bg-[#131A2A] text-gray-400'
                }`}
              >
                0.5%
              </button>
              <button
                onClick={() => setSlippage(1.0)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  slippage === 1.0 ? 'bg-[#1C2537] text-white' : 'bg-[#131A2A] text-gray-400'
                }`}
              >
                1.0%
              </button>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={slippage.toString()}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) setSlippage(value);
                  }}
                  className="w-full bg-[#131A2A] rounded-lg px-3 py-1 text-sm text-white focus:outline-none"
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <span className="text-gray-400">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={activeAction === 'add' ? handleAddLiquidity : handleRemoveLiquidity}
            disabled={!amount0 || !amount1 || !selectedFromToken || !selectedToToken}
            className={`
              w-full py-3 mt-2 rounded-xl
              font-semibold text-white
              ${(!amount0 || !amount1 || !selectedFromToken || !selectedToToken)
                ? 'bg-gray-600/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#4338CA] to-[#60A5FA] hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all'
              }
            `}
          >
            {activeAction === 'add' 
              ? t('pool.addLiquidity') 
              : t('pool.removeLiquidity')}
          </button>
        </div>

        {/* Your Liquidity Positions */}
        <div className="p-4 border-t border-[#1C2537]">
          <h3 className={`${theme.font.size.subtitle} ${theme.colors.text.primary} font-semibold mb-4`}>
            {t('pool.yourPositions')}
          </h3>
          
          {/* Empty state */}
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1C2537] flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V16M8 12H16" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className={`${theme.font.size.body} ${theme.colors.text.secondary} max-w-xs`}>
              {t('pool.emptyState')}
            </p>
            <button 
              onClick={() => setActiveAction('add')}
              className="mt-4 text-[#60A5FA] font-medium hover:text-[#3B82F6]"
            >
              {t('pool.createPosition')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolPage;
