import React from 'react';
import { theme } from '../styles/theme';

const FooterText: React.FC = () => {
  return (
    <p className={`
      ${theme.font.size.label} 
      ${theme.colors.text.secondary} 
      ${theme.font.family}
      text-center max-w-md mx-auto mt-8
    `}>
      {/* Footer content removed to avoid overlap */}
    </p>
  );
};

export default FooterText; 