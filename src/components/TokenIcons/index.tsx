import React from 'react';

// Ethereum SVG logo
export const EthereumLogo: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="12" fill="#627EEA"/>
    <path d="M12.3735 5.25V9.6579L16.0211 11.2793L12.3735 5.25Z" fill="white" fillOpacity="0.602"/>
    <path d="M12.3735 5.25L8.72595 11.2793L12.3735 9.6579V5.25Z" fill="white"/>
    <path d="M12.3735 16.4171V19.4999L16.0248 13.1816L12.3735 16.4171Z" fill="white" fillOpacity="0.602"/>
    <path d="M12.3735 19.4999V16.4171L8.72595 13.1816L12.3735 19.4999Z" fill="white"/>
    <path d="M12.3735 15.4527L16.0211 12.2172L12.3735 10.5994V15.4527Z" fill="white" fillOpacity="0.2"/>
    <path d="M8.72595 12.2172L12.3735 15.4527V10.5994L8.72595 12.2172Z" fill="white" fillOpacity="0.602"/>
  </svg>
);

// USDC SVG logo
export const USDCLogo: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="12" fill="#2775CA"/>
    <path d="M12 17.25C15.1066 17.25 17.625 14.7316 17.625 11.625C17.625 8.51838 15.1066 6 12 6C8.89338 6 6.375 8.51838 6.375 11.625C6.375 14.7316 8.89338 17.25 12 17.25Z" fill="#2775CA"/>
    <path d="M15.6327 10.1311H14.2545C14.1618 9.4532 13.8981 8.87786 13.4634 8.40508C13.0286 7.93229 12.5327 7.63094 11.9756 7.50103V6.375H11.0244V7.50103C10.4673 7.63094 9.97135 7.93229 9.53664 8.40508C9.10192 8.87786 8.83817 9.4532 8.74545 10.1311H7.36731V10.9689H8.74545C8.83817 11.6468 9.10192 12.2221 9.53664 12.6949C9.97135 13.1677 10.4673 13.4691 11.0244 13.599V14.7249H11.9756V13.599C12.5327 13.4691 13.0286 13.1677 13.4634 12.6949C13.8981 12.2221 14.1618 11.6468 14.2545 10.9689H15.6327V10.1311ZM11.5 12.75C10.8096 12.75 10.1484 12.4866 9.6562 12.0183C9.16406 11.55 8.875 10.9212 8.875 10.2656C8.875 9.61005 9.16406 8.98126 9.6562 8.51296C10.1484 8.04465 10.8096 7.78125 11.5 7.78125C12.1904 7.78125 12.8516 8.04465 13.3438 8.51296C13.8359 8.98126 14.125 9.61005 14.125 10.2656C14.125 10.9212 13.8359 11.55 13.3438 12.0183C12.8516 12.4866 12.1904 12.75 11.5 12.75Z" fill="white"/>
  </svg>
);

// USDT SVG logo
export const USDTLogo: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="12" fill="#26A17B"/>
    <path d="M12.9792 11.7922V9.53125H16.5V7.5H7.5V9.53125H11.0208V11.7922C8.8125 11.9297 7.125 12.5672 7.125 13.3359C7.125 14.1047 8.8125 14.7422 11.0208 14.8797V18.75H12.9792V14.8797C15.1875 14.7422 16.875 14.1047 16.875 13.3359C16.875 12.5672 15.1875 11.9297 12.9792 11.7922ZM12.9792 14.3859V14.3859C12.9792 14.3859 12.9375 14.3906 12.8438 14.3906C12.5625 14.3906 11.8125 14.3531 11.0208 14.2969V14.2969C9.0938 14.1781 7.6875 13.7344 7.6875 13.2C7.6875 12.6656 9.0938 12.2219 11.0208 12.1031V13.8516C11.8229 13.9031 12.5833 13.9359 12.8438 13.9359C12.9479 13.9359 12.9792 13.9312 12.9792 13.9312V12.1031C14.9062 12.2219 16.3125 12.6656 16.3125 13.2C16.3125 13.7344 14.9062 14.1781 12.9792 14.2969V14.3859Z" fill="white"/>
  </svg>
);

