import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import TokenPriceChart from '../components/TokenChart/TokenPriceChart';
import { theme } from '../styles/theme';

interface TokenDetail {
  id: string;
  name: string;
  symbol: string;
  logoURI: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  totalVolume: number;
  circulatingSupply: number;
  totalSupply: number;
  description: string;
  website: string;
  twitter: string;
  explorer: string;
}

interface Transaction {
  id: string;
  type: 'swap' | 'add' | 'remove';
  time: string;
  account: string;
  token0Amount: string;
  token0Symbol: string;
  token1Amount: string;
  token1Symbol: string;
  value: number;
}

const TokenDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { tokenId } = useParams<{ tokenId: string }>();
  const [token, setToken] = useState<TokenDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Simulate API fetch for token details
    setIsLoading(true);
    setTimeout(() => {
      // Mock data for demonstration
      setToken({
        id: tokenId || '1',
        name: 'Ethereum',
        symbol: 'ETH',
        logoURI: '',
        price: 3500.75,
        priceChange24h: 2.34,
        marketCap: 420000000000,
        totalVolume: 15000000000,
        circulatingSupply: 120000000,
        totalSupply: 150000000,
        description: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform. Amongst cryptocurrencies, Ether is second only to Bitcoin in market capitalization.',
        website: 'https://ethereum.org',
        twitter: 'https://twitter.com/ethereum',
        explorer: 'https://etherscan.io'
      });

      // Mock transaction data
      setTransactions([
        {
          id: '1',
          type: 'swap',
          time: '5 mins ago',
          account: '0x1234...5678',
          token0Amount: '1.5',
          token0Symbol: 'ETH',
          token1Amount: '5000',
          token1Symbol: 'USDC',
          value: 5250
        },
        {
          id: '2',
          type: 'add',
          time: '10 mins ago',
          account: '0xabcd...efgh',
          token0Amount: '2.0',
          token0Symbol: 'ETH',
          token1Amount: '7000',
          token1Symbol: 'USDC',
          value: 7000
        },
        {
          id: '3',
          type: 'swap',
          time: '15 mins ago',
          account: '0x7890...1234',
          token0Amount: '10000',
          token0Symbol: 'USDC',
          token1Amount: '2.85',
          token1Symbol: 'ETH',
          value: 10000
        },
        {
          id: '4',
          type: 'remove',
          time: '30 mins ago',
          account: '0xijkl...mnop',
          token0Amount: '5.0',
          token0Symbol: 'ETH',
          token1Amount: '17500',
          token1Symbol: 'USDC',
          value: 17500
        },
        {
          id: '5',
          type: 'swap',
          time: '45 mins ago',
          account: '0x2468...1357',
          token0Amount: '0.75',
          token0Symbol: 'ETH',
          token1Amount: '2625',
          token1Symbol: 'USDC',
          value: 2625
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
  }, [tokenId]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(decimals)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(decimals)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(decimals)}K`;
    } else {
      return `$${num.toFixed(decimals)}`;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FC72FF]"></div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[400px]">
        <h2 className={`${theme.font.size.title} ${theme.colors.text.primary} mb-4`}>
          {t('tokens.notFound')}
        </h2>
        <Link to="/swap" className="text-[#FC72FF] hover:text-[#fd8aff]">
          {t('common.backToSwap')}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
      {/* Back button and token header */}
      <div className="flex items-center mb-6">
        <Link to="/swap" className="mr-4 p-2 rounded-full bg-[#131A2A] hover:bg-[#1C2537]">
          <ArrowLeftIcon className="w-5 h-5 text-white" />
        </Link>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
            {token.symbol.substring(0, 1)}
          </div>
          <div>
            <h1 className={`${theme.font.size.title} ${theme.colors.text.primary} font-semibold`}>
              {token.name} ({token.symbol})
            </h1>
            <div className="flex items-center">
              <span className={`${theme.font.size.subtitle} ${theme.colors.text.primary} mr-2`}>
                ${token.price.toFixed(2)}
              </span>
              <span className={`text-sm ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {token.priceChange24h >= 0 ? '↑' : '↓'} 
                {Math.abs(token.priceChange24h).toFixed(2)}%
              </span>
            </div>
          </div>
          <button 
            onClick={toggleFavorite}
            className="ml-4 p-2 rounded-full hover:bg-[#131A2A]"
          >
            {isFavorite ? (
              <StarIconSolid className="w-6 h-6 text-[#FC72FF]" />
            ) : (
              <StarIcon className="w-6 h-6 text-gray-500 hover:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Chart */}
        <div className="lg:col-span-2">
          <TokenPriceChart tokenSymbol={token.symbol} tokenId={token.id} />
          
          {/* Tabs */}
          <div className="mt-6 border-b border-[#1C2537]">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 px-4 font-medium ${
                  activeTab === 'overview'
                    ? 'text-white border-b-2 border-[#FC72FF]'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {t('tokens.overview')}
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-3 px-4 font-medium ${
                  activeTab === 'transactions'
                    ? 'text-white border-b-2 border-[#FC72FF]'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {t('tokens.transactions')}
              </button>
            </div>
          </div>
          
          {/* Tab content */}
          <div className="mt-6">
            {activeTab === 'overview' ? (
              <div>
                <h3 className={`${theme.font.size.subtitle} ${theme.colors.text.primary} font-semibold mb-4`}>
                  {t('tokens.about')} {token.name}
                </h3>
                <p className={`${theme.font.size.body} ${theme.colors.text.secondary} mb-6`}>
                  {token.description}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <div className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
                      {t('tokens.marketCap')}
                    </div>
                    <div className={`${theme.font.size.body} ${theme.colors.text.primary}`}>
                      {formatNumber(token.marketCap)}
                    </div>
                  </div>
                  <div>
                    <div className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
                      {t('tokens.24hVolume')}
                    </div>
                    <div className={`${theme.font.size.body} ${theme.colors.text.primary}`}>
                      {formatNumber(token.totalVolume)}
                    </div>
                  </div>
                  <div>
                    <div className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
                      {t('tokens.circulatingSupply')}
                    </div>
                    <div className={`${theme.font.size.body} ${theme.colors.text.primary}`}>
                      {token.circulatingSupply.toLocaleString()} {token.symbol}
                    </div>
                  </div>
                  <div>
                    <div className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
                      {t('tokens.totalSupply')}
                    </div>
                    <div className={`${theme.font.size.body} ${theme.colors.text.primary}`}>
                      {token.totalSupply.toLocaleString()} {token.symbol}
                    </div>
                  </div>
                </div>
                
                <h3 className={`${theme.font.size.subtitle} ${theme.colors.text.primary} font-semibold mb-4`}>
                  {t('tokens.links')}
                </h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={token.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#131A2A] rounded-xl text-white hover:bg-[#1C2537] transition-colors"
                  >
                    {t('tokens.website')}
                  </a>
                  <a
                    href={token.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#131A2A] rounded-xl text-white hover:bg-[#1C2537] transition-colors"
                  >
                    Twitter
                  </a>
                  <a
                    href={token.explorer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#131A2A] rounded-xl text-white hover:bg-[#1C2537] transition-colors"
                  >
                    {t('tokens.explorer')}
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <h3 className={`${theme.font.size.subtitle} ${theme.colors.text.primary} font-semibold mb-4`}>
                  {t('tokens.recentTransactions')}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#1C2537]">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">
                          {t('tokens.type')}
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">
                          {t('tokens.value')}
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">
                          {t('tokens.tokenAmount')}
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">
                          {t('tokens.account')}
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">
                          {t('tokens.time')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-[#1C2537] hover:bg-[#131A2A]">
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${
                              tx.type === 'swap' 
                                ? 'bg-blue-900/30 text-blue-400' 
                                : tx.type === 'add' 
                                  ? 'bg-green-900/30 text-green-400'
                                  : 'bg-red-900/30 text-red-400'
                            }`}>
                              {tx.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-white">
                            ${tx.value.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-white">
                            {tx.token0Amount} {tx.token0Symbol} {tx.type !== 'remove' && '→'} {tx.type !== 'add' && tx.token1Amount} {tx.type !== 'add' && tx.token1Symbol}
                          </td>
                          <td className="py-3 px-4 text-blue-500">
                            {tx.account}
                          </td>
                          <td className="py-3 px-4 text-gray-400">
                            {tx.time}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right column - Swap widget */}
        <div>
          <div className="bg-[#0D111C] rounded-2xl shadow-lg overflow-hidden border border-[#1C2537]">
            <div className="p-4 border-b border-[#1C2537]">
              <h2 className={`${theme.font.size.subtitle} ${theme.colors.text.primary} font-semibold`}>
                {t('swap.swapTitle')}
              </h2>
            </div>
            
            <div className="p-4">
              {/* From Input Group */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between items-center">
                  <label className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>{t('swap.from')}</label>
                </div>
                
                <div className="flex w-full bg-[#131A2A] rounded-2xl p-1">
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="0.0"
                      className="w-full h-12 px-3 bg-transparent text-lg text-white focus:outline-none"
                      inputMode="decimal"
                    />
                    <div className="px-3 pb-1">
                      <span className="text-xs text-gray-400">
                        ≈ $0.00
                      </span>
                    </div>
                  </div>
                  
                  <button className="flex items-center space-x-1 bg-[#1C2537] rounded-xl px-3 py-2 my-1 mr-1">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      E
                    </div>
                    <span className="text-white font-medium">ETH</span>
                    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Swap Direction Button */}
              <div className="flex justify-center -my-1 mb-3">
                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1C2537] hover:bg-[#252d3f] shadow-lg z-10 transition-colors">
                  <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none">
                    <path d="M7 10l5-5 5 5M7 14l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              {/* To Input Group */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between items-center">
                  <label className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>{t('swap.to')}</label>
                </div>
                
                <div className="flex w-full bg-[#131A2A] rounded-2xl p-1">
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="0.0"
                      className="w-full h-12 px-3 bg-transparent text-lg text-white focus:outline-none"
                      inputMode="decimal"
                    />
                    <div className="px-3 pb-1">
                      <span className="text-xs text-gray-400">
                        ≈ $0.00
                      </span>
                    </div>
                  </div>
                  
                  <button className="flex items-center space-x-1 bg-[#1C2537] rounded-xl px-3 py-2 my-1 mr-1">
                    <span className="text-white">Select token</span>
                    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Connect Wallet Button */}
              <button className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#4338CA] to-[#60A5FA] hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all">
                {t('wallet.connectWallet')}
              </button>
            </div>
          </div>
          
          {/* Pool Information */}
          <div className="mt-6 bg-[#0D111C] rounded-2xl shadow-lg overflow-hidden border border-[#1C2537]">
            <div className="p-4 border-b border-[#1C2537]">
              <h2 className={`${theme.font.size.subtitle} ${theme.colors.text.primary} font-semibold`}>
                {t('pool.poolInformation')}
              </h2>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
                    {t('pool.tvl')}
                  </div>
                  <div className={`${theme.font.size.body} ${theme.colors.text.primary}`}>
                    $245.5M
                  </div>
                </div>
                <div>
                  <div className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
                    {t('pool.24hVolume')}
                  </div>
                  <div className={`${theme.font.size.body} ${theme.colors.text.primary}`}>
                    $42.8M
                  </div>
                </div>
                <div>
                  <div className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
                    {t('pool.24hFees')}
                  </div>
                  <div className={`${theme.font.size.body} ${theme.colors.text.primary}`}>
                    $128.4K
                  </div>
                </div>
                <div>
                  <div className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
                    {t('pool.feeTier')}
                  </div>
                  <div className={`${theme.font.size.body} ${theme.colors.text.primary}`}>
                    0.3%
                  </div>
                </div>
              </div>
              
              <button className="w-full py-3 mt-4 rounded-xl font-medium text-[#FC72FF] bg-[#131A2A] hover:bg-[#1C2537] transition-colors">
                {t('pool.addLiquidity')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetailPage;
