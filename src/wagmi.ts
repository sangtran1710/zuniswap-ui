import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { metaMask, coinbaseWallet, walletConnect } from 'wagmi/connectors'

// WalletConnect Project ID từ cloud.walletconnect.com
const DEFAULT_PROJECT_ID = '3a8170812b534d0ff9d794f19a901d64'

// Lấy WalletConnect Project ID từ biến môi trường hoặc sử dụng ID mặc định
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || DEFAULT_PROJECT_ID

// Public API URLs - sử dụng Infura hoặc Alchemy nếu có
const MAINNET_RPC_URL = 'https://eth-mainnet.public.blastapi.io'
const SEPOLIA_RPC_URL = 'https://ethereum-sepolia.publicnode.com'

// Log cấu hình để debug
console.log('WalletConnect Project ID:', projectId)
console.log('Using RPC URLs:', {MAINNET_RPC_URL, SEPOLIA_RPC_URL})

// Kiểm tra và xác nhận window.ethereum tồn tại
const hasInjectedProvider = typeof window !== 'undefined' && window.ethereum !== undefined
console.log('Has injected provider (window.ethereum):', hasInjectedProvider)
if (hasInjectedProvider) {
  console.log('Ethereum provider details:', {
    isMetaMask: window.ethereum.isMetaMask,
    isCoinbaseWallet: window.ethereum.isCoinbaseWallet
  })
}

// Wagmi client configuration
export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(MAINNET_RPC_URL),
    [sepolia.id]: http(SEPOLIA_RPC_URL),
  },
  connectors: [
    // Chỉ sử dụng MetaMask connector, không cần injected nữa
    metaMask(),
    coinbaseWallet({
      appName: 'ZuniSwap',
      appLogoUrl: `${window.location.origin}/zuniswap-logo.png`,
    }),
    walletConnect({
      projectId: projectId,
      showQrModal: false, // Tắt QR modal mặc định
      metadata: {
        name: 'ZuniSwap',
        description: 'Swap crypto across Ethereum and multiple chains',
        url: window.location.origin,
        icons: [`${window.location.origin}/zuniswap-logo.png`]
      }
    }),
  ],
}) 