// WBTC SVG logo
export const WBTCLogo: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="12" fill="#F7931A"/>
    <path d="M16.5 11.6612C16.5 13.6549 14.8854 14.3223 12.9167 14.4974V16.5H11.5833V14.4974C11.2292 14.4974 10.875 14.4974 10.5208 14.4974V16.5H9.1875V14.4974H7.5V13.0642C7.5 13.0642 8.5 13.0642 8.48958 13.0642C8.95833 13.0642 9.07292 12.7839 9.11458 12.5736V9.28882C9.15625 9.28882 9.1875 9.27781 9.22917 9.27781C9.1875 9.27781 9.15625 9.27781 9.11458 9.27781V6.87386C9.08333 6.6636 8.92708 6.32226 8.48958 6.32226C8.5 6.32226 7.5 6.32226 7.5 6.32226V5H9.1875V3H10.5208V5H11.5833V3H12.9167V5.02202C14.5312 5.13213 15.8229 5.60354 15.8229 7.04777C15.8229 8.30117 14.9792 8.89264 14.0625 9.08088C15.3542 9.32913 16.5 9.98058 16.5 11.6612ZM14.0417 7.17989C14.0417 6.01637 12.3646 5.87425 11.5833 5.87425V8.48553C12.3646 8.48553 14.0417 8.33241 14.0417 7.17989ZM11.5833 9.34886V12.1902C12.5 12.1902 14.5833 12.0371 14.5833 10.7697C14.5833 9.49126 12.5 9.34886 11.5833 9.34886Z" fill="white"/>
  </svg>
);

// WETH SVG logo
export const WETHLogo: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="12" fill="#627EEA"/>
    <path d="M12.3735 5.25V9.6579L16.0211 11.2793L12.3735 5.25Z" fill="white" fillOpacity="0.602"/>
    <path d="M12.3735 5.25L8.72595 11.2793L12.3735 9.6579V5.25Z" fill="white"/>
    <path d="M12.3735 16.4171V19.4999L16.0248 13.1816L12.3735 16.4171Z" fill="white" fillOpacity="0.602"/>
    <path d="M12.3735 19.4999V16.4171L8.72595 13.1816L12.3735 19.4999Z" fill="white"/>
    <path d="M12.3735 15.4527L16.0211 12.2172L12.3735 10.5994V15.4527Z" fill="white" fillOpacity="0.2"/>
    <path d="M8.72595 12.2172L12.3735 15.4527V10.5994L8.72595 12.2172Z" fill="white" fillOpacity="0.602"/>
  </svg>
);

// DAI SVG logo
export const DAILogo: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="12" fill="#F5AC37"/>
    <path d="M7.5 8.25H12.1875C14.625 8.25 16.5 9.84375 16.5 12C16.5 14.1562 14.625 15.75 12.1875 15.75H7.5V8.25ZM9.1875 14.25H12.1875C13.6875 14.25 14.8125 13.3125 14.8125 12C14.8125 10.6875 13.6875 9.75 12.1875 9.75H9.1875V14.25Z" fill="white"/>
    <path d="M7.5 7.5H12.75V6H7.5V7.5Z" fill="white"/>
    <path d="M7.5 18H12.75V16.5H7.5V18Z" fill="white"/>
  </svg>
);

// Generic token logo fallback
export const GenericTokenLogo: React.FC<{ symbol: string; className?: string }> = ({ symbol, className = 'w-full h-full' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="12" fill="#2D3348"/>
    <text x="12" y="16" fontFamily="Arial" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">
      {symbol.charAt(0)}
    </text>
  </svg>
);

// Main TokenIcon component
interface TokenIconProps {
  symbol: string;
  className?: string;
}

export const TokenIcon: React.FC<TokenIconProps> = ({ symbol, className = 'w-6 h-6' }) => {
  // Normalize symbol to uppercase for consistent matching
  const normalizedSymbol = symbol.toUpperCase();
  
  // Return the appropriate SVG based on token symbol
  switch (normalizedSymbol) {
    case 'ETH':
      return <EthereumLogo className={className} />;
    case 'USDC':
      return <USDCLogo className={className} />;
    case 'USDT':
      return <USDTLogo className={className} />;
    case 'WBTC':
      return <WBTCLogo className={className} />;
    case 'WETH':
      return <WETHLogo className={className} />;
    case 'DAI':
      return <DAILogo className={className} />;
    default:
      return <GenericTokenLogo symbol={symbol} className={className} />;
  }
};

export default TokenIcon;
