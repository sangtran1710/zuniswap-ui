import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWagmi } from '../hooks/useWagmi';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { 
    connectWallet, 
    connectors, 
    isMetaMaskAvailable, 
    isWalletConnectAvailable, 
    isCoinbaseWalletAvailable,
    isPending
  } = useWagmi();

  if (!isOpen) return null;

  // Tìm các connector tương ứng
  const metaMaskConnector = connectors.find(c => c.name === 'MetaMask');
  const walletConnectConnector = connectors.find(c => c.name === 'WalletConnect');
  const coinbaseWalletConnector = connectors.find(c => c.name === 'Coinbase Wallet');

  const handleConnectWallet = async (connector: any) => {
    if (connector) {
      try {
        await connectWallet(connector);
        onClose();
      } catch (error) {
        console.error('Lỗi kết nối ví:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="relative bg-[#0D111C] rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#1C2537]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">{t('wallet.connectWallet')}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#1C2537] text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          {isMetaMaskAvailable && metaMaskConnector && (
            <button
              onClick={() => handleConnectWallet(metaMaskConnector)}
              disabled={isPending}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-[#1C2537] hover:bg-[#2C3547] transition-colors text-white disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                <img src="/assets/wallets/metamask.png" alt="MetaMask" className="w-8 h-8 mr-3" />
                <span className="font-medium">MetaMask</span>
              </div>
              <span className="text-xs px-2 py-1 bg-[#FC72FF]/10 text-[#FC72FF] rounded-full">
                {t('wallet.popular')}
              </span>
            </button>
          )}
          
          {isWalletConnectAvailable && walletConnectConnector && (
            <button
              onClick={() => handleConnectWallet(walletConnectConnector)}
              disabled={isPending}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-[#1C2537] hover:bg-[#2C3547] transition-colors text-white disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                <img src="/assets/wallets/walletconnect.png" alt="WalletConnect" className="w-8 h-8 mr-3" />
                <span className="font-medium">WalletConnect</span>
              </div>
            </button>
          )}
          
          {isCoinbaseWalletAvailable && coinbaseWalletConnector && (
            <button
              onClick={() => handleConnectWallet(coinbaseWalletConnector)}
              disabled={isPending}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-[#1C2537] hover:bg-[#2C3547] transition-colors text-white disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                <img src="/assets/wallets/coinbase.png" alt="Coinbase Wallet" className="w-8 h-8 mr-3" />
                <span className="font-medium">Coinbase Wallet</span>
              </div>
            </button>
          )}
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>{t('wallet.termsNotice')}</p>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
