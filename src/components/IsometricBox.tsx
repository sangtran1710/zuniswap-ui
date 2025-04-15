import React, { ReactNode } from 'react';

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
  const frontStyle = frontColor ? { background: frontColor } : {};
  const rightStyle = rightColor ? { background: rightColor } : {};
  const topStyle = topColor ? { background: topColor } : {};

  return (
    <div 
      className={`iso-box ${floating ? 'iso-float' : ''} ${className}`}
      onClick={onClick}
      style={{ 
        width: '100%', 
        height: '100%',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      <div 
        className="iso-box-top rounded-lg shadow-lg"
        style={{ 
          ...topStyle,
          transform: `translateZ(${depth}px)` 
        }}
      >
        {children}
      </div>
      <div 
        className="iso-box-front"
        style={{ 
          ...frontStyle,
          height: `${depth}px`,
          transform: `rotateX(-90deg) translateY(${depth/2}px) translateZ(${depth/2}px)`
        }}
      />
      <div 
        className="iso-box-right"
        style={{ 
          ...rightStyle,
          width: `${depth}px`,
          transform: `rotateY(90deg) translateX(${depth/2}px) translateZ(${depth/2}px)`
        }}
      />
    </div>
  );
};

export default IsometricBox; 