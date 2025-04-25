// Cấu hình cho TokenBackground - Có thể điều chỉnh dễ dàng
export const tokenBackgroundConfig = {
  // Số lượng token hiển thị, điều chỉnh tùy theo hiệu suất
  numTokens: 15,
  
  // Tốc độ chuyển động
  speed: {
    min: 30, // Thời gian tối thiểu cho một chu kỳ animation (giây)
    max: 60  // Thời gian tối đa cho một chu kỳ animation (giây)
  },
  
  // Độ mờ của các token
  blur: {
    min: 2,  // Độ mờ tối thiểu (px)
    max: 6   // Độ mờ tối đa (px)
  },
  
  // Kích thước của token
  size: {
    min: 50, // Kích thước nhỏ nhất (px)
    max: 80  // Kích thước lớn nhất (px)
  },
  
  // Biên độ chuyển động
  amplitude: {
    min: 10, // Biên độ chuyển động tối thiểu (%)
    max: 30  // Biên độ chuyển động tối đa (%)
  },
  
  // Độ trong suốt của token
  opacity: {
    min: 0.4, // Độ trong suốt tối thiểu
    max: 0.7  // Độ trong suốt tối đa
  },
  
  // Hiệu ứng hover
  hover: {
    scale: 1.2,         // Độ phóng to khi hover
    blurReduction: 0,   // Giảm độ mờ xuống giá trị này (px)
    glowIntensity: 20   // Cường độ hiệu ứng phát sáng (px)
  },
  
  // Tỷ lệ token theo loại đường đi
  pathTypes: {
    circular: 0.6,      // Tỷ lệ token di chuyển theo đường tròn
    bezier: 0.4         // Tỷ lệ token di chuyển theo đường cong Bezier
  },
  
  // Hiệu ứng xoay
  rotation: {
    enable: true,       // Bật/tắt hiệu ứng xoay
    minDegree: -15,     // Góc xoay tối thiểu ban đầu
    maxDegree: 15,      // Góc xoay tối đa ban đầu
    minSpeed: 0.2,      // Tốc độ xoay tối thiểu
    maxSpeed: 0.8       // Tốc độ xoay tối đa
  }
};

// Danh sách token với màu sắc và biểu tượng
export const tokensList = [
  { symbol: 'ETH', name: 'Ethereum', color: '#627EEA', change: 2.34 },
  { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A', change: 1.52 },
  { symbol: 'UNI', name: 'Uniswap', color: '#FF007A', change: -0.89 },
  { symbol: 'USDC', name: 'USD Coin', color: '#2775CA', change: 0.01 },
  { symbol: 'LINK', name: 'Chainlink', color: '#2A5ADA', change: -1.24 },
  { symbol: 'AAVE', name: 'Aave', color: '#B6509E', change: 3.67 },
  { symbol: 'COMP', name: 'Compound', color: '#00D395', change: 0.87 },
  { symbol: 'SNX', name: 'Synthetix', color: '#00D1FF', change: -2.15 },
  { symbol: 'MATIC', name: 'Polygon', color: '#8247E5', change: 5.32 },
  { symbol: 'DAI', name: 'Dai', color: '#F5AC37', change: 0.03 },
  { symbol: 'SUSHI', name: 'SushiSwap', color: '#FA52A0', change: -0.75 },
  { symbol: 'YFI', name: 'Yearn', color: '#0074F9', change: 1.98 },
  { symbol: 'CRV', name: 'Curve', color: '#E4EE88', change: -3.45 },
  { symbol: '1INCH', name: '1inch', color: '#1B314F', change: 2.76 },
  { symbol: 'GRT', name: 'The Graph', color: '#6747ED', change: 4.21 },
  { symbol: 'MKR', name: 'Maker', color: '#6ACEBB', change: -0.32 },
  { symbol: 'FTM', name: 'Fantom', color: '#13B5EC', change: 8.54 },
  { symbol: 'DOGE', name: 'Dogecoin', color: '#C3A634', change: -2.67 },
  { symbol: 'AVAX', name: 'Avalanche', color: '#E84142', change: 3.21 },
  { symbol: 'ADA', name: 'Cardano', color: '#0033AD', change: -0.43 },
  { symbol: 'DOT', name: 'Polkadot', color: '#E6007A', change: 1.19 },
  { symbol: 'SOL', name: 'Solana', color: '#00FFA3', change: 6.78 },
  { symbol: 'SHIB', name: 'Shiba Inu', color: '#F00500', change: -1.35 },
  { symbol: 'XRP', name: 'XRP', color: '#00AAE4', change: 0.89 },
]; 