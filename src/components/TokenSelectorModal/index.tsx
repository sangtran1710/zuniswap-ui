import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, MagnifyingGlassIcon, StarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import TokenIcon from '../TokenIcons';
import TokenBadge from '../TokenBadge';

// Uniswap Token List fetch logic
const UNISWAP_TOKEN_LIST = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org';
const POPULAR_SYMBOLS = ['ETH', 'USDC', 'USDT', 'WBTC', 'WETH'];

// Token logos fallback
const TOKEN_LOGOS = {
  'ETH': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  'USDC': 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
  'USDT': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  'WBTC': 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
  'WETH': 'https://assets.coingecko.com/coins/images/2518/small/weth.png'
};

interface Token {
  name: string;
  symbol: string;
  logoURI: string;
  address: string;
  decimals: number;
  badge?: string;
}

interface TokenSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (token: Token) => void;
  from: 'header' | 'swap';
  position?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

const TokenSelectorModal: React.FC<TokenSelectorModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectToken,
  from,
  position
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [popularTokens, setPopularTokens] = useState<Token[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [tokenFetchError, setTokenFetchError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Kiểm tra nếu đang ở chế độ mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px là breakpoint cho mobile
    };
    
    // Kiểm tra lần đầu khi component mount
    checkIfMobile();
    
    // Thêm event listener để kiểm tra khi resize window
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup event listener khi component unmount
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Lọc token theo searchQuery
  const filteredTokens = tokenList.filter((token: Token) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      token.symbol.toLowerCase().includes(q) ||
      (token.name && token.name.toLowerCase().includes(q)) ||
      (token.address && token.address.toLowerCase().includes(q))
    );
  });

  // Prepare demo token data that will always work (as fallback)
  const getDemoTokens = () => {
    const tokens = [
      { name: 'Ethereum', symbol: 'ETH', logoURI: TOKEN_LOGOS.ETH, address: '', decimals: 18 },
      { name: 'USD Coin', symbol: 'USDC', logoURI: TOKEN_LOGOS.USDC, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
      { name: 'Tether', symbol: 'USDT', logoURI: TOKEN_LOGOS.USDT, address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
      { name: 'Wrapped Bitcoin', symbol: 'WBTC', logoURI: TOKEN_LOGOS.WBTC, address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8 },
      { name: 'Wrapped Ether', symbol: 'WETH', logoURI: TOKEN_LOGOS.WETH, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 },
      { name: 'Base ETH', symbol: 'ETH', logoURI: TOKEN_LOGOS.ETH, address: '', decimals: 18, badge: 'B' },
      { name: 'Unichain ETH', symbol: 'ETH', logoURI: TOKEN_LOGOS.ETH, address: '', decimals: 18, badge: '+' },
      { name: 'USD Coin', symbol: 'USDC', logoURI: TOKEN_LOGOS.USDC, address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 }
    ];
    return tokens;
  };

  // Lọc danh sách token để loại bỏ các token trùng lặp dựa trên địa chỉ
  const removeDuplicateTokens = (tokens: Token[]) => {
    const addressMap = new Map();
    return tokens.filter(token => {
      // Nếu token không có địa chỉ, sử dụng kết hợp của symbol và badge (nếu có)
      const key = token.address || `${token.symbol}-${token.badge || 'main'}`;
      if (!addressMap.has(key)) {
        addressMap.set(key, true);
        return true;
      }
      return false;
    });
  };

  // Khởi tạo dữ liệu token demo ngay khi component mount
  useEffect(() => {
    // Luôn khởi tạo dữ liệu demo sẵn sàng
    const demoTokens = getDemoTokens();
    const uniqueTokens = removeDuplicateTokens(demoTokens);
    if (tokenList.length === 0) {
      setTokenList(uniqueTokens);
      // Lọc token phổ biến và đảm bảo không trùng lặp
      const uniquePopularTokens = removeDuplicateTokens(uniqueTokens.filter(t => POPULAR_SYMBOLS.includes(t.symbol)));
      setPopularTokens(uniquePopularTokens);
    }
  }, []);

  // Fetch danh sách token từ Uniswap khi mở modal
  useEffect(() => {
    if (isOpen && !isLoadingTokens) {
      setIsLoadingTokens(true);
      
      // Đảm bảo luôn có dữ liệu demo để hiển thị
      const demoTokens = getDemoTokens();
      const uniqueTokens = removeDuplicateTokens(demoTokens);
      
      // Chỉ cập nhật nếu chưa có dữ liệu
      if (tokenList.length === 0) {
        setTokenList(uniqueTokens);
        setPopularTokens(uniqueTokens.filter(t => POPULAR_SYMBOLS.includes(t.symbol)));
      }
      
      // Thử fetch từ Uniswap
      fetch(UNISWAP_TOKEN_LIST)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          setTokenFetchError(null);
          if (data.tokens && data.tokens.length > 0) {
            // Map tokens để đảm bảo có đầy đủ thuộc tính
            const mappedTokens = data.tokens.map((token: any) => ({
              ...token,
              logoURI: TOKEN_LOGOS[token.symbol as keyof typeof TOKEN_LOGOS] || token.logoURI
            }));
            // Lọc token trùng lặp
            const uniqueMappedTokens = removeDuplicateTokens(mappedTokens);
            setTokenList(uniqueMappedTokens);
            // Lọc token phổ biến và đảm bảo không trùng lặp
            const uniquePopularTokens = removeDuplicateTokens(uniqueMappedTokens.filter((t:any) => POPULAR_SYMBOLS.includes(t.symbol)));
            setPopularTokens(uniquePopularTokens);
          } else {
            // Nếu không có token nào từ API, sử dụng dữ liệu demo
            setTokenList(uniqueTokens);
            setPopularTokens(uniqueTokens.filter(t => POPULAR_SYMBOLS.includes(t.symbol)));
          }
        })
        .catch(error => {
          console.error('Error fetching token list:', error);
          setTokenFetchError('Failed to load token list. Using demo data instead.');
          // Đảm bảo vẫn hiển thị dữ liệu demo khi có lỗi
          setTokenList(uniqueTokens);
          setPopularTokens(uniqueTokens.filter(t => POPULAR_SYMBOLS.includes(t.symbol)));
        })
        .finally(() => {
          setIsLoadingTokens(false);
        });
    }
  }, [isOpen]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Tính toán vị trí modal dựa trên position của button
  const getModalStyle = (): React.CSSProperties => {
    if (isMobile || !position) {
      return {};
    }

    const modalWidth = 400;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const gap = 8; // space between button and modal

    // horizontal positioning
    let left = position.left - (modalWidth - position.width) / 2;
    if (left < 20) left = 20;
    if (left + modalWidth > viewportWidth - 20) {
      left = viewportWidth - modalWidth - 20;
    }

    // vertical positioning with auto-flip
    const maxModalHeight = Math.min(viewportHeight * 0.85, 600);
    const spaceBelow = viewportHeight - (position.top + position.height);
    const spaceAbove = position.top;

    let top: number;
    if (spaceBelow >= maxModalHeight + gap) {
      // enough space below
      top = position.top + position.height + gap;
    } else if (spaceAbove >= maxModalHeight + gap) {
      // place above
      top = position.top - maxModalHeight - gap;
    } else if (spaceBelow >= spaceAbove) {
      // use below but clamp height
      top = position.top + position.height + gap;
    } else {
      // use above but clamp
      top = Math.max(20, position.top - maxModalHeight - gap);
    }

    // Ensure within viewport boundaries
    const bottomBoundary = viewportHeight - maxModalHeight - 20;
    if (top > bottomBoundary) top = bottomBoundary;
    if (top < 20) top = 20;

    return {
      position: 'absolute' as const,
      top: `${top}px`,
      left: `${left}px`,
      width: `${modalWidth}px`,
      maxHeight: `${maxModalHeight}px`,
      margin: 0,
    };
  };

  return (
    <div className="fixed inset-0 z-[102] flex items-center justify-center">
      {/* Overlay with blur effect */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm z-[101]" 
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div 
        ref={modalRef}
        style={getModalStyle()}
        className={`
          bg-[#0D111C] rounded-2xl w-full shadow-xl overflow-hidden z-[102] 
          ${isMobile ? 'fixed inset-0 rounded-none' : 'max-w-md'} 
          ${from === 'swap' ? '' : ''} 
          max-h-[85vh] flex flex-col relative
          ${isMobile ? 'h-full max-h-full' : ''}
        `}
      >
        {/* Modal header */}
        <div className="p-4 flex items-center justify-between border-b border-[#293249]">
          <h2 className="text-xl font-semibold text-white">Select a token</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#293249] transition-colors"
            aria-label="Close token selection"
          >
            <XMarkIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        {/* Search input */}
        <div className="p-4 border-b border-[#293249]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search name or paste address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131A2A] rounded-2xl pl-10 pr-24 py-2.5 text-base text-white placeholder-gray-500
                       focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
              autoFocus
            />
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            
            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-[72px] top-2.5 p-1 rounded-lg hover:bg-[#293249] transition-colors"
                aria-label="Clear search"
              >
                <XMarkIcon className="w-4 h-4 text-gray-400" />
              </button>
            )}
            
            {/* Network Selector (disabled) */}
            <button 
              className="absolute right-2 top-2 px-2 py-1 rounded-xl bg-[#293249] hover:bg-[#3a4158] 
                         flex items-center gap-1 text-sm text-white transition-colors opacity-50 cursor-not-allowed"
              disabled
            >
              <span>Ethereum</span>
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Token content */}
        <div className="flex-1 overflow-hidden">
          {isLoadingTokens ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <>
              {/* Popular tokens */}
              <div className="p-4 border-b border-[#293249]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <StarIcon className="w-4 h-4 text-[#E9B63A] mr-1" />
                    <span className="text-xs text-[#99A1BD] font-semibold">Popular Tokens</span>
                  </div>
                  {tokenFetchError && (
                    <div className="flex items-center text-[#99A1BD] text-xs cursor-help group relative">
                      <span className="mr-1 text-[10px]">ℹ️</span>
                      <span className="underline dotted">Using demo data</span>
                      <div className="absolute bottom-full right-0 mb-2 w-48 bg-[#191B1F] text-white text-xs p-2 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        {tokenFetchError}
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {popularTokens.map((token, idx) => (
                    <button
                      key={token.symbol + (token.address || '') + idx}
                      onClick={() => onSelectToken(token)}
                      className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-[#293249] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center relative mb-1">
                        <TokenIcon symbol={token.symbol} className="w-6 h-6" />
                      </div>
                      <span className="text-white text-sm">{token.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Token List */}
              <div className="flex-1 overflow-y-auto max-h-[300px]">
                <div className="sticky top-0 bg-[#0D111C] z-10 px-4 pt-3 pb-1 flex items-center justify-between">
                  <div className="flex items-center">
                    <StarIcon className="w-4 h-4 text-[#E9B63A] mr-1" />
                    <span className="text-xs text-[#99A1BD] font-semibold">Tokens by 24h volume</span>
                  </div>
                </div>
                
                <ul className="px-2">
                  {filteredTokens.map((token, idx) => (
                    <li key={token.symbol + (token.address || '') + idx}>
                      <button
                        onClick={() => onSelectToken(token)}
                        className="flex items-center justify-between w-full px-2 py-2.5 rounded-xl hover:bg-[#293249] transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="mr-3 w-8 h-8 rounded-full overflow-hidden flex items-center justify-center relative">
                            <TokenIcon symbol={token.symbol} className="w-8 h-8" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="text-white font-medium mr-1.5">{token.name || token.symbol}</span>
                              {token.badge && <TokenBadge badge={token.badge} />}
                            </div>
                            <div className="text-[#99A1BD] text-xs flex items-center">
                              <span>{token.symbol}</span>
                              {token.address && <span className="ml-1.5 opacity-80">{token.address.slice(0, 6)}...{token.address.slice(-4)}</span>}
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
                
                {/* Scroll Indicator */}
                <div className="h-12 sticky bottom-0 flex items-center justify-center bg-gradient-to-t from-[#0D111C] to-transparent pointer-events-none">
                  <div className="text-[#99A1BD] text-xs flex flex-col items-center">
                    <span>Scroll to learn more</span>
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1">
                      <path d="M0.97168 1L6.20532 6L11.439 1" stroke="#99A1BD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenSelectorModal;
