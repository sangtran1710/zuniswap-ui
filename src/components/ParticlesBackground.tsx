import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  speed: number;
}

const ParticlesBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles] = useState<Particle[]>(() => 
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 10, // 10px to 20px
      duration: Math.random() * 10 + 20, // 20s to 30s
      delay: Math.random() * 2,
      speed: Math.random() * 0.2 + 0.1, // Random speed between 0.1 and 0.3
    }))
  );

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate mouse position as percentage (-50 to 50)
      const x = (clientX / innerWidth - 0.5) * 100;
      const y = (clientY / innerHeight - 0.5) * 100;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            x: [
              mousePosition.x * particle.speed,
              mousePosition.x * -particle.speed,
              mousePosition.x * particle.speed,
            ],
            y: [
              mousePosition.y * particle.speed,
              mousePosition.y * -particle.speed,
              mousePosition.y * particle.speed,
            ],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Hexagon with gradient border */}
          <div 
            className="w-full h-full relative"
            style={{
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))",
            }}
          >
            <div 
              className="absolute inset-[1px] bg-black/20"
              style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            />
            <div 
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #A855F7)",
                opacity: 0.2,
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ParticlesBackground; 