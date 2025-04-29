import { useWagmi } from '../hooks/useWagmi';
import { useGlobalStore } from '../store/useGlobalStore';
import { useTranslation } from 'react-i18next';

const ConnectWallet = () => {
  const { t } = useTranslation();
  const { 
    address, 
    isConnected, 
    isPending,
    isMetaMaskAvailable, 
    disconnectWallet 
  } = useWagmi();
  
  const { openWalletModal, toggleAccountSidebar } = useGlobalStore();

  const handleOpenWalletModal = () => {
    openWalletModal();
  };

  const handleToggleAccountSidebar = () => {
    toggleAccountSidebar();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isMetaMaskAvailable && !isConnected) {
    return (
      <button 
        className="px-3 py-1.5 text-sm rounded-full bg-[#7C4DFF] hover:bg-[#5B2ED9] text-white font-medium transition-all"
        onClick={handleOpenWalletModal}
      >
        {t('common.instalMetamask')}
      </button>
    );
  }

  if (isPending) {
    return (
      <button 
        className="px-3 py-1.5 text-sm rounded-full bg-[#7C4DFF]/70 text-white font-medium cursor-not-allowed"
        disabled
      >
        <span className="animate-pulse">{t('common.connecting')}</span>
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <button 
        className="px-3 py-1.5 text-sm rounded-full bg-[#13151A] hover:bg-[#1C1E24] text-white font-medium transition-colors flex items-center gap-1.5 border border-[#00E5FF]/30 focus:border-[#00E5FF]"
        onClick={handleToggleAccountSidebar}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
        {formatAddress(address)}
      </button>
    );
  }

  return (
    <button 
      className="px-3 py-1.5 text-sm rounded-full bg-[#7C4DFF] hover:bg-[#5B2ED9] text-white font-medium transition-all"
      onClick={handleOpenWalletModal}
    >
      {t('common.connect')}
    </button>
  );
};

export default ConnectWallet; 