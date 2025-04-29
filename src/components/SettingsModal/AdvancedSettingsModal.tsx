import React, { useState } from 'react';
import { XMarkIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';

interface AdvancedSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  slippage: number;
  deadline: number;
  onSlippageChange: (value: number) => void;
  onDeadlineChange: (value: number) => void;
}

const AdvancedSettingsModal: React.FC<AdvancedSettingsModalProps> = ({
  isOpen,
  onClose,
  slippage,
  deadline,
  onSlippageChange,
  onDeadlineChange
}) => {
  const { t } = useTranslation();
  const [customSlippage, setCustomSlippage] = useState<string>(slippage.toString());
  const [customDeadline, setCustomDeadline] = useState<string>(deadline.toString());
  const [showExpertSettings, setShowExpertSettings] = useState(false);
  const [gasPrice, setGasPrice] = useState<'auto' | 'normal' | 'fast' | 'custom'>('auto');
  const [customGasPrice, setCustomGasPrice] = useState<string>('');
  const [routingPreference, setRoutingPreference] = useState<'auto' | 'api' | 'client'>('auto');
  
  if (!isOpen) return null;

  const handleSlippageChange = (value: number) => {
    onSlippageChange(value);
    setCustomSlippage(value.toString());
  };

  const handleCustomSlippageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomSlippage(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onSlippageChange(numValue);
    }
  };

  const handleDeadlineChange = (value: number) => {
    onDeadlineChange(value);
    setCustomDeadline(value.toString());
  };

  const handleCustomDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomDeadline(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      onDeadlineChange(numValue);
    }
  };

  const isSlippageWarning = slippage < 0.1 || slippage > 5;
  const isSlippageDanger = slippage > 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="w-full max-w-md bg-[#0D111C] rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#1C2537] flex justify-between items-center">
          <h2 className={`${theme.font.size.subtitle} ${theme.colors.text.primary} font-semibold`}>
            {t('settings.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#1C2537] text-gray-400 hover:text-white"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {/* Slippage Tolerance */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <label className={`${theme.font.size.body} ${theme.colors.text.primary} font-medium`}>
                {t('settings.slippageTolerance')}
              </label>
              <div className="relative group ml-2">
                <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-[#1C2537] rounded-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {t('settings.slippageTooltip')}
                </div>
              </div>
            </div>
            <div className="flex space-x-2 mb-2">
              <button
                onClick={() => handleSlippageChange(0.1)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  slippage === 0.1 
                    ? 'bg-[#1C2537] text-white' 
                    : 'bg-[#131A2A] text-gray-400 hover:text-white'
                }`}
              >
                0.1%
              </button>
              <button
                onClick={() => handleSlippageChange(0.5)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  slippage === 0.5 
                    ? 'bg-[#1C2537] text-white' 
                    : 'bg-[#131A2A] text-gray-400 hover:text-white'
                }`}
              >
                0.5%
              </button>
              <button
                onClick={() => handleSlippageChange(1.0)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  slippage === 1.0 
                    ? 'bg-[#1C2537] text-white' 
                    : 'bg-[#131A2A] text-gray-400 hover:text-white'
                }`}
              >
                1.0%
              </button>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={customSlippage}
                  onChange={handleCustomSlippageChange}
                  className={`w-full bg-[#131A2A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none ${
                    isSlippageDanger 
                      ? 'border border-red-500' 
                      : isSlippageWarning 
                        ? 'border border-yellow-500' 
                        : ''
                  }`}
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <span className="text-gray-400">%</span>
                </div>
              </div>
            </div>
            {isSlippageDanger && (
              <p className="text-xs text-red-500 mt-1">
                {t('settings.slippageDangerWarning')}
              </p>
            )}
            {isSlippageWarning && !isSlippageDanger && (
              <p className="text-xs text-yellow-500 mt-1">
                {slippage < 0.1 
                  ? t('settings.slippageLowWarning')
                  : t('settings.slippageHighWarning')}
              </p>
            )}
          </div>

          {/* Transaction Deadline */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <label className={`${theme.font.size.body} ${theme.colors.text.primary} font-medium`}>
                {t('settings.transactionDeadline')}
              </label>
              <div className="relative group ml-2">
                <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-[#1C2537] rounded-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {t('settings.deadlineTooltip')}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDeadlineChange(10)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  deadline === 10 
                    ? 'bg-[#1C2537] text-white' 
                    : 'bg-[#131A2A] text-gray-400 hover:text-white'
                }`}
              >
                10m
              </button>
              <button
                onClick={() => handleDeadlineChange(20)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  deadline === 20 
                    ? 'bg-[#1C2537] text-white' 
                    : 'bg-[#131A2A] text-gray-400 hover:text-white'
                }`}
              >
                20m
              </button>
              <button
                onClick={() => handleDeadlineChange(30)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  deadline === 30 
                    ? 'bg-[#1C2537] text-white' 
                    : 'bg-[#131A2A] text-gray-400 hover:text-white'
                }`}
              >
                30m
              </button>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={customDeadline}
                  onChange={handleCustomDeadlineChange}
                  className="w-full bg-[#131A2A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <span className="text-gray-400">min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Expert Mode Toggle */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <label className={`${theme.font.size.body} ${theme.colors.text.primary} font-medium`}>
                  {t('settings.expertMode')}
                </label>
                <div className="relative group ml-2">
                  <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-[#1C2537] rounded-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {t('settings.expertModeTooltip')}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowExpertSettings(!showExpertSettings)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  showExpertSettings ? 'bg-[#FC72FF]' : 'bg-[#1C2537]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    showExpertSettings ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Expert Settings (conditionally rendered) */}
          {showExpertSettings && (
            <>
              {/* Gas Price Settings */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <label className={`${theme.font.size.body} ${theme.colors.text.primary} font-medium`}>
                    {t('settings.gasPrice')}
                  </label>
                  <div className="relative group ml-2">
                    <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-[#1C2537] rounded-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {t('settings.gasPriceTooltip')}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 mb-2">
                  <button
                    onClick={() => setGasPrice('auto')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      gasPrice === 'auto' 
                        ? 'bg-[#1C2537] text-white' 
                        : 'bg-[#131A2A] text-gray-400 hover:text-white'
                    }`}
                  >
                    {t('settings.auto')}
                  </button>
                  <button
                    onClick={() => setGasPrice('normal')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      gasPrice === 'normal' 
                        ? 'bg-[#1C2537] text-white' 
                        : 'bg-[#131A2A] text-gray-400 hover:text-white'
                    }`}
                  >
                    {t('settings.normal')}
                  </button>
                  <button
                    onClick={() => setGasPrice('fast')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      gasPrice === 'fast' 
                        ? 'bg-[#1C2537] text-white' 
                        : 'bg-[#131A2A] text-gray-400 hover:text-white'
                    }`}
                  >
                    {t('settings.fast')}
                  </button>
                  <button
                    onClick={() => setGasPrice('custom')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      gasPrice === 'custom' 
                        ? 'bg-[#1C2537] text-white' 
                        : 'bg-[#131A2A] text-gray-400 hover:text-white'
                    }`}
                  >
                    {t('settings.custom')}
                  </button>
                </div>
                {gasPrice === 'custom' && (
                  <div className="relative">
                    <input
                      type="text"
                      value={customGasPrice}
                      onChange={(e) => setCustomGasPrice(e.target.value)}
                      placeholder="Enter gas price in GWEI"
                      className="w-full bg-[#131A2A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <span className="text-gray-400">GWEI</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Routing API Preference */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <label className={`${theme.font.size.body} ${theme.colors.text.primary} font-medium`}>
                    {t('settings.routingPreference')}
                  </label>
                  <div className="relative group ml-2">
                    <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-[#1C2537] rounded-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {t('settings.routingTooltip')}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setRoutingPreference('auto')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      routingPreference === 'auto' 
                        ? 'bg-[#1C2537] text-white' 
                        : 'bg-[#131A2A] text-gray-400 hover:text-white'
                    }`}
                  >
                    {t('settings.auto')}
                  </button>
                  <button
                    onClick={() => setRoutingPreference('api')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      routingPreference === 'api' 
                        ? 'bg-[#1C2537] text-white' 
                        : 'bg-[#131A2A] text-gray-400 hover:text-white'
                    }`}
                  >
                    {t('settings.api')}
                  </button>
                  <button
                    onClick={() => setRoutingPreference('client')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      routingPreference === 'client' 
                        ? 'bg-[#1C2537] text-white' 
                        : 'bg-[#131A2A] text-gray-400 hover:text-white'
                    }`}
                  >
                    {t('settings.client')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1C2537] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#FC72FF] text-white rounded-xl font-medium hover:bg-opacity-90 transition-all"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettingsModal;
