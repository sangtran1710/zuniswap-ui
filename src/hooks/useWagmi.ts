import { useAccount, useConnect, useDisconnect, useBalance, useChainId, useConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'

export function useWagmi() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const config = useConfig()
  
  // Get the user's native token balance if they are connected
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
  })

  // Function to connect to a wallet
  const connectWallet = async (connector: typeof connectors[number]) => {
    console.log('Connecting to wallet with connector:', connector.name, 'Ready status:', connector.ready);
    console.log('All available connectors:', connectors.map(c => ({name: c.name, ready: c.ready})));
    
    // Kiểm tra đặc biệt cho MetaMask
    if (connector.id === 'metaMask' || connector.name === 'MetaMask') {
      if (typeof window.ethereum === 'undefined') {
        console.error('MetaMask không được cài đặt');
        alert('Vui lòng cài đặt MetaMask để tiếp tục');
        // Mở trang download MetaMask
        window.open('https://metamask.io/download/', '_blank');
        return;
      }
      
      if (!window.ethereum.isMetaMask) {
        console.error('Provider không phải là MetaMask');
        alert('Vui lòng sử dụng trình duyệt có cài đặt MetaMask');
        return;
      }
      
      // Kiểm tra đăng nhập và yêu cầu đăng nhập nếu chưa
      if (!window.ethereum.selectedAddress) {
        try {
          console.log('Requesting MetaMask accounts...');
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (err) {
          console.error('Lỗi yêu cầu tài khoản MetaMask:', err);
          return;
        }
      }
    }
    
    try {
      await connect({ connector, chainId: mainnet.id });
      console.log('Connection attempt initiated with chainId:', mainnet.id);
    } catch (err) {
      console.error('Error connecting to wallet:', err);
      alert(`Lỗi kết nối ví: ${err instanceof Error ? err.message : 'Không xác định'}`);
    }
  }

  // Function to disconnect from a wallet
  const disconnectWallet = () => {
    disconnect()
  }

  // Determine if wallets are available
  const isMetaMaskAvailable = connectors.some(
    (connector) => connector.name === 'MetaMask' && connector.ready
  )
  
  const isWalletConnectAvailable = connectors.some(
    (connector) => connector.name === 'WalletConnect' && connector.ready
  )
  
  const isCoinbaseWalletAvailable = connectors.some(
    (connector) => connector.name === 'Coinbase Wallet' && connector.ready
  )

  // Get network information from chainId
  const currentChain = config.chains.find(c => c.id === chainId)
  const networkName = currentChain?.name || 'Unknown Network'
  const isTestnet = currentChain?.testnet || false
  
  // Check if the user is on mainnet
  const isMainnet = chainId === mainnet.id

  // Check if the network is supported
  const isUnsupportedNetwork = !config.chains.some(c => c.id === chainId)

  return {
    // Connection state
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    isPending,
    error,
    
    // Chain info
    chainId,
    networkName,
    isTestnet,
    isUnsupportedNetwork,
    isMainnet,
    
    // Balance
    balance: balance?.formatted,
    balanceSymbol: balance?.symbol,
    isBalanceLoading,
    
    // Available connectors
    connectors,
    
    // Actions
    connectWallet,
    disconnectWallet,
    
    // Wallet availability
    isMetaMaskAvailable,
    isWalletConnectAvailable,
    isCoinbaseWalletAvailable,
  }
} 