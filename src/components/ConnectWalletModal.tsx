import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../store/useGlobalStore';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useWalletContext } from '../contexts/WalletContext';
import { theme } from '../styles/theme';

const ConnectWalletModal: React.FC = () => {
  const { t } = useTranslation();
  const { isWalletModalOpen, closeWalletModal } = useGlobalStore();
  const { connectWallet, isMetaMaskInstalled } = useWalletContext();

  const handleMetaMaskConnect = () => {
    connectWallet();
    closeWalletModal();
  };

  const walletOptions = [
    {
      name: 'MetaMask',
      icon: '🦊',
      onClick: handleMetaMaskConnect,
      disabled: !isMetaMaskInstalled,
    },
    {
      name: 'WalletConnect',
      icon: '🔗',
      onClick: () => {
        alert('WalletConnect integration coming soon');
        closeWalletModal();
      },
      disabled: false,
    },
    {
      name: 'Coinbase Wallet',
      icon: '📱',
      onClick: () => {
        alert('Coinbase Wallet integration coming soon');
        closeWalletModal();
      },
      disabled: false,
    },
  ];

  if (!isWalletModalOpen) return null;

  return (
    <AnimatePresence>
      {isWalletModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeWalletModal}
        >
          <motion.div 
            className={`bg-[#0B0C10] ${theme.radius.card} w-full max-w-md overflow-hidden flex flex-col ${theme.shadow.card} border border-purple-900/50`}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-purple-900/30">
              <h2 className={`${theme.font.size.heading} font-bold ${theme.colors.text.primary} ${theme.font.family}`}>
                {t('common.connectWallet')}
              </h2>
              <button 
                className={`p-2 ${theme.radius.button} hover:bg-black/20 transition-colors`}
                onClick={closeWalletModal}
                aria-label="Close"
              >
                <XMarkIcon className={`w-5 h-5 ${theme.colors.text.secondary}`} />
              </button>
            </div>
            
            <div className={`${theme.layout.padding} ${theme.layout.spacing}`}>
              <p className={`${theme.colors.text.secondary} mb-4`}>Connect your wallet to start trading on ZuniSwap</p>
              
              <div className="space-y-3">
                {walletOptions.map((wallet) => (
                  <button
                    key={wallet.name}
                    className={`w-full p-4 border ${theme.radius.input} flex items-center 
                      ${wallet.disabled 
                        ? 'opacity-50 cursor-not-allowed border-gray-700' 
                        : `border-purple-700 hover:bg-purple-900/20 ${theme.shadow.glow}`
                      } transition-all duration-200`}
                    onClick={wallet.onClick}
                    disabled={wallet.disabled}
                  >
                    <span className="text-2xl mr-3">{wallet.icon}</span>
                    <span className={`font-medium ${theme.colors.text.primary}`}>{wallet.name}</span>
                    {wallet.name === 'MetaMask' && !isMetaMaskInstalled && (
                      <span className={`ml-auto text-xs bg-gradient-to-r ${theme.colors.gradient.button} ${theme.radius.button} px-2 py-1`}>
                        Install first
                      </span>
                    )}
                  </button>
                ))}
              </div>
              
              <div className={`mt-6 text-xs text-center ${theme.colors.text.secondary}`}>
                By connecting your wallet, you agree to our Terms of Service and Privacy Policy
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectWalletModal; 