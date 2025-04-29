import React, { useEffect, useState, CSSProperties } from 'react';

// Danh sách các token symbol để hiển thị trên background
const tokenSymbols = [
  'ETH', 'BTC', 'USDC', 'USDT', 'BNB', 'XRP', 'ADA', 'DOGE', 
  'SOL', 'MATIC', 'DOT', 'SHIB', 'AVAX', 'DAI', 'UNI', 'LINK', 
  'ATOM', 'LTC', 'AAVE', 'SUSHI', 'FTM', 'NEAR', 'ALGO', 'XLM',
  'CAKE', 'CRO', 'APE', 'SAND', 'MANA', 'GALA'
];

// Danh sách các màu sắc đẹp cho token
const vibrantColors = [
  '#FF007A', // Pink (Uniswap)
  '#627EEA', // Blue (Ethereum)
  '#F7931A', // Orange (Bitcoin)
  '#2775CA', // Blue (USDC)
  '#26A17B', // Green (Tether)
  '#F3BA2F', // Yellow (Binance)
  '#E6007A', // Pink (Polkadot)
  '#8247E5', // Purple (Polygon)
  '#14F195', // Green (Solana)
  '#E84142', // Red (Avalanche)
  '#F5AC37', // Yellow (DAI)
  '#2A5ADA', // Blue (Chainlink)
  '#B6509E', // Purple (Aave)
  '#FA52A0', // Pink (Sushi)
  '#00AEFF', // Light Blue
  '#11B981', // Green
  '#6366F1', // Indigo
  '#F43F5E', // Rose
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#0EA5E9'  // Sky
];

