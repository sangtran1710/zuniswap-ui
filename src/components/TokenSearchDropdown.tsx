import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

// Interface cho token
interface Token {
  name: string;
  symbol: string;
  address: string;
  logoURI: string;
  price: number;
  priceChangePercentage24h: number;
}

// Danh sách token phổ biến
const POPULAR_TOKENS: Token[] = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    price: 1770.72,
    priceChangePercentage24h: -1.43
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    price: 1.00,
    priceChangePercentage24h: 0.00
  },
  {
    name: 'Tether USD',
    symbol: 'USDT',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    price: 1.00,
    priceChangePercentage24h: 0.00
  },
  {
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    logoURI: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
    price: 91040.63,
    priceChangePercentage24h: 4.73
  },
  {
    name: 'Binance USD',
    symbol: 'BUSD',
    address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
    logoURI: 'https://assets.coingecko.com/coins/images/9576/small/BUSD.png',
    price: 1.00,
    priceChangePercentage24h: 0.01
  },
  {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png',
    price: 1.00,
    priceChangePercentage24h: 0.02
  }
];

// Danh sách token XRP và các biến thể
const XRP_TOKENS: Token[] = [
  {
    name: 'XRP Token',
    symbol: 'XRP',
    address: '0xD2F2a2983017f52E2C4107F5E3DB9b45D4C38B8E',
    logoURI: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
    price: 2.27,
    priceChangePercentage24h: 1.79
  },
  {
    name: 'HarryPotterObamaPacMan8Inu',
    symbol: 'XRP',
    address: '0x07E0B7B6B4a7B98ae01A68Ae',
    logoURI: 'https://assets.coingecko.com/coins/images/33548/small/hpos.png',
    price: 0.00310,
    priceChangePercentage24h: -3.38
  },
  {
    name: 'Wrapped XRP',
    symbol: 'WXRP',
    address: '0x39fB08C4F2c9aE1B9',
    logoURI: 'https://assets.coingecko.com/coins/images/23407/small/wxrp.png',
    price: 2.30,
    priceChangePercentage24h: 3.54
  },
  {
    name: 'XRP20',
    symbol: 'XRP20',
    address: '0xE4a8a2E7d',
    logoURI: 'https://assets.coingecko.com/coins/images/31523/small/xrp20.jpg',
    price: 0.00000927,
    priceChangePercentage24h: -1.22
  },
  {
    name: 'Based XRP',
    symbol: 'XRP',
    address: '0xE7F1a088B',
    logoURI: 'https://assets.coingecko.com/coins/images/33549/small/bxrp.png',
    price: 0.0000197,
    priceChangePercentage24h: -5.58
  },
  {
    name: 'XRP (Universal)',
    symbol: 'uXRP',
    address: '0x2615a93aE',
    logoURI: 'https://assets.coingecko.com/coins/images/31524/small/uxrp.png',
    price: 2.27,
    priceChangePercentage24h: 1.42
  },
  {
    name: 'XRP Legion',
    symbol: 'XRPL',
    address: '0x872a5398',
    logoURI: 'https://assets.coingecko.com/coins/images/31525/small/xrpl.png',
    price: 0.00000826,
    priceChangePercentage24h: -1.60
  },
  {
    name: 'XRPLINKSWIFT',
    symbol: 'XRPLINKSWIFT',
    address: '0x1072aF7E',
    logoURI: 'https://assets.coingecko.com/coins/images/31526/small/xrpls.png',
    price: 0.00,
    priceChangePercentage24h: 0.00
  }
];

// Props cho TokenSearchDropdown
interface TokenSearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearchTerm?: string;
  onSelectToken?: (token: Token) => void;
  anchorToInput?: boolean;
}

