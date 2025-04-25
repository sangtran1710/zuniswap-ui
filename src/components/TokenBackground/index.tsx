import React, { useEffect, useState, useRef } from 'react';
import './TokenBackground.css';

// Define interfaces for token data
interface TokenData {
  name: string;
  symbol: string;
  color: string;
  change: number;
}

interface TokenState extends TokenData {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  animationDelay: number;
  floatDuration: number;
  blurAmount: number;
  amplitude: {
    x: number;
    y: number;
  };
  frequency: {
    x: number;
    y: number;
  };
  phase: {
    x: number;
    y: number;
  };
  time: number;
  lastUpdateTime: number;
}

// Easing function for smoother animation
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Token data with name, symbol, color, and initial random change percentage
const tokenData: TokenData[] = [
  { name: 'Ethereum', symbol: 'ETH', color: '#627EEA', change: Math.random() * 25 - 10 },
  { name: 'Bitcoin', symbol: 'BTC', color: '#F7931A', change: Math.random() * 25 - 10 },
  { name: 'Solana', symbol: 'SOL', color: '#14F195', change: Math.random() * 25 - 10 },
  { name: 'Cardano', symbol: 'ADA', color: '#0033AD', change: Math.random() * 25 - 10 },
  { name: 'BNB', symbol: 'BNB', color: '#F3BA2F', change: Math.random() * 25 - 10 },
  { name: 'Polkadot', symbol: 'DOT', color: '#E6007A', change: Math.random() * 25 - 10 },
  { name: 'Chainlink', symbol: 'LINK', color: '#2A5ADA', change: Math.random() * 25 - 10 },
  { name: 'Ripple', symbol: 'XRP', color: '#23292F', change: Math.random() * 25 - 10 },
  { name: 'Avalanche', symbol: 'AVAX', color: '#E84142', change: Math.random() * 25 - 10 },
  { name: 'Polygon', symbol: 'MATIC', color: '#8247E5', change: Math.random() * 25 - 10 },
  { name: 'Uniswap', symbol: 'UNI', color: '#FF007A', change: Math.random() * 25 - 10 },
  { name: 'Tron', symbol: 'TRX', color: '#FF0013', change: Math.random() * 25 - 10 },
  { name: 'Cosmos', symbol: 'ATOM', color: '#46509F', change: Math.random() * 25 - 10 },
  { name: 'Litecoin', symbol: 'LTC', color: '#345D9D', change: Math.random() * 25 - 10 },
  { name: 'Near', symbol: 'NEAR', color: '#000000', change: Math.random() * 25 - 10 },
  { name: 'Algorand', symbol: 'ALGO', color: '#000000', change: Math.random() * 25 - 10 },
  { name: 'Dogecoin', symbol: 'DOGE', color: '#C2A633', change: Math.random() * 25 - 10 },
  { name: 'Zuni', symbol: 'ZUNI', color: '#9333EA', change: Math.random() * 25 - 10 },
];

