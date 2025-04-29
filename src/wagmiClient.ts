import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, metaMask, coinbaseWallet, walletConnect } from 'wagmi/connectors'

// Fallback WalletConnect Project ID (chỉ để test, nên thay thế bằng ID thật trong production)
const DEFAULT_PROJECT_ID = 'c9cc6d7d1615a652e9a96740a0cdc639'

// Lấy WalletConnect Project ID từ biến môi trường hoặc sử dụng ID mặc định
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || DEFAULT_PROJECT_ID

// Public API URLs - sử dụng Infura hoặc Alchemy nếu có
const MAINNET_RPC_URL = 'https://eth-mainnet.public.blastapi.io'
const SEPOLIA_RPC_URL = 'https://ethereum-sepolia.publicnode.com'

// Log cấu hình để debug
console.log('WalletConnect Project ID:', projectId)
console.log('Using RPC URLs:', {MAINNET_RPC_URL, SEPOLIA_RPC_URL})

// Wagmi client configuration
export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(MAINNET_RPC_URL),
    [sepolia.id]: http(SEPOLIA_RPC_URL),
  },
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({
      appName: 'ZuniSwap',
      appLogoUrl: `${window.location.origin}/zuniswap-logo.png`,
    }),
    walletConnect({
      projectId: projectId,
      showQrModal: true,
      metadata: {
        name: 'ZuniSwap',
        description: 'Swap crypto across Ethereum and multiple chains',
        url: window.location.origin,
        icons: [`${window.location.origin}/zuniswap-logo.png`]
      }
    }),
  ],
}) 