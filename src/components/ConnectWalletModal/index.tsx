import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../../store/useGlobalStore';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useWagmi } from '../../hooks/useWagmi';
import { theme } from '../../styles/theme';

// Icons for wallets as React components
const MetaMaskIcon = () => (
  <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#F6F6F6' }}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.2857 1.90476L10.4762 7.14286L11.7143 4.28571L17.2857 1.90476Z" fill="#E17726"/>
      <path d="M2.71429 1.90476L9.47619 7.14286L8.28571 4.28571L2.71429 1.90476Z" fill="#E27625"/>
      <path d="M15.0476 13.3333L13.3333 16.1905L16.9048 17.1429L17.8571 13.3333H15.0476Z" fill="#E27625"/>
      <path d="M2.14285 13.3333L3.09523 17.1429L6.66666 16.1905L4.95238 13.3333H2.14285Z" fill="#E27625"/>
      <path d="M6.66668 8.57143L5.4762 10.4762L9.04763 10.4762L8.85715 6.66667L6.66668 8.57143Z" fill="#E27625"/>
      <path d="M13.3333 8.57143L11.1428 6.66667L10.9524 10.4762L14.5238 10.4762L13.3333 8.57143Z" fill="#E27625"/>
    </svg>
  </div>
);

const WalletConnectIcon = () => (
  <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#3B99FC' }}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.74145 8.49341C8.86588 6.39294 12.1349 6.39294 14.2593 8.49341L14.4635 8.69436C14.5656 8.79522 14.5656 8.95925 14.4635 9.06012L13.3492 10.1573C13.2981 10.2077 13.2147 10.2077 13.1637 10.1573L12.8815 9.87919C11.4361 8.4487 9.56457 8.4487 8.11916 9.87919L7.8144 10.1799C7.76336 10.2304 7.68002 10.2304 7.62897 10.1799L6.51467 9.08266C6.41258 8.9818 6.41258 8.81778 6.51467 8.71691L6.74145 8.49341ZM15.9678 10.1799L16.9716 11.171C17.0736 11.2719 17.0736 11.4359 16.9716 11.5368L13.2147 15.2444C13.0607 15.3967 12.8133 15.3967 12.6593 15.2444L10.0784 12.6947C10.0529 12.6694 10.0113 12.6694 9.98578 12.6947L7.40482 15.2444C7.25086 15.3967 7.00343 15.3967 6.84947 15.2444L3.0926 11.5368C2.99051 11.4359 2.99051 11.2719 3.0926 11.171L4.09632 10.1799C4.25029 10.0276 4.49772 10.0276 4.65168 10.1799L7.23264 12.7296C7.25811 12.7549 7.29974 12.7549 7.32521 12.7296L9.90617 10.1799C10.0601 10.0276 10.3076 10.0276 10.4615 10.1799L13.0425 12.7296C13.068 12.7549 13.1096 12.7549 13.1351 12.7296L15.716 10.1799C15.87 10.0276 16.1174 10.0276 15.9678 10.1799Z" fill="white"/>
    </svg>
  </div>
);

const CoinbaseWalletIcon = () => (
  <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#0052FF' }}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 3C6.14 3 3 6.14 3 10C3 13.86 6.14 17 10 17C13.86 17 17 13.86 17 10C17 6.14 13.86 3 10 3ZM10 13.2C8.24 13.2 6.8 11.76 6.8 10C6.8 8.24 8.24 6.8 10 6.8C11.76 6.8 13.2 8.24 13.2 10C13.2 11.76 11.76 13.2 10 13.2Z" fill="white"/>
    </svg>
  </div>
);

