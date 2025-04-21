import React from 'react';
import { motion } from 'framer-motion';

// Import token icons
import ethIcon from '../assets/icons/eth.png';
import btcIcon from '../assets/icons/btc.png';
import uniIcon from '../assets/icons/uni.png';
import linkIcon from '../assets/icons/link.png';
import usdcIcon from '../assets/icons/usdc.png';
import daiIcon from '../assets/icons/dai.png';

const tokens = [
  { src: '/icons/eth.png', top: '20%', left: '15%', delay: 0 },
  { src: '/icons/btc.png', top: '60%', right: '20%', delay: 1 },
  { src: '/icons/uni.png', top: '40%', left: '60%', delay: 2 },
];

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {tokens.map((token, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            top: token.top,
            left: token.left,
            right: token.right,
          }}
          animate={{ 
            y: [-20, 20, -20],
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
            delay: token.delay,
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-800/30 rounded-full blur-[32px]" />
            <img 
              src={token.src} 
              alt=""
              className="w-12 h-12 blur-3xl opacity-30" 
              onError={(e) => {
                if (!e.currentTarget.src.includes("default.png")) {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/icons/default.png";
                }
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Background; 