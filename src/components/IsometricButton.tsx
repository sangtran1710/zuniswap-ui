import React, { ReactNode } from 'react';
import '../styles/isometric.css';

interface IsometricButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  color?: string;
  depth?: number;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  icon?: ReactNode;
}

const IsometricButton: React.FC<IsometricButtonProps> = ({
  children,
  className = '',
  onClick,
  color = 'var(--iso-accent)',
  depth = 6,
  disabled = false,
  type = 'button',
  fullWidth = false,
  icon,
}) => {
  const baseClasses = `
    isometric-button
    relative
    font-medium
    rounded-lg
    px-4
    py-2
    transition-all
    duration-200
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  // Custom button styling with consistent depth effect
  const buttonStyle = {
    background: color,
    boxShadow: `0 ${depth}px 0 0 rgba(0,0,0,0.15)`,
    color: isLightColor(color) ? '#000' : '#fff',
    transform: disabled ? 'none' : 'translateY(0)',
  };

  return (
    <button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
    >
      <div className="flex items-center justify-center space-x-2">
        {icon && <span className="flex items-center justify-center">{icon}</span>}
        <span>{children}</span>
      </div>
    </button>
  );
};

// Helper function to determine if a color is light or dark
function isLightColor(color: string): boolean {
  // Default to dark text for unknown colors
  if (color.startsWith('var(')) {
    // Special handling for CSS variables
    const varName = color.match(/var\((.*?)\)/)?.[1];
    if (varName === '--iso-accent' || varName === '--iso-primary') {
      return false; // Most of our accent colors are dark enough for white text
    }
    return false;
  }
  
  // Convert hex to RGB
  let r, g, b;
  if (color.startsWith('#')) {
    const hex = color.substring(1);
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (color.startsWith('rgb')) {
    const rgb = color.match(/\d+/g);
    if (!rgb || rgb.length < 3) return false;
    r = parseInt(rgb[0]);
    g = parseInt(rgb[1]);
    b = parseInt(rgb[2]);
  } else {
    return false;
  }

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55; // Slightly higher threshold for better contrast
}

export default IsometricButton; 