const TokenBackground: React.FC = () => {
  const [tokens, setTokens] = useState<TokenState[]>([]);
  const [hoveredToken, setHoveredToken] = useState<number | null>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const throttleRef = useRef<number>(0);
  
  // Animation update throttling - milliseconds between updates
  const THROTTLE_TIME = 50;

  useEffect(() => {
    // Initialize token positions when component mounts
    const initializeTokens = () => {
      if (!backgroundRef.current) return;
      
      const containerWidth = backgroundRef.current.clientWidth;
      const containerHeight = backgroundRef.current.clientHeight;

      // Create token objects with randomized positions and animation properties
      const initializedTokens = tokenData.map((token, index) => {
        // Calculate random positions within the container
        const size = Math.floor(Math.random() * 20) + 30; // Size between 30px and 50px
        const x = Math.random() * (containerWidth - size);
        const y = Math.random() * (containerHeight - size);
        
        // Random animation parameters - significantly reduced for subtler movement
        const speedX = (Math.random() * 0.05) + 0.01; // MUCH slower horizontal movement
        const speedY = (Math.random() * 0.05) + 0.01; // MUCH slower vertical movement
        const animationDelay = Math.random() * 10; // Random delay for out-of-sync movement
        const floatDuration = Math.floor(Math.random() * 20) + 30; // Longer duration between 30-50s
        
        // Random movement direction
        const directionX = Math.random() > 0.5 ? 1 : -1;
        const directionY = Math.random() > 0.5 ? 1 : -1;
        
        // Random blur amount - increased for more subtlety
        const blurAmount = Math.floor(Math.random() * 3) + 3; // Between 3-6px
        
        return {
          ...token,
          id: index,
          x,
          y,
          size,
          speedX: speedX * directionX,
          speedY: speedY * directionY,
          animationDelay,
          floatDuration,
          blurAmount,
          // Animation path parameters (for curved movement) - reduced amplitude
          amplitude: {
            x: Math.random() * 20 + 10, // Reduced amplitude
            y: Math.random() * 20 + 10  // Reduced amplitude
          },
          frequency: {
            x: Math.random() * 0.001 + 0.0005, // Slower frequency
            y: Math.random() * 0.001 + 0.0005  // Slower frequency
          },
          phase: {
            x: Math.random() * Math.PI * 2,
            y: Math.random() * Math.PI * 2
          },
          time: Math.random() * 1000,
          lastUpdateTime: Date.now()
        };
      });

      setTokens(initializedTokens);
    };

    if (backgroundRef.current) {
      initializeTokens();

      // Update token positions on resize
      const handleResize = () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        initializeTokens();
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, []);

  useEffect(() => {
    // Animation function to move tokens
    const animateTokens = () => {
      const now = Date.now();
      
      // Throttle updates to reduce CPU usage and make motion more subtle
      if (now - throttleRef.current < THROTTLE_TIME) {
        animationFrameRef.current = requestAnimationFrame(animateTokens);
        return;
      }
      
      throttleRef.current = now;
      
      setTokens(prevTokens => {
        if (!backgroundRef.current) return prevTokens;
        
        const containerWidth = backgroundRef.current.clientWidth;
        const containerHeight = backgroundRef.current.clientHeight;

        return prevTokens.map(token => {
          // Much smaller time increment for slower animation
          const newTime = token.time + 0.1;
          
          // Calculate position with sine/cosine waves for curved paths
          const xWave = token.amplitude.x * Math.sin(token.frequency.x * newTime + token.phase.x);
          const yWave = token.amplitude.y * Math.cos(token.frequency.y * newTime + token.phase.y);
          
          // Apply easing function to make movement more organic
          const easeFactor = easeInOutCubic((Math.sin(newTime * 0.001) + 1) / 2);
          
          // Update base position - very slow movement
          let newX = token.x + token.speedX * easeFactor;
          let newY = token.y + token.speedY * easeFactor;
          
          // Add wave movement - significantly reduced effect
          newX += xWave * 0.002;
          newY += yWave * 0.002;
          
          // Handle boundaries with smooth deceleration
          if (newX <= 0 || newX >= containerWidth - token.size) {
            // Reverse direction when hitting boundaries with dampening
            return {
              ...token,
              x: newX <= 0 ? 1 : containerWidth - token.size - 1, // Slight offset to prevent sticking
              speedX: -token.speedX * 0.8, // Dampening effect on collision
              time: newTime,
              lastUpdateTime: now
            };
          }
          
          if (newY <= 0 || newY >= containerHeight - token.size) {
            // Reverse direction when hitting boundaries with dampening
            return {
              ...token,
              y: newY <= 0 ? 1 : containerHeight - token.size - 1, // Slight offset to prevent sticking
              speedY: -token.speedY * 0.8, // Dampening effect on collision
              time: newTime,
              lastUpdateTime: now
            };
          }
          
          // Normal movement
          return {
            ...token,
            x: newX,
            y: newY,
            time: newTime,
            lastUpdateTime: now
          };
        });
      });
      
      animationFrameRef.current = requestAnimationFrame(animateTokens);
    };
    
    // Start animation
    if (tokens.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animateTokens);
    }
    
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [tokens.length]);

  // Handle token hover
  const handleTokenHover = (tokenId: number) => {
    setHoveredToken(tokenId);
  };

  // Handle mouse leave
  const handleTokenLeave = () => {
    setHoveredToken(null);
  };

  return (
    <div className="token-background" ref={backgroundRef}>
      <div className="gradient-overlay"></div>
      {tokens.map((token) => {
        const isHovered = hoveredToken === token.id;
        const formattedChange = token.change.toFixed(2);
        const isPositive = token.change > 0;

        return (
          <div
            key={token.id}
            className="token"
            style={{
              width: `${token.size}px`,
              height: `${token.size}px`,
              left: `${token.x}px`,
              top: `${token.y}px`,
              backgroundColor: token.color,
              transform: `translate3d(0, 0, 0)`, // Force GPU acceleration
              filter: `blur(${isHovered ? 0 : token.blurAmount}px)`,
              animationDelay: `${token.animationDelay}s`,
            }}
            onMouseEnter={() => handleTokenHover(token.id)}
            onMouseLeave={handleTokenLeave}
          >
            {token.symbol}
            
            {isHovered && (
              <div className="tooltip">
                <div className="token-name">{token.name}</div>
                <div className={`token-change ${isPositive ? 'token-change-positive' : 'token-change-negative'}`}>
                  {isPositive ? '▲' : '▼'} {Math.abs(parseFloat(formattedChange))}%
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TokenBackground; 