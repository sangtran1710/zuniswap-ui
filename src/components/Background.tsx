import React from 'react';
import { motion } from 'framer-motion';

interface Token {
  id: number;
  color: string;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

const AnimatedBackground: React.FC = () => {
  // Generate random tokens with different properties
  const tokens: Token[] = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    size: Math.random() * 20 + 10, // Random size between 10 and 30
    x: Math.random() * 100, // Random x position
    y: Math.random() * 100, // Random y position
    duration: Math.random() * 20 + 10, // Random duration between 10 and 30
    delay: Math.random() * 5, // Random delay between 0 and 5
  }));

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#191B1F] to-[#131416]"
        style={{ backdropFilter: 'blur(10px)' }}
      />

      {/* Floating tokens */}
      {tokens.map((token) => (
        <motion.div
          key={token.id}
          className="absolute rounded-full"
          style={{
            width: token.size,
            height: token.size,
            backgroundColor: token.color,
            left: `${token.x}%`,
            top: `${token.y}%`,
            opacity: 0.1,
          }}
          animate={{
            x: [0, Math.random() * 50 - 25, 0],
            y: [0, Math.random() * 50 - 25, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: token.duration,
            delay: token.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Overlay gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};

export default AnimatedBackground; 