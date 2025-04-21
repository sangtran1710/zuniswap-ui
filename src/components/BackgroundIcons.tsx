import React, { useEffect, useState } from 'react';
import { theme } from '../styles/theme';

// Define more token positions with random variations
const tokens = [
  // Left side
  { src: '/icons/eth.png', top: '18%', left: '18%', delay: 0, size: 20, opacity: 0.6, rotate: 15 },
  { src: '/icons/btc.png', top: '38%', left: '8%', delay: 1, size: 16, opacity: 0.5, rotate: -10 },
  { src: '/icons/uni.png', bottom: '20%', left: '22%', delay: 2, size: 18, opacity: 0.55, rotate: 5 },
  
  // Right side
  { src: '/icons/usdc.png', top: '15%', right: '15%', delay: 3, size: 22, opacity: 0.6, rotate: -5 },
  { src: '/icons/dai.png', top: '45%', right: '10%', delay: 4, size: 16, opacity: 0.5, rotate: 20 },
  { src: '/icons/link.png', bottom: '25%', right: '18%', delay: 5, size: 24, opacity: 0.55, rotate: -15 },
  
  // Top/bottom positions
  { src: '/icons/usdc.png', top: '55%', left: '28%', delay: 6, size: 14, opacity: 0.5, rotate: 10 },
  { src: '/icons/dai.png', bottom: '12%', right: '30%', delay: 7, size: 18, opacity: 0.55, rotate: -8 },
  { src: '/icons/eth.png', top: '28%', right: '25%', delay: 8, size: 16, opacity: 0.5, rotate: 12 },
  
  // Additional floating tokens
  { src: '/icons/btc.png', bottom: '35%', right: '38%', delay: 9, size: 12, opacity: 0.45, rotate: -20 },
  { src: '/icons/uni.png', top: '15%', left: '30%', delay: 10, size: 14, opacity: 0.4, rotate: 25 },
  { src: '/icons/link.png', bottom: '40%', left: '12%', delay: 11, size: 16, opacity: 0.45, rotate: -15 }
];

// Custom CSS keyframes for smoother animation
const floatKeyframes = `
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
`;

const BackgroundIcons: React.FC = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Preload images to prevent flickering
  useEffect(() => {
    const imagePromises = tokens.map(token => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = token.src;
        img.onload = resolve;
        img.onerror = resolve; // Continue even if an image fails to load
      });
    });
    
    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true);
    });
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Add custom keyframes */}
      <style>{floatKeyframes}</style>
      
      {tokens.map((token, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: token.top,
            left: token.left,
            right: token.right,
            bottom: token.bottom,
            willChange: 'transform',
            opacity: imagesLoaded ? token.opacity : 0,
            transition: 'opacity 0.5s ease-in'
          }}
        >
          {/* Blur effect container */}
          <div className="relative">
            {/* Gradient glow effect */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{ 
                background: `linear-gradient(to right, ${theme.colors.gradient.primary.replace('bg-gradient-to-r', '')})`,
                filter: 'blur(20px)',
                opacity: 0.15,
                transform: 'scale(1.4)',
                willChange: 'transform'
              }} 
            />
            
            {/* Token icon */}
            <div
              style={{
                width: `${token.size * 4}px`,
                height: `${token.size * 4}px`,
                backgroundImage: `url(${token.src})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                transform: `rotate(${token.rotate}deg)`,
                animation: `float ${10 + index % 5}s ease-in-out infinite`,
                animationDelay: `${token.delay}s`,
                filter: 'blur(0.5px)',
                willChange: 'transform',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BackgroundIcons; 