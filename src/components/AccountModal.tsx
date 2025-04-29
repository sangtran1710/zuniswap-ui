import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../store/useGlobalStore';
import WalletManager from './WalletManager';

const AccountModal: React.FC = () => {
  const { t } = useTranslation();
  const { isAccountModalOpen, closeAccountModal } = useGlobalStore();

  if (!isAccountModalOpen) return null;

  return (
    <AnimatePresence>
      {isAccountModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAccountModal}
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
                {t('wallet.management', 'Quản lý ví')}
              </h2>
              <button 
                className="absolute right-4 top-4 p-1 rounded-lg hover:bg-gray-800/50 transition-colors"
                onClick={closeAccountModal}
                aria-label="Close"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="px-4 pb-5">
              <WalletManager />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AccountModal; 