import React, { useState, useEffect, useRef } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Interface cho token
interface Token {
  name: string;
  symbol: string;
  address: string;
  logoURI: string;
  price: number;
  priceChangePercentage24h: number;
}

// Danh sách token mẫu
const POPULAR_TOKENS: Token[] = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    price: 1695.33,
    priceChangePercentage24h: 7.05
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
  }
];

// Token BTC và các biến thể
const BTC_TOKENS: Token[] = [
  {
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    logoURI: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
    price: 91040.63,
    priceChangePercentage24h: 4.73
  },
  {
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    logoURI: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
    price: 90980.85,
    priceChangePercentage24h: 4.68
  },
  {
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    address: '0x97B8B7DE0385Fe7D5Ac7a8F7019Be23e9AF8aFB8',
    logoURI: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
    price: 90589.42,
    priceChangePercentage24h: 4.26
  },
  {
    name: 'Coinbase Wrapped BTC',
    symbol: 'cbBTC',
    address: '0xbcb7b7b733f3372E38F1C3F5C0d7BaC9D96511B5',
    logoURI: 'https://assets.coingecko.com/coins/images/30791/small/cbBTC_200x200.png',
    price: 91035.48,
    priceChangePercentage24h: 4.75
  },
  {
    name: 'Coinbase Wrapped BTC',
    symbol: 'cbBTC',
    address: '0xcbb8d35fa7a23bf7eae66d4e608a4f21499b12095',
    logoURI: 'https://assets.coingecko.com/coins/images/30791/small/cbBTC_200x200.png',
    price: 91341.05,
    priceChangePercentage24h: 4.92
  },
  {
    name: 'Lombard Staked Bitcoin',
    symbol: 'LBTC',
    address: '0x8236d19fE3B04B91DB2Fabd22871BcF4414C4494',
    logoURI: 'https://assets.coingecko.com/coins/images/33381/small/lbtc.png',
    price: 90905.32,
    priceChangePercentage24h: 4.88
  },
  {
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    address: '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
    logoURI: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
    price: 91035.20,
    priceChangePercentage24h: 4.84
  },
  {
    name: '(PoS) Wrapped BTC',
    symbol: 'WBTC',
    address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
    logoURI: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
    price: 90960.27,
    priceChangePercentage24h: 4.61
  }
];

// Props cho TokenSearchDropdown
interface TokenSearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearchTerm?: string;
}

const TokenSearchDropdown: React.FC<TokenSearchDropdownProps> = ({ 
  isOpen, 
  onClose,
  initialSearchTerm = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [tokens, setTokens] = useState<Token[]>(POPULAR_TOKENS);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Lọc tokens dựa trên từ khóa tìm kiếm
  useEffect(() => {
    if (searchTerm.toLowerCase() === 'btc' || searchTerm.toLowerCase() === 'bitcoin') {
      setTokens(BTC_TOKENS);
    } else if (searchTerm === '') {
      setTokens(POPULAR_TOKENS);
    } else {
      // Lọc từ danh sách đầy đủ (giả định)
      const filtered = [...POPULAR_TOKENS, ...BTC_TOKENS].filter(token => 
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setTokens(filtered);
    }
  }, [searchTerm]);

  // Format địa chỉ token
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute left-1/2 top-[72px] transform -translate-x-1/2 w-full max-w-md bg-[#10141F] rounded-xl shadow-2xl z-50 overflow-hidden"
      style={{maxHeight: '70vh', overflowY: 'auto'}}
    >
      {/* Tokens section header */}
      <div className="px-4 py-2 bg-[#10141F] text-gray-400 text-sm font-medium">
        {searchTerm ? 'Tokens' : 'Popular tokens'}
        <span className="ml-1 inline-flex items-center justify-center w-4 h-4 bg-gray-700 text-xs rounded-full">
          {tokens.length}
        </span>
      </div>

      {/* Token list */}
      <div className="bg-[#10141F]">
        {tokens.length > 0 ? (
          tokens.map((token, index) => (
            <div 
              key={`${token.symbol}-${token.address}-${index}`}
              className="flex items-center justify-between py-3 px-4 hover:bg-[#1a1e2e] cursor-pointer"
            >
              {/* Left: Logo and name */}
              <div className="flex items-center">
                <img 
                  src={token.logoURI} 
                  alt={token.symbol} 
                  className="w-8 h-8 rounded-full mr-3"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'; // Fallback image
                  }}
                />
                <div>
                  <div className="text-white font-medium">{token.name}</div>
                  <div className="flex text-xs text-gray-500">
                    <span>{token.symbol}</span>
                    <span className="ml-1">{truncateAddress(token.address)}</span>
                  </div>
                </div>
              </div>

              {/* Right: Price and percentage */}
              <div className="text-right">
                <div className="text-white font-medium">${token.price.toLocaleString()}</div>
                <div className={`text-xs ${token.priceChangePercentage24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ▲ {Math.abs(token.priceChangePercentage24h).toFixed(2)}%
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-gray-500">
            No tokens found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenSearchDropdown; 