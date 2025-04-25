import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  slippage?: number;
  deadline?: number;
  onSlippageChange?: (value: number) => void;
  onDeadlineChange?: (value: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  slippage = 0.5,
  deadline = 30,
  onSlippageChange,
  onDeadlineChange
}) => {
  const [slippageInput, setSlippageInput] = useState<string>(slippage.toString());
  const [deadlineInput, setDeadlineInput] = useState<string>(deadline.toString());
  const [slippageMode, setSlippageMode] = useState<'auto' | 'custom'>(slippage === 0.5 ? 'auto' : 'custom');
  
  // Handle slippage input change
  const handleSlippageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimals
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setSlippageInput(value);
    
    if (value && !isNaN(parseFloat(value))) {
      onSlippageChange?.(parseFloat(value));
    }
  };
  
  // Handle deadline input change
  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setDeadlineInput(value);
    
    if (value && !isNaN(parseInt(value))) {
      onDeadlineChange?.(parseInt(value));
    }
  };
  
  // Handle Auto slippage mode
  const handleAutoSlippage = () => {
    setSlippageMode('auto');
    setSlippageInput('0.5');
    onSlippageChange?.(0.5);
  };
  
  // Handle Custom slippage mode
  const handleCustomSlippage = () => {
    setSlippageMode('custom');
  };
  
  useEffect(() => {
    if (slippage !== undefined) {
      setSlippageInput(slippage.toString());
      setSlippageMode(slippage === 0.5 ? 'auto' : 'custom');
    }
    if (deadline !== undefined) {
      setDeadlineInput(deadline.toString());
    }
  }, [slippage, deadline]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-[#0D111C] border border-[#1C2537] p-5 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-white">
              Transaction Settings
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#1C2537] rounded-xl transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Slippage Tolerance
                </label>
                <button className="ml-2 text-gray-400 hover:text-gray-300" aria-label="Info about slippage">
                  <InformationCircleIcon className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  className={`px-3 py-2 rounded-xl text-sm font-medium 
                    ${slippageMode === 'auto' 
                      ? 'bg-[#FC72FF] bg-opacity-20 text-[#FC72FF]' 
                      : 'bg-[#1C2537] text-gray-300 hover:bg-[#252d3f]'} 
                    transition-colors`}
                  onClick={handleAutoSlippage}
                >
                  Auto
                </button>
                
                <div className={`flex flex-1 bg-[#1C2537] rounded-xl ${slippageMode === 'custom' ? 'ring-1 ring-[#FC72FF]' : ''}`}>
                  <input
                    type="text"
                    value={slippageMode === 'custom' ? slippageInput : ''}
                    onChange={handleSlippageChange}
                    onFocus={() => setSlippageMode('custom')}
                    placeholder="0.50"
                    className="flex-1 bg-transparent rounded-xl px-3 py-2 text-white placeholder-gray-500 text-right outline-none text-sm"
                  />
                  <div className="flex items-center pr-3 text-gray-300">%</div>
                </div>
              </div>
              
              {parseFloat(slippageInput) > 5 && (
                <p className="text-yellow-500 text-xs mt-1">
                  Your transaction may be frontrun
                </p>
              )}
              
              {parseFloat(slippageInput) > 15 && (
                <p className="text-red-500 text-xs mt-1">
                  Enter a valid slippage percentage
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Transaction Deadline
                </label>
                <button className="ml-2 text-gray-400 hover:text-gray-300" aria-label="Info about deadline">
                  <InformationCircleIcon className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center bg-[#1C2537] rounded-xl pr-3">
                <input
                  type="text"
                  value={deadlineInput}
                  onChange={handleDeadlineChange}
                  placeholder="30"
                  className="w-16 bg-transparent rounded-xl px-3 py-2 text-white placeholder-gray-500 text-right outline-none text-sm"
                />
                <span className="text-gray-300 text-sm">minutes</span>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Trade Options
                </label>
              </div>
              
              <button className="flex justify-between items-center w-full bg-[#1C2537] rounded-xl px-4 py-2.5 text-white">
                <span className="text-sm">Default</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default SettingsModal; 