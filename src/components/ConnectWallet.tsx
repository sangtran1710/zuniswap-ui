import { useWalletContext } from '../contexts/WalletContext';

const ConnectWallet = () => {
  const { 
    address, 
    isConnected, 
    isLoading, 
    isMetaMaskInstalled, 
    connectWallet, 
    disconnectWallet 
  } = useWalletContext();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isMetaMaskInstalled) {
    return (
      <a 
        href="https://metamask.io/download/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="px-3 py-1.5 text-sm rounded-full bg-[#FC72FF] hover:bg-[#FB58FF] text-white font-medium transition-colors"
      >
        Install MetaMask
      </a>
    );
  }

  if (isLoading) {
    return (
      <button 
        className="px-3 py-1.5 text-sm rounded-full bg-[#FC72FF]/70 text-white font-medium cursor-not-allowed"
        disabled
      >
        <span className="animate-pulse">Connecting...</span>
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <button 
        className="px-3 py-1.5 text-sm rounded-full bg-[#1C2537] hover:bg-[#252d3f] text-white font-medium transition-colors flex items-center gap-1.5"
        onClick={disconnectWallet}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
        {formatAddress(address)}
      </button>
    );
  }

  return (
    <button 
      className="px-3 py-1.5 text-sm rounded-full bg-[#FC72FF] hover:bg-[#FB58FF] text-white font-medium transition-colors"
      onClick={connectWallet}
    >
      Connect
    </button>
  );
};

export default ConnectWallet; 