// Hàm để xác định màu chữ phù hợp với màu nền
const getTextColor = (bgColor: string): string => {
  // Chuyển màu hex thành RGB
  const r = parseInt(bgColor.slice(1, 3), 16);
  const g = parseInt(bgColor.slice(3, 5), 16);
  const b = parseInt(bgColor.slice(5, 7), 16);
  
  // Tính độ sáng của màu (luminance)
  // Công thức: 0.299*R + 0.587*G + 0.114*B
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Nếu màu sáng thì dùng chữ đen, ngược lại dùng chữ trắng
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

// Component cho từng token logo
const TokenLogo: React.FC<{
  symbol: string;
  color: string;
  size: number;
  position: { x: number; y: number };
  animationDelay: number;
  animationDuration: number;
}> = ({ symbol, color, size, position, animationDelay, animationDuration }) => {
  const textColor = getTextColor(color);
  
  // Đảm bảo text không tràn ra ngoài viền bằng cách giới hạn kích thước font
  // và số ký tự hiển thị
  const displayText = symbol.length <= 3 ? symbol : symbol.substring(0, 3);
  
  // Điều chỉnh kích thước font dựa trên độ dài của text và kích thước token
  // Giảm tỷ lệ font cho token lớn để tránh text quá to
  let fontSizeRatio = displayText.length > 2 ? 0.3 : 0.4;
  
  // Điều chỉnh tỷ lệ font theo kích thước token
  if (size > 200) {
    fontSizeRatio *= 0.4; // Giảm mạnh font cho token cực lớn
  } else if (size > 100) {
    fontSizeRatio *= 0.6;
  }
  
  // Tạo một object style riêng để tránh các vấn đề với CSS
  const tokenStyle: CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    left: `${position.x}%`,
    top: `${position.y}%`,
    borderRadius: '50%',
    backgroundColor: color,
    color: textColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${Math.floor(size * fontSizeRatio)}px`,
    fontWeight: 'bold',
    opacity: size > 200 ? 0.25 : size > 100 ? 0.35 : 0.45,
    zIndex: size > 200 ? -1 : size > 100 ? 0 : 1,
    boxShadow: size > 200 ? `0 0 60px ${color}60` : size > 100 ? `0 0 45px ${color}50` : `0 0 30px ${color}40`,
    border: size > 200 ? `4px solid rgba(255, 255, 255, 0.2)` : size > 100 ? `3px solid rgba(255, 255, 255, 0.15)` : `2px solid rgba(255, 255, 255, 0.1)`,
    overflow: 'hidden',
    padding: '4px',
    animationName: 'tokenFloat, tokenRotate',
    animationDuration: `${animationDuration}s, ${animationDuration * 1.5}s`,
    animationTimingFunction: 'ease-in-out, linear',
    animationIterationCount: 'infinite, infinite',
    animationDirection: 'alternate, normal',
    animationDelay: `${animationDelay}s`,
    willChange: 'transform, opacity, filter',
    transformStyle: 'preserve-3d',
    backfaceVisibility: 'hidden',
    pointerEvents: 'none',
    mixBlendMode: 'lighten',
    filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.1)) blur(0.5px)',
    fontFamily: 'Arial, sans-serif',
    letterSpacing: '0.5px',
    transform: 'scale(1)', // Đảm bảo kích thước được áp dụng đúng
    maxWidth: 'none', // Loại bỏ giới hạn kích thước có thể được áp dụng từ các class CSS khác
    maxHeight: 'none', // Loại bỏ giới hạn kích thước có thể được áp dụng từ các class CSS khác
  };
  
  // Ghi log kích thước token để debug
  if (size > 150) {
    console.log(`Rendering token ${symbol} with size ${size}px`);
  }
  
  return (
    <div style={tokenStyle}
    >
      {displayText}
    </div>
  );
};

const TokenBackground: React.FC = () => {
  const [tokens, setTokens] = useState<Array<{
    id: number;
    symbol: string;
    color: string;
    size: number;
    position: { x: number; y: number };
    animationDelay: number;
    animationDuration: number;
  }>>([]);

  useEffect(() => {
    // Tạo các token với vị trí, màu sắc và kích thước ngẫu nhiên
    const tokenElements: Array<{
      id: number;
      symbol: string;
      color: string;
      size: number;
      position: { x: number; y: number };
      animationDelay: number;
      animationDuration: number;
    }> = [];
    
    const gridSize = 5; // Chia màn hình thành lưới 5x5 để phân bố đều hơn
    const cellWidth = 100 / gridSize;
    const cellHeight = 100 / gridSize;
    
    // Đảm bảo mỗi ô lưới chỉ có tối đa 1 token
    const grid = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
    
    // Số lượng token cần tạo
    const tokenCount = 15; // Giảm số lượng token để tránh quá nhiều token trên màn hình
    
    // Tạo các token ngẫu nhiên
    for (let index = 0; index < tokenCount; index++) {
      // Chọn ngẫu nhiên một symbol và một màu
      const symbol = tokenSymbols[Math.floor(Math.random() * tokenSymbols.length)];
      const color = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
      
      // Điều chỉnh lại kích thước token, chỉ giữ lại 2-3 token to và scale chúng xuống 10%
      const minSize = 25;
      const maxSize = 80; // Giảm kích thước tối đa xuống còn 80px
      const sizeRange = maxSize - minSize;
      
      // Chỉ cho phép 2-3 token to
      let size;
      
      // Chỉ cho 2 token đầu tiên là token lớn
      const forceLargeToken = index < 2; // Chỉ 2 token đầu tiên sẽ là token lớn
      
      if (forceLargeToken) { // Chỉ 2 token đầu tiên là token lớn
        // Token lớn (70-80px) - scale xuống còn 10% so với trước (150-200px -> 70-80px)
        size = Math.round(70 + Math.random() * 10);
        console.log(`Tạo token lớn: ${size}px - ${symbol}`);
      } else if (Math.random() < 0.3) { // 30% token trung bình
        // Token trung bình (50-70px)
        size = Math.round(50 + Math.random() * 20);
      } else if (Math.random() < 0.6) { // 60% token nhỏ-trung bình
        // Token nhỏ-trung bình (35-50px)
        size = Math.round(35 + Math.random() * 15);
      } else {
        // Phân phối kích thước thông thường: nhiều token nhỏ
        const sizeFactor = Math.pow(Math.random(), 2); // Tăng độ mạnh của phân phối để có nhiều token nhỏ hơn
        size = Math.round(minSize + (sizeRange / 3) * sizeFactor); // Giảm range xuống 1/3
      }
      
      // Tìm ô lưới còn trống
      let gridX: number, gridY: number;
      do {
        gridX = Math.floor(Math.random() * gridSize);
        gridY = Math.floor(Math.random() * gridSize);
      } while (grid[gridY][gridX] >= 1); // Mỗi ô chỉ chứa tối đa 1 token
      
      grid[gridY][gridX]++;
      
      // Tính vị trí ngẫu nhiên trong ô lưới
      const x = gridX * cellWidth + Math.random() * (cellWidth * 0.6) + cellWidth * 0.2;
      const y = gridY * cellHeight + Math.random() * (cellHeight * 0.6) + cellHeight * 0.2;
      
      // Thêm độ trễ ngẫu nhiên cho animation
      const animationDelay = Math.random() * 15;
      
      // Thời gian animation ngẫu nhiên từ 20s đến 40s
      const animationDuration = Math.random() * 20 + 20;
      
      tokenElements.push({
        id: index,
        symbol,
        color,
        size,
        position: { x, y },
        animationDelay,
        animationDuration
      });
    }

    setTokens(tokenElements);
  }, []);

  // Tạo style riêng cho container để tránh các vấn đề với CSS
  const containerStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 0,
    filter: 'blur(1.5px) backdrop-blur(8px)',
    opacity: 0.7,
    backdropFilter: 'blur(8px)',
  };
  
  return (
    <div style={containerStyle}>
      {tokens.map((token) => (
        <TokenLogo
          key={token.id}
          symbol={token.symbol}
          color={token.color}
          size={token.size}
          position={token.position}
          animationDelay={token.animationDelay}
          animationDuration={token.animationDuration}
        />
      ))}
    </div>
  );
};

export default TokenBackground;
