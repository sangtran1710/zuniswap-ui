import React, { useState } from 'react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { useTranslation } from 'react-i18next';
import { Tab } from '@headlessui/react';
import { PowerIcon } from '@heroicons/react/24/outline';
import { theme } from '../styles/theme';

interface WalletSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletSidebar: React.FC<WalletSidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balanceData } = useBalance({
    address,
  });

  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Tokens', 'NFTs', 'Pools', 'Activity'];

  // Format address for display
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Format balance with 2 decimal places
  const formatBalance = (value: string | undefined) => {
    if (!value) return '0.00';
    const numValue = parseFloat(value);
    return numValue.toFixed(2);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed right-0 top-0 h-full w-[320px] bg-[#0D111C] border-l border-[#1C2537] 
                 shadow-xl z-50 transform transition-transform duration-300 ease-in-out
                 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-[#1C2537]">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {address ? address.substring(2, 4).toUpperCase() : '?'}
          </div>
          <div className="ml-2">
            <div className="font-semibold text-white">{formatAddress(address)}</div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => disconnect()}
            className="p-2 rounded-full hover:bg-[#1C2537] text-gray-400 hover:text-white"
          >
            <PowerIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#1C2537] text-gray-400 hover:text-white"
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Balance */}
      <div className="p-4">
        <div className="text-2xl font-bold text-white">${formatBalance(balanceData?.value.toString())}</div>
        <div className="text-sm text-red-500">-$0.00 (0.00%)</div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <button className="bg-[#FC72FF] text-white rounded-xl py-2 font-medium hover:bg-opacity-90 transition-all">
          {t('wallet.buy')}
        </button>
        <button className="bg-[#1C2537] text-white rounded-xl py-2 font-medium hover:bg-opacity-90 transition-all">
          {t('wallet.receive')}
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex space-x-4 border-b border-[#1C2537]">
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  `py-2 font-medium text-sm outline-none ${
                    selected 
                      ? 'text-white border-b-2 border-[#FC72FF]' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            {/* Tokens Panel */}
            <Tab.Panel>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 hover:bg-[#1C2537] rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white font-bold">Ξ</span>
                    </div>
                    <div className="ml-2">
                      <div className="font-medium text-white">Ethereum</div>
                      <div className="text-xs text-gray-500">&lt;0.001 ETH</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">$0.00</div>
                    <div className="text-xs text-green-500">+0.00%</div>
                  </div>
                </div>
                
                {/* Add more tokens here */}
                <div className="flex items-center justify-between p-2 hover:bg-[#1C2537] rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white font-bold">$</span>
                    </div>
                    <div className="ml-2">
                      <div className="font-medium text-white">USDC</div>
                      <div className="text-xs text-gray-500">0 USDC</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">$0.00</div>
                    <div className="text-xs text-red-500">-0.01%</div>
                  </div>
                </div>
              </div>
              
              {/* Hidden Tokens */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-500 p-2">
                  <span>Hidden (4)</span>
                  <button className="text-[#FC72FF] font-medium">Show</button>
                </div>
              </div>
            </Tab.Panel>
            
            {/* NFTs Panel */}
            <Tab.Panel>
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <p>{t('wallet.noNfts')}</p>
              </div>
            </Tab.Panel>
            
            {/* Pools Panel */}
            <Tab.Panel>
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <p>{t('wallet.noPools')}</p>
              </div>
            </Tab.Panel>
            
            {/* Activity Panel */}
            <Tab.Panel>
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <p>{t('wallet.noActivity')}</p>
                <button className="mt-2 text-[#FC72FF]">{t('wallet.viewExplorer')}</button>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default WalletSidebar;
