import React, { ReactNode } from 'react';
import '../styles/isometric.css';

interface IsometricBoxProps {
  children: ReactNode;
  className?: string;
  depth?: number;
  frontColor?: string;
  rightColor?: string;
  topColor?: string;
  onClick?: () => void;
  floating?: boolean;
}

const IsometricBox: React.FC<IsometricBoxProps> = ({
  children,
  className = '',
  depth = 20,
  frontColor,
  rightColor,
  topColor,
  onClick,
  floating = false,
}) => {
  // Calculate depth-based variables
  const depthScale = depth / 20; // Standard depth is 20
  
  // Apply styles
  const frontStyle = frontColor ? { background: frontColor } : {};
  const rightStyle = rightColor ? { 
    background: rightColor,
    width: `${depth}px`,
  } : { width: `${depth}px` };
  
  const topStyle = topColor ? { 
    background: topColor,
    height: `${depth}px`,
  } : { height: `${depth}px` };

  return (
    <div 
      className={`isometric-box ${floating ? 'isometric-float' : ''} ${className}`}
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        // Apply subtle depth effect based on depth prop
        transform: `rotateX(var(--iso-rotation-x)) rotateY(var(--iso-rotation-y)) translateZ(${depthScale * 2}px)`,
      }}
    >
      {/* Main content container */}
      <div 
        className="isometric-box__front"
        style={frontStyle}
      >
        {children}
      </div>
      
      {/* Right face */}
      <div 
        className="isometric-box__right isometric-box__face"
        style={rightStyle}
      />
      
      {/* Top face */}
      <div 
        className="isometric-box__top isometric-box__face"
        style={topStyle}
      />
    </div>
  );
};

export default IsometricBox; 