import React, { useEffect, useState, useRef, useCallback } from 'react';
import './TokenBackground.css';

// Token colors for SVG generation
const tokenColors: Record<string, string> = {
  ETH: '#627EEA',
  BTC: '#F7931A',
  SOL: '#14F195',
  ADA: '#0033AD',
  BNB: '#F3BA2F', 
  DOT: '#E6007A',
  LINK: '#2A5ADA',
  XRP: '#23292F',
  AVAX: '#E84142',
  MATIC: '#8247E5',
  UNI: '#FF007A',
  TRX: '#FF0013',
  ATOM: '#46509F',
  LTC: '#345D9D',
  NEAR: '#000000',
  ALGO: '#000000',
  DOGE: '#C2A633',
  ZUNI: '#4F46E5',
};

// Generate SVG data URL for each token
const generateTokenLogo = (symbol: string, color: string): string => {
  const svg = `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="${color}" stroke="#fff" stroke-width="1" />
      <text x="50" y="55" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle" fill="white">${symbol}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Logo mapping
const logoMap: Record<string, string> = {
  ETH: generateTokenLogo('ETH', tokenColors.ETH),
  BTC: generateTokenLogo('BTC', tokenColors.BTC),
  SOL: generateTokenLogo('SOL', tokenColors.SOL),
  ADA: generateTokenLogo('ADA', tokenColors.ADA),
  BNB: generateTokenLogo('BNB', tokenColors.BNB),
  DOT: generateTokenLogo('DOT', tokenColors.DOT),
  LINK: generateTokenLogo('LINK', tokenColors.LINK),
  XRP: generateTokenLogo('XRP', tokenColors.XRP),
  AVAX: generateTokenLogo('AVAX', tokenColors.AVAX),
  MATIC: generateTokenLogo('MATIC', tokenColors.MATIC),
  UNI: generateTokenLogo('UNI', tokenColors.UNI),
  TRX: generateTokenLogo('TRX', tokenColors.TRX),
  ATOM: generateTokenLogo('ATOM', tokenColors.ATOM),
  LTC: generateTokenLogo('LTC', tokenColors.LTC),
  NEAR: generateTokenLogo('NEAR', tokenColors.NEAR),
  ALGO: generateTokenLogo('ALGO', tokenColors.ALGO),
  DOGE: generateTokenLogo('DOGE', tokenColors.DOGE),
  ZUNI: generateTokenLogo('ZUNI', tokenColors.ZUNI)
};

// Simplified token data interface
interface TokenData {
  name: string;
  symbol: string;
  color: string;
  change: number;
}

// Simplified state interface
interface TokenState extends TokenData {
  id: number;
  x: number;
  y: number;
  sizeCategory: 'small' | 'medium' | 'large';
  isHovered: boolean;
  scaleVariation: number; // Add random scale variation
  baseSize: number; // Add variable base size
  animationDuration: number; // Add variable animation duration
  floatDistance: number; // Add variable float distance
  delay: number; // Random start delay for animations
  pathParams: { // Parameters for controlling animation path
    amplitude: number;
    frequency: number;
    phase: number;
  };
  time: number; // Animation timing parameter
  timeIncrement: number; // Controls animation speed
  direction: number; // Direction of movement (1 or -1)
  easing: (t: number) => number; // Easing function for animations
}

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
  { name: 'Zuni', symbol: 'ZUNI', color: '#4F46E5', change: Math.random() * 25 - 10 },
];

const TokenBackground: React.FC = () => {
  const [tokens, setTokens] = useState<TokenState[]>([]);
  const [hoveredToken, setHoveredToken] = useState<number | null>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Animation loop function
  const animate = useCallback(() => {
    setTokens(prevTokens => {
      return prevTokens.map(token => {
        // Skip animation for hovered tokens
        if (token.isHovered) {
          return token;
        }
        
        // Increment time parameter
        const newTime = token.time + token.timeIncrement;
        
        // Calculate new position based on time and path parameters
        const { amplitude, frequency, phase } = token.pathParams;
        
        // Use the easing function and time to create a smooth motion
        const t = token.easing(Math.sin(newTime) * 0.5 + 0.5);
        
        // Calculate horizontal and vertical displacement
        const xOffset = amplitude * Math.sin(frequency * newTime + phase) * token.direction * 10;
        const yOffset = -token.floatDistance * t; // Negative to move upwards
        
        // Apply new position by modifying the element directly
        const tokenEl = document.getElementById(`token-${token.id}`);
        if (tokenEl) {
          // Apply transform for smooth animation
          tokenEl.style.transform = `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset}px)) scale(${token.scaleVariation})`;
        }
        
        return {
          ...token,
          time: newTime,
        };
      });
    });
    
    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // Initialize token positions in a grid-like pattern
    const initializeTokens = () => {
      if (!backgroundRef.current) return;
      
      const containerWidth = backgroundRef.current.clientWidth;
      const containerHeight = backgroundRef.current.clientHeight;
      
      // Calculate grid cells - use larger cells for more spread out tokens
      const gridCellSize = 300; // Even larger grid cell size for more spacing
      const cols = Math.ceil(containerWidth / gridCellSize);
      const rows = Math.ceil(containerHeight / gridCellSize);
      
      // Create token objects with grid-based positioning
      const initializedTokens: TokenState[] = [];
      let tokenId = 0;
      
      // Fill grid with tokens, but skip cells randomly for sparser distribution
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Skip 70% of cells for an even sparser distribution like Uniswap
          if (Math.random() < 0.7) continue;
          
          if (tokenId >= tokenData.length) break; // Limit to actual tokens
          
          // Use token data without cycling to ensure variety
          const tokenIndex = tokenId % tokenData.length;
          const token = tokenData[tokenIndex];
          
          // Determine size category with modified distribution: 60% small, 30% medium, 10% large
          const sizeCategoryRand = Math.random();
          let sizeCategory: 'small' | 'medium' | 'large';
          let baseSize: number;
          let animationDuration: number;
          let floatDistance: number;
          
          if (sizeCategoryRand < 0.6) {
            sizeCategory = 'small'; // 60% chance of small
            // Make small tokens range from 20-30px
            baseSize = 20 + Math.random() * 10;
            // Slower animation for smaller tokens (10-15s)
            animationDuration = 10 + Math.random() * 5;
            // Smaller float distance for less movement
            floatDistance = 5 + Math.random() * 5;
          } else if (sizeCategoryRand < 0.9) {
            sizeCategory = 'medium'; // 30% chance of medium
            // Medium range 35-45px
            baseSize = 35 + Math.random() * 10;
            // Medium animation speed (12-18s)
            animationDuration = 12 + Math.random() * 6;
            // Medium float distance
            floatDistance = 4 + Math.random() * 3;
          } else {
            sizeCategory = 'large'; // 10% chance of large
            // Large tokens range 50-65px
            baseSize = 50 + Math.random() * 15;
            // Slower animation for larger tokens (15-20s)
            animationDuration = 15 + Math.random() * 5;
            // Very small float distance for large tokens
            floatDistance = 2 + Math.random() * 2;
          }
          
          // Reduced scale variation
          const scaleVariation = 0.9 + Math.random() * 0.2; // Scale between 0.9 and 1.1
          
          // Add more randomness to positions within grid cell
          const cellX = c * gridCellSize;
          const cellY = r * gridCellSize;
          
          // Allow some tokens to be near the edges of the screen
          let offsetX, offsetY;
          
          if (sizeCategory === 'large') {
            offsetX = 50 + Math.random() * (gridCellSize - 100);
            offsetY = 50 + Math.random() * (gridCellSize - 100);
          } else if (sizeCategory === 'medium') {
            offsetX = 40 + Math.random() * (gridCellSize - 80);
            offsetY = 40 + Math.random() * (gridCellSize - 80);
          } else {
            // Small tokens can be closer to the edges
            offsetX = 30 + Math.random() * (gridCellSize - 60);
            offsetY = 30 + Math.random() * (gridCellSize - 60);
          }
          
          const x = cellX + offsetX;
          const y = cellY + offsetY;
          
          const delay = Math.random() * 15; // Random delay up to 15s
            
          // More subtle animation path params
          const pathParams = {
            amplitude: 0.2 + Math.random() * 0.3, // Lower amplitude for subtler movement
            frequency: 0.2 + Math.random() * 0.4, // Lower frequency for slower oscillation
            phase: Math.random() * Math.PI * 2,
          };

          // More varied float motion factors with slower timeIncrement
          initializedTokens.push({
            ...token,
            id: tokenId,
            x,
            y,
            sizeCategory,
            isHovered: false,
            scaleVariation,
            baseSize,
            animationDuration,
            floatDistance,
            delay,
            pathParams,
            time: 0, // Starting time for animation
            timeIncrement: 0.03 + (Math.random() * 0.02), // Reduced time increment for slower motion
            direction: Math.random() > 0.5 ? 1 : -1, // Random direction
            easing: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, // Cubic easing
          });
          
          tokenId++;
        }
      }

      setTokens(initializedTokens);
    };

    if (backgroundRef.current) {
      initializeTokens();

      // Start animation loop after a short delay
      const timeoutId = setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(animate);
      }, 100);

      // Update token positions on resize
      const handleResize = () => {
        initializeTokens();
      };

      // Pause animations when tab is hidden
      const handleVisibilityChange = () => {
        if (document.hidden) {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
        } else {
          if (!animationFrameRef.current) {
            animationFrameRef.current = requestAnimationFrame(animate);
          }
        }
      };

      window.addEventListener('resize', handleResize);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        clearTimeout(timeoutId);
      };
    }
  }, [animate]);

  // Handle token hover
  const handleTokenHover = (tokenId: number, isHovered: boolean) => {
    setHoveredToken(isHovered ? tokenId : null);
    setTokens(prevTokens => 
      prevTokens.map(token => {
        if (token.id === tokenId) {
          // Reset transform when hovering to center the token for tooltip
          if (isHovered) {
            const tokenEl = document.getElementById(`token-${token.id}`);
            if (tokenEl) {
              tokenEl.style.transform = `translate(-50%, -50%) scale(${token.scaleVariation * 1.15})`;
            }
          }
          return { ...token, isHovered };
        }
        return token;
      })
    );
  };

  return (
    <div ref={backgroundRef} className="token-background">
      {tokens.map((token) => (
        <div
          key={token.id}
          id={`token-${token.id}`}
          className={`token token-${token.sizeCategory}`}
          style={{
            top: `${token.y}px`,
            left: `${token.x}px`,
            '--token-id': token.id,
            '--scale-variation': token.scaleVariation,
            '--base-size': `${token.baseSize}px`,
            '--animation-duration': `${token.animationDuration}s`,
            '--float-distance': `${token.floatDistance}px`,
            animationDelay: `${token.delay}s`,
            transition: 'transform 0.05s linear',
            opacity: 0.1, // Uniform opacity for all tokens
            filter: 'blur(100px)' // Higher blur for all tokens
          } as React.CSSProperties}
          onMouseEnter={() => handleTokenHover(token.id, true)}
          onMouseLeave={() => handleTokenHover(token.id, false)}
        >
          <img 
            src={logoMap[token.symbol]} 
            alt={token.symbol} 
            className="token-logo"
          />
          {token.isHovered && (
            <div className="tooltip">
              <div className="token-name">{token.name}</div>
              <div
                className={`token-change ${
                  token.change >= 0 ? "token-change-positive" : "token-change-negative"
                }`}
              >
                {token.change >= 0 ? "+" : ""}
                {token.change.toFixed(2)}%
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="gradient-overlay"></div>
    </div>
  );
};

export default TokenBackground; 