const TokenSearchDropdown: React.FC<TokenSearchDropdownProps> = ({ 
  isOpen, 
  onClose,
  initialSearchTerm = '',
  onSelectToken,
  anchorToInput = false
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [tokens, setTokens] = useState<Token[]>(POPULAR_TOKENS);
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [showPopularTokens, setShowPopularTokens] = useState(true);
  const [searchResults, setSearchResults] = useState<{[key: string]: Token[]}>({});

  // Debounce searchTerm
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Cập nhật searchTerm khi initialSearchTerm thay đổi
  useEffect(() => {
    if (initialSearchTerm !== searchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  // Xử lý đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Fetch Uniswap Token List khi mở dropdown
  useEffect(() => {
    if (!isOpen) return;
    const fetchTokens = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://tokens.uniswap.org');
        const data = await response.json();
        const mainnetTokens = data.tokens
          .filter((t: { chainId: number }) => t.chainId === 1)
          .map((t: { name: string; symbol: string; address: string; logoURI: string }) => ({
            name: t.name,
            symbol: t.symbol,
            address: t.address,
            logoURI: t.logoURI,
            price: 0,
            priceChangePercentage24h: 0
          }));
        // --- Sử dụng dữ liệu mẫu thay vì gọi API CoinGecko ---
        setFetchingPrice(true);
        console.log('Sử dụng dữ liệu mẫu cho giá token trong TokenSearchDropdown');
        
        // Tạo dữ liệu giá mẫu
        let priceMap: Record<string, { price: number; change: number }> = {};
        let priceError = false;
        
        try {
          // Gán giá mẫu cho các token phổ biến dựa trên symbol
          for (const token of mainnetTokens) {
            const symbol = token.symbol.toLowerCase();
            const address = token.address.toLowerCase();
            
            if (symbol.includes('eth') || symbol === 'weth') {
              priceMap[address] = { price: 3000 + Math.random() * 200, change: 2.5 };
            } else if (symbol.includes('btc') || symbol === 'wbtc') {
              priceMap[address] = { price: 60000 + Math.random() * 1000, change: 1.8 };
            } else if (symbol.includes('usdc') || symbol === 'usdc') {
              priceMap[address] = { price: 1, change: 0.01 };
            } else if (symbol.includes('usdt') || symbol === 'usdt') {
              priceMap[address] = { price: 1, change: 0.02 };
            } else if (symbol.includes('dai')) {
              priceMap[address] = { price: 1, change: 0 };
            } else if (symbol.includes('link')) {
              priceMap[address] = { price: 15 + Math.random() * 2, change: 3.2 };
            } else if (symbol.includes('uni')) {
              priceMap[address] = { price: 7 + Math.random(), change: -1.5 };
            } else if (symbol.includes('matic')) {
              priceMap[address] = { price: 0.8 + Math.random() * 0.2, change: 5.1 };
            } else {
              // Giá ngẫu nhiên cho các token khác
              priceMap[address] = { 
                price: 0.1 + Math.random() * 10, 
                change: (Math.random() * 10) - 5 // -5% đến +5%
              };
            }
          }
        } catch (err) {
          console.error('Lỗi khi tạo dữ liệu giá mẫu:', err);
          priceError = true;
        }
        // Map giá vào token
        const tokensWithPrice = mainnetTokens.map((token: Token) => {
          const priceData = priceMap[token.address.toLowerCase()];
          return {
            ...token,
            price: priceData ? priceData.price : 0,
            priceChangePercentage24h: priceData ? priceData.change : 0
          };
        });
        setAllTokens(tokensWithPrice);
        setTokens(tokensWithPrice);
        setFetchingPrice(false);
        if (priceError) setError('Lỗi khi tạo dữ liệu giá token mẫu.');
      } catch (err) {
        setAllTokens(POPULAR_TOKENS);
        setTokens(POPULAR_TOKENS);
        setError('Không thể tải danh sách token.');
      } finally {
        setLoading(false);
      }
    };
    fetchTokens();
  }, [isOpen]);

  // Lọc tokens dựa trên từ khóa tìm kiếm (debounced)
  useEffect(() => {
    if (!debouncedSearch) {
      setTokens(allTokens.length > 0 ? allTokens : POPULAR_TOKENS);
      setShowPopularTokens(true);
      setSearchResults({});
    } else {
      setShowPopularTokens(false);
      
      // Kiểm tra nếu tìm kiếm XRP
      if (debouncedSearch.toLowerCase() === 'xrp') {
        setSearchResults({
          'Tokens': XRP_TOKENS
        });
        setTokens([]);
        return;
      }
      
      // Tìm kiếm thông thường
      const filtered = (allTokens.length > 0 ? allTokens : POPULAR_TOKENS).filter(token =>
        token.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        token.symbol.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        token.address.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      
      // Nhóm kết quả theo symbol
      const groupedResults: {[key: string]: Token[]} = {};
      filtered.forEach(token => {
        const firstChar = token.symbol.charAt(0).toUpperCase();
        if (!groupedResults[firstChar]) {
          groupedResults[firstChar] = [];
        }
        groupedResults[firstChar].push(token);
      });
      
      setSearchResults(groupedResults);
      setTokens(filtered);
    }
  }, [debouncedSearch, allTokens]);

  // Focus input khi mở dropdown
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Format địa chỉ token
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Fallback SVG icon
  const FallbackTokenIcon = () => (
    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 mr-3">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-gray-300">
        <circle cx="12" cy="12" r="10" fill="#444" />
        <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#fff">🪙</text>
      </svg>
    </span>
  );

  // Component: TokenLogoWithFallback
  function TokenLogoWithFallback({ src, alt }: { src: string; alt: string }) {
    const [hasError, setHasError] = React.useState(false);
    if (hasError) return <FallbackTokenIcon />;
    return (
      <img
        src={src}
        alt={alt}
        className="w-10 h-10 rounded-full mr-3 bg-gray-700 border border-gray-600 object-contain"
        onError={() => setHasError(true)}
      />
    );
  }

  // Skeleton loading for token row
  const TokenRowSkeleton = () => (
    <div className="flex items-center justify-between py-3 px-4 animate-pulse">
      <div className="flex items-center">
        <span className="w-10 h-10 rounded-full bg-gray-700 mr-3" />
        <div>
          <div className="h-4 w-24 bg-gray-700 rounded mb-1" />
          <div className="h-3 w-16 bg-gray-800 rounded" />
        </div>
      </div>
      <div className="text-right">
        <div className="h-4 w-16 bg-gray-700 rounded mb-1" />
        <div className="h-3 w-10 bg-gray-800 rounded" />
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className={`absolute w-full max-w-[440px] bg-[#181A20] rounded-2xl shadow-2xl z-50 overflow-hidden border border-[#23242a] ${!anchorToInput ? 'left-1/2 top-[72px] transform -translate-x-1/2' : 'top-[48px]'}`}
      style={{maxHeight: '70vh', overflowY: 'auto', fontFamily: 'Inter, Roboto, Arial, sans-serif'}}
    >
      {/* Search input - chỉ hiển thị khi không anchorToInput */}
      {!anchorToInput && (
        <div className="p-4 border-b border-[#23242a]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('tokens.searchPlaceholder')}
              className="w-full pl-10 pr-10 py-3 bg-[#23242a] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
            />
            {searchTerm && (
              <button 
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchTerm('')}
              >
                <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading/error/empty state */}
      {loading || fetchingPrice ? (
        <div className="py-6 px-4">
          {[...Array(8)].map((_, i) => <TokenRowSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-400 font-semibold text-base">
          {error}
        </div>
      ) : tokens.length === 0 && Object.keys(searchResults).length === 0 ? (
        <div className="py-8 text-center text-gray-400 font-semibold text-base">
          {t('tokens.noResults')} "{searchTerm}"
        </div>
      ) : (
        <div className="bg-[#181A20] custom-scrollbar">
          {error && (
            <div className="px-4 py-2 text-red-400 text-sm font-semibold text-center bg-[#23242a] rounded mb-2">
              {error}
            </div>
          )}
          
          {/* Hiển thị Popular tokens */}
          {showPopularTokens && (
            <>
              <div className="px-4 py-2 flex items-center">
                <div className="text-gray-300 text-sm font-medium flex items-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-1">
                    <path d="M2 9L12 2L22 9V20H2V9Z" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 15C16 13.9 15.1 13 14 13C12.9 13 12 13.9 12 15C12 16.1 12.9 17 14 17C15.1 17 16 16.1 16 15Z" fill="currentColor" />
                    <path d="M8 18C8 16.9 7.1 16 6 16C4.9 16 4 16.9 4 18C4 19.1 4.9 20 6 20C7.1 20 8 19.1 8 18Z" fill="currentColor" />
                  </svg>
                  Popular tokens
                  <span className="ml-1 inline-flex items-center justify-center w-5 h-5 bg-gray-700 text-xs rounded-full text-gray-300">
                    {POPULAR_TOKENS.length}
                  </span>
                </div>
              </div>
              
              {POPULAR_TOKENS.map((token, index) => (
                <div 
                  key={`popular-${token.symbol}-${index}`}
                  className="flex items-center justify-between py-3 px-4 hover:bg-[#23242a] cursor-pointer transition-colors duration-150 group"
                  onClick={() => onSelectToken && onSelectToken(token)}
                  style={{borderBottom: '1px solid #202127'}}
                >
                  {/* Left: Logo and name */}
                  <div className="flex items-center">
                    <TokenLogoWithFallback src={token.logoURI} alt={token.symbol} />
                    <div>
                      <div className="text-white font-semibold text-base leading-tight">{token.name}</div>
                      <div className="flex text-xs text-gray-500">
                        <span className="font-medium">{token.symbol}</span>
                        {token.address && (
                          <span className="ml-1 font-mono">{truncateAddress(token.address)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Price and percentage */}
                  <div className="text-right min-w-[90px]">
                    <div className="text-white font-bold text-base">
                      {token.price > 0 ? `$${token.price.toLocaleString(undefined, {maximumFractionDigits: 6})}` : <span className="text-gray-500">N/A</span>}
                    </div>
                    <div className={`text-xs font-semibold ${token.priceChangePercentage24h > 0 ? 'text-green-400' : token.priceChangePercentage24h < 0 ? 'text-red-400' : 'text-gray-400'} flex items-center justify-end`}>
                      {token.priceChangePercentage24h > 0 ? '▲' : token.priceChangePercentage24h < 0 ? '▼' : ''} 
                      {token.priceChangePercentage24h !== 0 ? `${Math.abs(token.priceChangePercentage24h).toFixed(2)}%` : '0.00%'}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          
          {/* Hiển thị kết quả tìm kiếm theo nhóm */}
          {Object.entries(searchResults).map(([groupName, groupTokens]) => (
            <div key={`group-${groupName}`}>
              <div className="px-4 py-2 flex items-center">
                <div className="text-gray-300 text-sm font-medium">
                  {groupName}
                  <span className="ml-1 inline-flex items-center justify-center w-5 h-5 bg-gray-700 text-xs rounded-full text-gray-300">
                    {groupTokens.length}
                  </span>
                </div>
              </div>
              
              {groupTokens.map((token, index) => (
                <div 
                  key={`${groupName}-${token.symbol}-${index}`}
                  className="flex items-center justify-between py-3 px-4 hover:bg-[#23242a] cursor-pointer transition-colors duration-150 group"
                  onClick={() => onSelectToken && onSelectToken(token)}
                  style={{borderBottom: '1px solid #202127'}}
                >
                  {/* Left: Logo and name */}
                  <div className="flex items-center">
                    <TokenLogoWithFallback src={token.logoURI} alt={token.symbol} />
                    <div>
                      <div className="text-white font-semibold text-base leading-tight">{token.name}</div>
                      <div className="flex text-xs text-gray-500">
                        <span className="font-medium">{token.symbol}</span>
                        {token.address && (
                          <span className="ml-1 font-mono">{truncateAddress(token.address)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Price and percentage */}
                  <div className="text-right min-w-[90px]">
                    <div className="text-white font-bold text-base">
                      {token.price > 0 ? `$${token.price.toLocaleString(undefined, {maximumFractionDigits: 6})}` : <span className="text-gray-500">N/A</span>}
                    </div>
                    <div className={`text-xs font-semibold ${token.priceChangePercentage24h > 0 ? 'text-green-400' : token.priceChangePercentage24h < 0 ? 'text-red-400' : 'text-gray-400'} flex items-center justify-end`}>
                      {token.priceChangePercentage24h > 0 ? '▲' : token.priceChangePercentage24h < 0 ? '▼' : ''} 
                      {token.priceChangePercentage24h !== 0 ? `${Math.abs(token.priceChangePercentage24h).toFixed(2)}%` : '0.00%'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {/* Custom scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #23242a;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default TokenSearchDropdown; 