import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../../store/useGlobalStore';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import WalletConnectModal from '../WalletConnectModal';

// Helper function to shorten wallet address
const shortenAddress = (address: string | undefined) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// SVG Components cho wallet icons
const MetaMaskIcon = () => (
  <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-white">
    <img 
      src="/images/tokens/MetaMask-icon-Fox.svg" 
      alt="MetaMask" 
      className="w-8 h-8"
    />
  </div>
);

const CoinbaseWalletIcon = () => (
  <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-[#0052FF]">
    <img 
      src="/images/tokens/coinbase-v2-svgrepo-com.svg" 
      alt="Coinbase Wallet" 
      className="w-8 h-8"
    />
  </div>
);

const WalletConnectIcon = () => (
  <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-[#3B99FC]">
    <img 
      src="/images/tokens/walletconnect-logo.svg" 
      alt="WalletConnect" 
      className="w-7 h-7"
    />
  </div>
);

// Helper function to get wallet icon based on connector ID
const WalletIcon = ({ connectorId }: { connectorId: string }) => {
  // Normalize connector ID to lowercase for comparison
  const normalizedId = connectorId.toLowerCase();
  
  // Check for MetaMask variants
  if (normalizedId.includes('metamask') || 
      normalizedId === 'injected' || 
      normalizedId === 'metaMask' ||
      normalizedId === 'metamaskSDK') {
    return <MetaMaskIcon />;
  }
  
  // Check for WalletConnect variants
  if (normalizedId.includes('walletconnect') || 
      normalizedId === 'walletConnect' ||
      normalizedId === 'wallet-connect') {
    return <WalletConnectIcon />;
  }
  
  // Check for Coinbase Wallet variants
  if (normalizedId.includes('coinbase') || 
      normalizedId === 'coinbaseWallet' ||
      normalizedId === 'coinbasewallet' ||
      normalizedId === 'wallet-link') {
    return <CoinbaseWalletIcon />;
  }
  
  // Nếu không nhận dạng được, hiển thị biểu tượng mặc định
  console.log('No matching icon found for connectorId:', connectorId);
  return (
    <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-[#212427]">
      <span className="text-white text-sm font-medium">?</span>
    </div>
  );
};

const ConnectWalletModal = () => {
  const { t } = useTranslation();
  const { isWalletModalOpen, closeWalletModal } = useGlobalStore();
  const { connectors, connect, isPending, error } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showWalletConnectQR, setShowWalletConnectQR] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);
  
  // Handle errors and format them for display
  useEffect(() => {
    if (error) {
      console.log('Connection error:', error);
      
      // Check if this is a user rejection error (code 4001)
      if (error.message?.includes('User rejected') || 
          error.message?.includes('user rejected') || 
          error.message?.includes('User denied') || 
          (error as any)?.code === 4001) {
        setErrorMessage(t('wallet.userRejected', 'Bạn đã từ chối kết nối ví'));
      } else {
        setErrorMessage(error.message || 'Có lỗi khi kết nối ví');
      }
    } else {
      setErrorMessage(null);
    }
  }, [error, t]);
  
  if (!isWalletModalOpen) return null;

  return (
    <>
      {/* WalletConnect QR Modal - hiển thị ở trung tâm màn hình */}
      <WalletConnectModal isOpen={showWalletConnectQR} onClose={() => setShowWalletConnectQR(false)} />
      
      {/* Wallet Connection Sidebar - hiển thị ở bên phải */}
      <AnimatePresence>
        {isWalletModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex justify-end bg-black/50 backdrop-blur-md"
            onClick={closeWalletModal}
          >
            <motion.div 
              className="bg-[#13151A] w-[360px] h-full overflow-y-auto flex flex-col shadow-xl border-l border-[#2C2F36] backdrop-blur-md bg-opacity-80"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">{t('wallet.connectWallet', 'Connect a wallet')}</h2>
                  <button
                    onClick={closeWalletModal}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                
                {connectors.map((connector) => {
                  // Luôn coi như connector sẵn sàng khi không xác định rõ trạng thái
                  const isReady = connector.ready !== false;
                  
                  return (
                    <button
                      key={connector.id}
                      onClick={() => {
                        try {
                          console.log(`Attempting to connect with ${connector.name}`, {
                            connector,
                            ready: connector.ready
                          });
                          
                          // Clear previous error messages
                          setErrorMessage(null);
                          
                          // Add special handling for MetaMask
                          if (connector.id === 'metamaskSDK' || 
                              connector.id === 'metaMask' || 
                              connector.id.toLowerCase().includes('metamask')) {
                            console.log('Using MetaMask connector with ID:', connector.id);
                            
                            // Handle CSP errors by wrapping the connect call in a try/catch
                            try {
                              connect({ connector });
                              
                              // Timeout to catch potential errors
                              setTimeout(() => {
                                if (error) {
                                  console.log('MetaMask connection error after timeout:', error);
                                  
                                  // Check if this is a user rejection error
                                  const metaMaskError = error as any;
                                  if (metaMaskError?.code === 4001 || 
                                      metaMaskError?.message?.includes('User rejected') || 
                                      metaMaskError?.message?.includes('user rejected')) {
                                    console.log('User rejected MetaMask connection request');
                                    setErrorMessage(t('wallet.userRejected', 'Kết nối bị từ chối. Vui lòng thử lại.'));
                                  } else {
                                    console.error('MetaMask connection error:', metaMaskError);
                                    setErrorMessage(metaMaskError?.message || 'Có lỗi khi kết nối với ví');
                                  }
                                }
                              }, 0);
                              return;
                            } catch (metaMaskError: any) {
                              console.error('MetaMask connection error:', metaMaskError);
                              setErrorMessage(metaMaskError?.message || 'Có lỗi khi kết nối với ví');
                              return;
                            }
                          }
                          
                          try {
                            // Nếu là WalletConnect, hiển thị QR code
                            if (connector.id === 'walletConnect' || connector.name === 'WalletConnect') {
                              setSelectedConnector(connector.id);
                              setShowWalletConnectQR(true);
                              return;
                            }
                            
                            // Các connector khác
                            connect({ connector });
                          } catch (err: any) {
                            console.error(`Error connecting to ${connector.name}:`, err);
                            setErrorMessage(err?.message || 'Có lỗi khi kết nối với ví');
                          }
                        } catch (e) {
                          console.error(`Error connecting to ${connector.name}:`, e);
                          setErrorMessage((e as Error)?.message || 'Có lỗi khi kết nối với ví');
                        }
                      }}
                      disabled={!isReady || isPending}
                      className={`w-full p-4 bg-[#1C1E24] hover:bg-[#2C2F36] rounded-xl flex items-center justify-between
                        ${(!isReady || isPending) ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'} 
                        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7C4DFF]/50 mb-3 border border-[#2C2F36] hover:border-[#3C3F46]`}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <WalletIcon connectorId={connector.id} />
                        </div>
                        <span className="font-medium text-white ml-3 text-base">{connector.name}</span>
                      </div>
                      
                      {connector.name === 'MetaMask' && (
                        <span className="text-xs px-2 py-1 bg-[#7C4DFF]/10 text-[#7C4DFF] rounded-full font-medium">
                          {t('wallet.popular', 'Popular')}
                        </span>
                      )}
                      
                      {!isReady && (
                        <span className="text-sm text-[#A0A0A0] px-2 py-1 bg-[#2C2F36]/50 rounded-md">
                          {t('wallet.notAvailable', 'Not Available')}
                        </span>
                      )}
                      
                      {isPending && (
                        <span className="text-sm text-[#7C4DFF] px-2 py-1 bg-[#7C4DFF]/10 rounded-md animate-pulse">
                          {t('common.connecting', 'Connecting...')}
                        </span>
                      )}
                    </button>
                  );
                })}
                
                {errorMessage && (
                  <div className="error mt-2 p-3 bg-[#FF8A80]/10 border border-[#FF8A80]/30 rounded-lg text-[#FF8A80] text-sm">
                    {errorMessage}
                  </div>
                )}
                
                <div className="mt-8 text-xs text-[#A0A0A0] px-2 border-t border-[#2C2F36] pt-4">
                  {t('wallet.termsNotice', 'By connecting a wallet, you agree to Zuniswap\'s Terms of Service and consent to its Privacy Policy')}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ConnectWalletModal;
