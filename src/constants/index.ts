import { Token } from '../types';

// Chain IDs
export const CHAIN_IDS = {
  MAINNET: 1,
  RINKEBY: 4,
  GOERLI: 5,
  BSC: 56,
  POLYGON: 137,
} as const;

// RPC URLs
export const RPC_URLS: Record<number, string> = {
  [CHAIN_IDS.MAINNET]: 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID',
  [CHAIN_IDS.RINKEBY]: 'https://rinkeby.infura.io/v3/YOUR-PROJECT-ID',
  [CHAIN_IDS.GOERLI]: 'https://goerli.infura.io/v3/YOUR-PROJECT-ID',
  [CHAIN_IDS.BSC]: 'https://bsc-dataseed.binance.org/',
  [CHAIN_IDS.POLYGON]: 'https://polygon-rpc.com',
};

// Token List
export const TOKENS: Token[] = [
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    logoURI: 'https://token-icons.com/eth.png',
    balance: '1.23',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    logoURI: 'https://token-icons.com/usdc.png',
    balance: '100.00',
    decimals: 6,
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  {
    id: 'usdt',
    name: 'Tether',
    symbol: 'USDT',
    logoURI: 'https://token-icons.com/usdt.png',
    balance: '50.00',
    decimals: 6,
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  },
  {
    id: 'dai',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    logoURI: 'https://token-icons.com/dai.png',
    balance: '75.00',
    decimals: 18,
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
  {
    id: 'wbtc',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    logoURI: 'https://token-icons.com/wbtc.png',
    balance: '0.01',
    decimals: 8,
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  },
  {
    id: 'uni',
    name: 'Uniswap',
    symbol: 'UNI',
    logoURI: 'https://token-icons.com/uni.png',
    balance: '10.00',
    decimals: 18,
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  },
  {
    id: 'link',
    name: 'Chainlink',
    symbol: 'LINK',
    logoURI: 'https://token-icons.com/link.png',
    balance: '5.00',
    decimals: 18,
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  },
];

// Mock Exchange Rates (1 base token = X quote token)
export const EXCHANGE_RATES: Record<string, Record<string, number>> = {
  ETH: {
    USDC: 2000,
    USDT: 2000,
    DAI: 2000,
    WBTC: 0.05,
    UNI: 100,
    LINK: 50,
  },
  USDC: {
    ETH: 0.0005,
    USDT: 1,
    DAI: 1,
    WBTC: 0.000025,
    UNI: 0.05,
    LINK: 0.025,
  },
  USDT: {
    ETH: 0.0005,
    USDC: 1,
    DAI: 1,
    WBTC: 0.000025,
    UNI: 0.05,
    LINK: 0.025,
  },
  DAI: {
    ETH: 0.0005,
    USDC: 1,
    USDT: 1,
    WBTC: 0.000025,
    UNI: 0.05,
    LINK: 0.025,
  },
  WBTC: {
    ETH: 20,
    USDC: 40000,
    USDT: 40000,
    DAI: 40000,
    UNI: 2000,
    LINK: 1000,
  },
  UNI: {
    ETH: 0.01,
    USDC: 20,
    USDT: 20,
    DAI: 20,
    WBTC: 0.0005,
    LINK: 0.5,
  },
  LINK: {
    ETH: 0.02,
    USDC: 40,
    USDT: 40,
    DAI: 40,
    WBTC: 0.001,
    UNI: 2,
  },
};

// Slippage Options
export const SLIPPAGE_OPTIONS = [
  { label: '0.1%', value: 0.1 },
  { label: '0.5%', value: 0.5 },
  { label: '1%', value: 1 },
  { label: '3%', value: 3 },
] as const;

// Default Slippage
export const DEFAULT_SLIPPAGE = 0.5;

// API Endpoints
export const API_ENDPOINTS = {
  BASE_URL: 'https://api.zuniswap.com',
  QUOTE: '/quote',
  SWAP: '/swap',
  TOKENS: '/tokens',
  POOLS: '/pools',
  PRICES: '/prices',
} as const;

// Gas Price Options (in Gwei)
export const GAS_PRICE_OPTIONS = [
  { label: 'Standard', value: 20 },
  { label: 'Fast', value: 30 },
  { label: 'Instant', value: 50 },
] as const;

// Default Gas Price
export const DEFAULT_GAS_PRICE = 20;

// Transaction Deadlines (in minutes)
export const TRANSACTION_DEADLINES = [
  { label: '5 minutes', value: 5 },
  { label: '10 minutes', value: 10 },
  { label: '20 minutes', value: 20 },
  { label: '30 minutes', value: 30 },
] as const;

// Default Transaction Deadline
export const DEFAULT_TRANSACTION_DEADLINE = 20;

// Network Names
export const NETWORK_NAMES: Record<number, string> = {
  [CHAIN_IDS.MAINNET]: 'Ethereum Mainnet',
  [CHAIN_IDS.RINKEBY]: 'Rinkeby Testnet',
  [CHAIN_IDS.GOERLI]: 'Goerli Testnet',
  [CHAIN_IDS.BSC]: 'Binance Smart Chain',
  [CHAIN_IDS.POLYGON]: 'Polygon',
};

// Network Icons
export const NETWORK_ICONS: Record<number, string> = {
  [CHAIN_IDS.MAINNET]: 'https://icons.com/ethereum.png',
  [CHAIN_IDS.RINKEBY]: 'https://icons.com/ethereum.png',
  [CHAIN_IDS.GOERLI]: 'https://icons.com/ethereum.png',
  [CHAIN_IDS.BSC]: 'https://icons.com/bsc.png',
  [CHAIN_IDS.POLYGON]: 'https://icons.com/polygon.png',
}; 