import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';

interface TokenPriceChartProps {
  tokenSymbol: string;
  tokenId?: string;
}

type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';

// Mock data generator for price chart
const generateMockPriceData = (days: number, volatility: number, trend: 'up' | 'down' | 'sideways' = 'sideways') => {
  const data = [];
  let price = 1000 + Math.random() * 500; // Starting price between 1000-1500
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some randomness with trend bias
    let change = (Math.random() - 0.5) * volatility;
    if (trend === 'up') change += volatility * 0.3;
    if (trend === 'down') change -= volatility * 0.3;
    
    price += change;
    if (price < 10) price = 10; // Prevent negative or very low prices
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: price,
      volume: Math.random() * 1000000 + 500000
    });
  }
  
  return data;
};

const TokenPriceChart: React.FC<TokenPriceChartProps> = ({ tokenSymbol, tokenId }) => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRange>('1W');
  const [priceData, setPriceData] = useState<any[]>([]);
  const [priceChange, setPriceChange] = useState<{ value: number; percentage: number }>({ value: 0, percentage: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API fetch with different data based on time range
    setTimeout(() => {
      let days = 0;
      let volatility = 0;
      let trend: 'up' | 'down' | 'sideways' = 'sideways';
      
      switch (timeRange) {
        case '1D':
          days = 1;
          volatility = 20;
          trend = 'up';
          break;
        case '1W':
          days = 7;
          volatility = 50;
          trend = 'down';
          break;
        case '1M':
          days = 30;
          volatility = 100;
          trend = 'sideways';
          break;
        case '3M':
          days = 90;
          volatility = 200;
          trend = 'up';
          break;
        case '1Y':
          days = 365;
          volatility = 300;
          trend = 'up';
          break;
        case 'ALL':
          days = 1000;
          volatility = 500;
          trend = 'up';
          break;
      }
      
      const data = generateMockPriceData(days, volatility, trend);
      setPriceData(data);
      
      // Calculate price change
      if (data.length > 1) {
        const firstPrice = data[0].price;
        const lastPrice = data[data.length - 1].price;
        const changeValue = lastPrice - firstPrice;
        const changePercentage = (changeValue / firstPrice) * 100;
        
        setPriceChange({
          value: changeValue,
          percentage: changePercentage
        });
      }
      
      setIsLoading(false);
    }, 500);
  }, [timeRange, tokenSymbol, tokenId]);
  
  // Find min and max values for scaling the chart
  const maxPrice = priceData.length ? Math.max(...priceData.map(d => d.price)) : 0;
  const minPrice = priceData.length ? Math.min(...priceData.map(d => d.price)) : 0;
  const range = maxPrice - minPrice;
  
  // Calculate chart height and scaling
  const chartHeight = 200;
  const chartWidth = '100%';
  
  // Function to convert price to y-coordinate
  const getYCoordinate = (price: number) => {
    return chartHeight - ((price - minPrice) / range) * chartHeight;
  };
  
  // Generate SVG path for the chart
  const generatePath = () => {
    if (priceData.length === 0) return '';
    
    const points = priceData.map((d, i) => {
      const x = (i / (priceData.length - 1)) * 100 + '%';
      const y = getYCoordinate(d.price);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };
  
  // Generate area fill below the line
  const generateAreaPath = () => {
    if (priceData.length === 0) return '';
    
    const points = priceData.map((d, i) => {
      const x = (i / (priceData.length - 1)) * 100 + '%';
      const y = getYCoordinate(d.price);
      return `${x},${y}`;
    });
    
    const firstX = '0%';
    const lastX = '100%';
    const bottomY = chartHeight;
    
    return `M ${firstX},${bottomY} L ${points.join(' L ')} L ${lastX},${bottomY} Z`;
  };
  
  return (
    <div className="w-full bg-[#0D111C] rounded-2xl p-4 border border-[#1C2537]">
      {/* Header with token info and price change */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className={`${theme.font.size.subtitle} ${theme.colors.text.primary} font-semibold`}>
            {tokenSymbol} {t('chart.price')}
          </h3>
          <div className="flex items-center mt-1">
            <span className={`${theme.font.size.body} ${theme.colors.text.primary}`}>
              ${priceData.length ? priceData[priceData.length - 1].price.toFixed(2) : '0.00'}
            </span>
            <span className={`ml-2 text-sm ${priceChange.percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {priceChange.percentage >= 0 ? '↑' : '↓'} 
              {priceChange.percentage.toFixed(2)}%
            </span>
          </div>
        </div>
        
        {/* Time range selector */}
        <div className="flex space-x-1 bg-[#131A2A] rounded-lg p-1">
          {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2 py-1 text-xs font-medium rounded-md ${
                timeRange === range
                  ? 'bg-[#1C2537] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      {/* Chart */}
      <div className="relative h-[200px] w-full">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FC72FF]"></div>
          </div>
        ) : (
          <svg width={chartWidth} height={chartHeight} className="overflow-visible">
            {/* Price gradient fill */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={priceChange.percentage >= 0 ? '#22c55e' : '#ef4444'} stopOpacity="0.2" />
                <stop offset="100%" stopColor={priceChange.percentage >= 0 ? '#22c55e' : '#ef4444'} stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Area fill */}
            <path
              d={generateAreaPath()}
              fill="url(#areaGradient)"
              strokeWidth="0"
            />
            
            {/* Price line */}
            <path
              d={generatePath()}
              fill="none"
              stroke={priceChange.percentage >= 0 ? '#22c55e' : '#ef4444'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Current price indicator dot */}
            {priceData.length > 0 && (
              <circle
                cx="100%"
                cy={getYCoordinate(priceData[priceData.length - 1].price)}
                r="4"
                fill={priceChange.percentage >= 0 ? '#22c55e' : '#ef4444'}
              />
            )}
          </svg>
        )}
      </div>
      
      {/* Volume bars (simplified) */}
      <div className="mt-4">
        <h4 className={`${theme.font.size.label} ${theme.colors.text.secondary} mb-2`}>
          {t('chart.volume')}
        </h4>
        <div className="flex items-end h-16 space-x-1">
          {priceData.slice(-20).map((d, i) => (
            <div
              key={i}
              className="flex-1 bg-[#1C2537] rounded-sm"
              style={{
                height: `${(d.volume / 1000000) * 100}%`,
                maxHeight: '100%'
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <div className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
            {t('chart.marketCap')}
          </div>
          <div className={`${theme.font.size.body} ${theme.colors.text.primary}`}>
            $10.2B
          </div>
        </div>
        <div>
          <div className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
            {t('chart.tvl')}
          </div>
          <div className={`${theme.font.size.body} ${theme.colors.text.primary}`}>
            $1.5B
          </div>
        </div>
        <div>
          <div className={`${theme.font.size.label} ${theme.colors.text.secondary}`}>
            {t('chart.24hVolume')}
          </div>
          <div className={`${theme.font.size.body} ${theme.colors.text.primary}`}>
            $425M
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenPriceChart;
