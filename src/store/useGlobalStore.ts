import { create } from 'zustand';

interface Token {
  symbol: string;
  name: string;
  address: string;
  logoUrl: string;
  balance?: string;
  price?: number;
}

interface GlobalState {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Tokens
  tokens: Token[];
  selectedFromToken: Token | null;
  selectedToToken: Token | null;
  setSelectedFromToken: (token: Token) => void;
  setSelectedToToken: (token: Token) => void;
  
  // Swap UI
  isTokenModalOpen: boolean;
  activeTokenField: 'from' | 'to' | null;
  openTokenModal: (field: 'from' | 'to') => void;
  closeTokenModal: () => void;
  
  // Wallet
  isWalletModalOpen: boolean;
  openWalletModal: () => void;
  closeWalletModal: () => void;
}

// Sample tokens
const defaultTokens: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    logoUrl: '/assets/tokens/eth.png',
    price: 3000,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    logoUrl: '/assets/tokens/usdc.png',
    price: 1,
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    logoUrl: '/assets/tokens/dai.png',
    price: 1,
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    logoUrl: '/assets/tokens/wbtc.png',
    price: 60000,
  },
];

export const useGlobalStore = create<GlobalState>((set) => ({
  // Theme
  isDarkMode: true,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  // Tokens
  tokens: defaultTokens,
  selectedFromToken: defaultTokens[0], // ETH by default
  selectedToToken: defaultTokens[1], // USDC by default
  setSelectedFromToken: (token) => set({ selectedFromToken: token }),
  setSelectedToToken: (token) => set({ selectedToToken: token }),
  
  // Swap UI
  isTokenModalOpen: false,
  activeTokenField: null,
  openTokenModal: (field) => set({ isTokenModalOpen: true, activeTokenField: field }),
  closeTokenModal: () => set({ isTokenModalOpen: false, activeTokenField: null }),
  
  // Wallet
  isWalletModalOpen: false,
  openWalletModal: () => set({ isWalletModalOpen: true }),
  closeWalletModal: () => set({ isWalletModalOpen: false }),
})); 