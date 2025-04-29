import { createClient, configureChains } from 'wagmi'
import { mainnet, polygon, arbitrum, optimism } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'

const { provider, webSocketProvider } = configureChains(
  [mainnet, polygon, arbitrum, optimism],
  [publicProvider()]
)

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [
    new MetaMaskConnector({ chains: [mainnet] }),
    new WalletConnectConnector({ 
      chains: [mainnet], 
      options: { 
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '3a8170812b534d0ff9d794f19a901d64',
        qrcode: true,
        showQrModal: true
      } 
    }),
    new CoinbaseWalletConnector({ chains: [mainnet], options: { appName: 'ZuniSwap' } }),
  ],
}) 