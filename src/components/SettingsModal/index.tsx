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
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#141A2A] to-[#0D111C] border border-[#1f2c47] p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-5">
            <Dialog.Title className="text-xl font-bold text-white flex items-center gap-2">
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 122.88 122.878" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-blue-400"
              >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M101.589,14.7l8.818,8.819c2.321,2.321,2.321,6.118,0,8.439l-7.101,7.101 c1.959,3.658,3.454,7.601,4.405,11.752h9.199c3.283,0,5.969,2.686,5.969,5.968V69.25c0,3.283-2.686,5.969-5.969,5.969h-10.039 c-1.231,4.063-2.992,7.896-5.204,11.418l6.512,6.51c2.321,2.323,2.321,6.12,0,8.44l-8.818,8.819c-2.321,2.32-6.119,2.32-8.439,0 l-7.102-7.102c-3.657,1.96-7.601,3.456-11.753,4.406v9.199c0,3.282-2.685,5.968-5.968,5.968H53.629 c-3.283,0-5.969-2.686-5.969-5.968v-10.039c-4.063-1.232-7.896-2.993-11.417-5.205l-6.511,6.512c-2.323,2.321-6.12,2.321-8.441,0 l-8.818-8.818c-2.321-2.321-2.321-6.118,0-8.439l7.102-7.102c-1.96-3.657-3.456-7.6-4.405-11.751H5.968 C2.686,72.067,0,69.382,0,66.099V53.628c0-3.283,2.686-5.968,5.968-5.968h10.039c1.232-4.063,2.993-7.896,5.204-11.418l-6.511-6.51 c-2.321-2.322-2.321-6.12,0-8.44l8.819-8.819c2.321-2.321,6.118-2.321,8.439,0l7.101,7.101c3.658-1.96,7.601-3.456,11.753-4.406 V5.969C50.812,2.686,53.498,0,56.78,0h12.471c3.282,0,5.968,2.686,5.968,5.969v10.036c4.064,1.231,7.898,2.992,11.422,5.204 l6.507-6.509C95.471,12.379,99.268,12.379,101.589,14.7L101.589,14.7z M61.44,36.92c13.54,0,24.519,10.98,24.519,24.519 c0,13.538-10.979,24.519-24.519,24.519c-13.539,0-24.519-10.98-24.519-24.519C36.921,47.9,47.901,36.92,61.44,36.92L61.44,36.92z" 
                  fill="currentColor"
                />
              </svg>
              Transaction Settings
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#1C2537] rounded-full transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-[#1C2537]/50 rounded-xl p-4 border border-[#2c3b5a]/50">
              <div className="flex items-center mb-3">
                <label className="text-sm font-semibold text-blue-100">
                  Slippage Tolerance
                </label>
                <button className="ml-2 text-gray-400 hover:text-gray-300 group relative" aria-label="Info about slippage">
                  <InformationCircleIcon className="w-4 h-4" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#0D111C] text-xs text-gray-300 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    Your transaction will revert if the price changes unfavorably by more than this percentage.
                  </div>
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${slippageMode === 'auto' 
                      ? 'bg-gradient-to-r from-[#4338CA] to-[#60A5FA] text-white shadow-lg' 
                      : 'bg-[#212b42] text-gray-300 hover:bg-[#252d3f]'}`}
                  onClick={handleAutoSlippage}
                >
                  Auto
                </button>
                
                <div className={`flex flex-1 bg-[#212b42] rounded-xl overflow-hidden transition-all duration-200 ${slippageMode === 'custom' ? 'ring-1 ring-blue-500 shadow-[0_0_8px_rgba(96,165,250,0.3)]' : ''}`}>
                  <input
                    type="text"
                    value={slippageMode === 'custom' ? slippageInput : ''}
                    onChange={handleSlippageChange}
                    onFocus={() => setSlippageMode('custom')}
                    placeholder="0.50"
                    className="flex-1 bg-transparent rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-right outline-none text-sm"
                  />
                  <div className="flex items-center pr-4 text-gray-300 font-medium">%</div>
                </div>
              </div>
              
              {parseFloat(slippageInput) > 5 && (
                <p className="text-yellow-500 text-xs mt-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Your transaction may be frontrun
                </p>
              )}
              
              {parseFloat(slippageInput) > 15 && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Enter a valid slippage percentage
                </p>
              )}
            </div>

            <div className="bg-[#1C2537]/50 rounded-xl p-4 border border-[#2c3b5a]/50">
              <div className="flex items-center mb-3">
                <label className="text-sm font-semibold text-blue-100">
                  Transaction Deadline
                </label>
                <button className="ml-2 text-gray-400 hover:text-gray-300 group relative" aria-label="Info about deadline">
                  <InformationCircleIcon className="w-4 h-4" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#0D111C] text-xs text-gray-300 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    Your transaction will revert if it is pending for more than this period of time.
                  </div>
                </button>
              </div>
              
              <div className="flex items-center bg-[#212b42] rounded-xl pr-4">
                <input
                  type="text"
                  value={deadlineInput}
                  onChange={handleDeadlineChange}
                  placeholder="30"
                  className="w-16 bg-transparent rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-right outline-none text-sm"
                />
                <span className="text-gray-300 text-sm font-medium">minutes</span>
              </div>
            </div>
            
            <div className="bg-[#1C2537]/50 rounded-xl p-4 border border-[#2c3b5a]/50">
              <div className="flex items-center mb-3">
                <label className="text-sm font-semibold text-blue-100">
                  Interface Settings
                </label>
              </div>
              
              <div className="space-y-2">
                <button className="flex justify-between items-center w-full bg-[#212b42] rounded-xl px-4 py-3 text-white hover:bg-[#252d3f] transition-colors">
                  <span className="text-sm font-medium">Auto Router API</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      name="autoRouter" 
                      id="autoRouter" 
                      className="checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-2 border-gray-300 appearance-none cursor-pointer" 
                      defaultChecked 
                      aria-label="Toggle Auto Router API"
                    />
                    <label htmlFor="autoRouter" className="block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer"></label>
                  </div>
                </button>
                
                <button className="flex justify-between items-center w-full bg-[#212b42] rounded-xl px-4 py-3 text-white hover:bg-[#252d3f] transition-colors">
                  <span className="text-sm font-medium">Expert Mode</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      name="expertMode" 
                      id="expertMode" 
                      className="checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-2 border-gray-300 appearance-none cursor-pointer" 
                      aria-label="Toggle Expert Mode"
                    />
                    <label htmlFor="expertMode" className="block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer"></label>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default SettingsModal; 