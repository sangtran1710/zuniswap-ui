import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWagmi } from '../hooks/useWagmi';
import { useTransactions } from '../hooks/useTransactions';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../store/useGlobalStore';
import { XMarkIcon, ArrowUpIcon, ArrowDownIcon, ClockIcon, ArrowPathIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { formatTransactionValue, formatTransactionTime, getTransactionTypeLabel, isIncomingTransaction } from '../services/transactionService';

type TabType = 'tokens' | 'nfts' | 'activity';

const AccountSidebar: React.FC = () => {
  const { t } = useTranslation();
  const { 
    address, 
    isConnected, 
    balance, 
    balanceSymbol,
    networkName,
    isTestnet,
    disconnectWallet
  } = useWagmi();
  const { transactions, isLoading: isLoadingTransactions, error: transactionsError, refreshTransactions } = useTransactions(address);
  const { isAccountSidebarOpen, closeAccountSidebar } = useGlobalStore();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>('tokens');

  // Format balance with 4 decimal places
  const formatBalance = (balanceStr?: string) => {
    if (!balanceStr) return '0.0000';
    try {
      const value = parseFloat(balanceStr);
      return value.toFixed(4);
    } catch (e) {
      return '0.0000';
    }
  };

  // Format wallet address for display
  const formatShortAddress = (address?: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format full wallet address for display
  const formatLongAddress = (address?: string) => {
    if (!address) return '';
    return address;
  };

  // Handle disconnect button
  const handleDisconnect = () => {
    disconnectWallet();
    closeAccountSidebar();
  };
  
  // Handle refresh transactions
  const handleRefreshTransactions = () => {
    refreshTransactions();
  };

  if (!isConnected || !address) {
    return null;
  }

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } }
  };

  const sidebarVariants = {
    hidden: { 
      x: "100%", 
      opacity: 0.5,
      scale: 0.98,
    },
    visible: { 
      x: 0, 
      opacity: 1,
      scale: 1,
      transition: { 
        type: "tween", 
        duration: 0.25, 
        ease: "easeOut",
        opacity: { duration: 0.15 },
        scale: { duration: 0.2 }
      }
    },
    exit: {
      x: "100%",
      opacity: 0.5,
      scale: 0.98,
      transition: { 
        type: "tween", 
        duration: 0.25, 
        ease: "easeOut",
        opacity: { duration: 0.15 },
        scale: { duration: 0.1 }
      }
    }
  };

  return (
    <AnimatePresence>
      {isAccountSidebarOpen && (
        <motion.div 
          className="fixed inset-0 z-40"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
        >
          {/* Overlay with click handler to close */}
          <div 
            className="absolute inset-0 bg-[#0D0F19]/80 backdrop-blur-[2px]" 
            onClick={closeAccountSidebar} 
          />
          
          <motion.div 
            ref={sidebarRef}
            className="fixed top-0 right-0 h-screen w-[365px] bg-[#13151A] border-l border-[#2C2F36] z-50 shadow-xl overflow-y-auto rounded-l-xl"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex justify-between items-center mb-5">
                <div 
                  className="flex items-center gap-1 cursor-pointer px-1 py-0.5 rounded-lg hover:bg-[#1C1E24] transition-colors group"
                  onClick={closeAccountSidebar}
                >
                  <ChevronRightIcon className="w-5 h-5 text-[#A0A0A0] group-hover:text-white transition-colors" />
                  <span className="text-white font-medium">{t('wallet.account', 'Account')}</span>
                </div>
                <button 
                  className="p-1.5 rounded-lg hover:bg-[#2C2F36] text-[#A0A0A0] hover:text-white transition-colors"
                  onClick={closeAccountSidebar}
                  aria-label="Close"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Balance */}
              <div className="mb-4">
                <div className="text-[#A0A0A0] text-sm mb-1">{t('wallet.balance', 'Balance')}</div>
                <div className="text-white text-[28px] font-semibold">
                  ${formatBalance(balance)}
                </div>
                <div className="text-[#FF80AB] text-sm mt-0.5">+1.63%</div>
              </div>

              {/* Wallet Info */}
              <div className="bg-[#1C1E24] rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 relative">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white w-full h-full">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white">{formatShortAddress(address)}</div>
                    <div className="text-xs text-[#00E5FF]">{networkName || 'Ethereum'}</div>
                  </div>
                </div>
              </div>

              {/* Disconnect Button */}
              <div className="mb-6">
                <button 
                  className="w-full p-3 bg-[#7C4DFF] hover:bg-[#5B2ED9] rounded-xl text-white transition-colors flex items-center justify-center"
                  onClick={handleDisconnect}
                >
                  <span>{t('wallet.disconnect', 'Disconnect')}</span>
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-[#2C2F36] mb-4">
                <div className="flex">
                  <button 
                    onClick={() => setActiveTab('tokens')}
                    className={`flex-1 py-2 text-center font-medium transition-colors ${
                      activeTab === 'tokens' 
                        ? 'text-white border-b-2 border-[#7C4DFF]' 
                        : 'text-[#A0A0A0] hover:text-white'
                    }`}
                  >
                    {t('wallet.tokens', 'Tokens')}
                  </button>
                  <button 
                    onClick={() => setActiveTab('nfts')}
                    className={`flex-1 py-2 text-center font-medium transition-colors ${
                      activeTab === 'nfts' 
                        ? 'text-white border-b-2 border-[#7C4DFF]' 
                        : 'text-[#A0A0A0] hover:text-white'
                    }`}
                  >
                    {t('wallet.nfts', 'NFTs')}
                  </button>
                  <button 
                    onClick={() => setActiveTab('activity')}
                    className={`flex-1 py-2 text-center font-medium transition-colors ${
                      activeTab === 'activity' 
                        ? 'text-white border-b-2 border-[#7C4DFF]' 
                        : 'text-[#A0A0A0] hover:text-white'
                    }`}
                  >
                    {t('wallet.activity', 'Activity')}
                  </button>
                </div>
              </div>

              {/* Content based on active tab */}
              <div>
                {activeTab === 'tokens' && (
                  <div className="space-y-1">
                    {balance && (
                      <div className="flex items-center justify-between p-3 hover:bg-[#1C1E24] rounded-xl transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#7C4DFF] flex items-center justify-center">
                            <span className="text-white font-bold">ETH</span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{balanceSymbol || 'ETH'}</div>
                            <div className="text-sm text-[#A0A0A0]">Ethereum</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">{formatBalance(balance)}</div>
                          <div className="text-sm text-[#FF80AB]">+1.63%</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'nfts' && (
                  <div className="py-4 text-center text-[#A0A0A0]">
                    <p>{t('wallet.noNFTs', 'No NFTs found')}</p>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="pb-4">
                    {/* Header with refresh button */}
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-white font-medium">{t('wallet.recentActivity', 'Recent Activity')}</h3>
                      <button 
                        className="p-1 rounded hover:bg-[#1C1E24] text-[#A0A0A0] hover:text-white transition-colors"
                        onClick={handleRefreshTransactions}
                        disabled={isLoadingTransactions}
                        aria-label={t('wallet.refreshActivity', 'Refresh activity')}
                      >
                        <ArrowPathIcon className={`w-4 h-4 ${isLoadingTransactions ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                    
                    {/* Loading state */}
                    {isLoadingTransactions && (
                      <div className="py-4 text-center text-[#A0A0A0]">
                        <p className="flex items-center justify-center gap-2">
                          <ClockIcon className="w-4 h-4 animate-pulse" />
                          {t('wallet.loadingActivity', 'Loading activity...')}
                        </p>
                      </div>
                    )}
                    
                    {/* Error state */}
                    {transactionsError && !isLoadingTransactions && (
                      <div className="py-4 text-center text-[#FF8A80]">
                        <p>{transactionsError}</p>
                        <button 
                          className="mt-2 px-3 py-1 text-sm bg-[#7C4DFF] hover:bg-[#5B2ED9] rounded text-white transition-colors"
                          onClick={handleRefreshTransactions}
                        >
                          {t('wallet.retry', 'Retry')}
                        </button>
                      </div>
                    )}
                    
                    {/* No transactions state */}
                    {!isLoadingTransactions && !transactionsError && transactions.length === 0 && (
                      <div className="py-4 text-center text-[#A0A0A0]">
                        <p>{t('wallet.noActivity', 'No recent activity')}</p>
                      </div>
                    )}
                    
                    {/* Transactions list */}
                    {!isLoadingTransactions && !transactionsError && transactions.length > 0 && (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {transactions.map((tx) => (
                          <div key={tx.hash} className="p-3 bg-[#1C1E24] hover:bg-[#2C2F36] rounded-xl transition-colors">
                            <div className="flex items-start gap-3">
                              <div className={`mt-1 p-1 rounded-full ${isIncomingTransaction(tx, address) ? 'bg-[#FF80AB]/20' : 'bg-[#FF8A80]/20'}`}>
                                {isIncomingTransaction(tx, address) ? (
                                  <ArrowDownIcon className="w-5 h-5 text-[#FF80AB]" />
                                ) : (
                                  <ArrowUpIcon className="w-5 h-5 text-[#FF8A80]" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="text-white font-medium">
                                      {getTransactionTypeLabel(tx, address)} {balanceSymbol || 'ETH'}
                                    </div>
                                    <div className="text-xs text-[#A0A0A0]">
                                      {formatTransactionTime(tx.timeStamp)}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className={`font-medium ${isIncomingTransaction(tx, address) ? 'text-[#FF80AB]' : 'text-[#FF8A80]'}`}>
                                      {isIncomingTransaction(tx, address) ? '+' : '-'}{formatTransactionValue(tx.value)} {balanceSymbol || 'ETH'}
                                    </div>
                                    <div className="text-xs text-[#A0A0A0] truncate max-w-[120px]">
                                      {isIncomingTransaction(tx, address) 
                                        ? `From: ${formatShortAddress(tx.from)}`
                                        : `To: ${formatShortAddress(tx.to)}`
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Full address */}
              <div className="mt-auto pt-6">
                <div className="border-t border-[#2C2F36] pt-4 pb-2">
                  <div className="text-center">
                    <div className="text-sm text-[#A0A0A0]">{t('wallet.currentAddress', 'Current Address')}:</div>
                    <div className="mt-1.5 text-xs text-[#A0A0A0] font-mono break-all px-4">
                      {formatLongAddress(address)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AccountSidebar; 