const ConnectWalletModal: React.FC = () => {
  const { t } = useTranslation();
  const { isWalletModalOpen, closeWalletModal } = useGlobalStore();
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { 
    connectWallet, 
    isMetaMaskAvailable, 
    isWalletConnectAvailable,
    isCoinbaseWalletAvailable,
    connectors,
    isPending,
    isConnected,
    error
  } = useWagmi();

  // Reset error when modal opens
  useEffect(() => {
    if (isWalletModalOpen) {
      setConnectionError(null);
    }
  }, [isWalletModalOpen]);

  // Theo dõi trạng thái kết nối và đóng modal khi kết nối thành công
  useEffect(() => {
    if (isConnected && isWalletModalOpen) {
      console.log('Connection successful, closing modal');
      closeWalletModal();
    }
    
    if (error) {
      console.error('Connection error:', error);
      setConnectionError(error.message || 'Lỗi kết nối không xác định');
    }
  }, [isConnected, isWalletModalOpen, closeWalletModal, error]);

  const getConnectorByName = (name: string) => {
    return connectors.find(connector => connector.name === name);
  };

  const handleConnect = async (connectorName: string) => {
    setConnectionError(null);
    const connector = getConnectorByName(connectorName);
    console.log(`Trying to connect with ${connectorName}`, connector);
    
    if (connector) {
      try {
        await connectWallet(connector);
      } catch (err) {
        console.error(`Error connecting to ${connectorName}:`, err);
        setConnectionError(err instanceof Error ? err.message : 'Lỗi kết nối không xác định');
      }
    } else {
      console.error(`${connectorName} connector not found`);
      setConnectionError(`Không tìm thấy connector ${connectorName}`);
    }
  };

  const walletOptions = [
    {
      name: 'MetaMask',
      icon: <MetaMaskIcon />,
      onClick: () => handleConnect('MetaMask'),
      disabled: !isMetaMaskAvailable || isPending,
      status: isMetaMaskAvailable ? 'Detected' : 'Not detected',
    },
    {
      name: 'WalletConnect',
      icon: <WalletConnectIcon />,
      onClick: () => handleConnect('WalletConnect'),
      disabled: !isWalletConnectAvailable || isPending,
      status: isWalletConnectAvailable ? '' : 'Not available',
    },
    {
      name: 'Coinbase Wallet',
      icon: <CoinbaseWalletIcon />,
      onClick: () => handleConnect('Coinbase Wallet'),
      disabled: !isCoinbaseWalletAvailable || isPending,
      status: isCoinbaseWalletAvailable ? '' : 'Not available',
    },
  ];

  if (!isWalletModalOpen) return null;

  return (
    <AnimatePresence>
      {isWalletModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeWalletModal}
        >
          <motion.div 
            className="bg-[#13151A] rounded-xl w-full max-w-md overflow-hidden flex flex-col shadow-xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-5 py-4 relative">
              <h2 className="text-xl font-bold text-white">
                {isPending ? 'Đang kết nối...' : 'Kết nối ví'}
              </h2>
              <button 
                className="absolute right-4 top-4 p-1 rounded-lg hover:bg-gray-800/50 transition-colors"
                onClick={closeWalletModal}
                aria-label="Close"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {connectionError && (
              <div className="mx-4 mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {connectionError}
              </div>
            )}
            
            <div className="px-4 pb-4 space-y-2">
              {walletOptions.map((wallet) => (
                <button
                  key={wallet.name}
                  className={`w-full p-4 bg-[#212427] hover:bg-[#2C2F36] rounded-xl flex items-center justify-between
                    ${wallet.disabled 
                      ? 'opacity-80 cursor-not-allowed' 
                      : 'cursor-pointer'
                    } transition-all duration-200`}
                  onClick={wallet.onClick}
                  disabled={wallet.disabled || isPending}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {wallet.icon}
                    </div>
                    <span className="font-medium text-white ml-3">{wallet.name}</span>
                  </div>
                  
                  {wallet.status && (
                    <span className="text-sm text-gray-400">
                      {wallet.status}
                    </span>
                  )}
                  
                  {isPending && wallet.name === 'WalletConnect' && (
                    <span className="text-sm text-blue-400 animate-pulse">
                      Đang kết nối...
                    </span>
                  )}
                </button>
              ))}
              
              <div className="mt-6 text-xs text-center text-gray-500 px-4">
                Bằng việc kết nối ví, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectWalletModal; 