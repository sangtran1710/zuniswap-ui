import { ethers } from 'ethers';

/**
 * Format address to display format (0x1234...5678)
 */
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Format number with commas
 */
export const formatWithCommas = (value: number | string): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format currency value with specific number of decimals
 */
export const formatCurrency = (
  value: number | string,
  decimals = 6,
  currency = 'USD'
): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0.00';
  
  // For very small values, use scientific notation
  if (numValue > 0 && numValue < 0.000001) {
    return numValue.toExponential(2);
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: Math.min(decimals, 20),
    maximumFractionDigits: Math.min(decimals, 20),
  });
  
  return formatter.format(numValue);
};

/**
 * Format token amount with appropriate decimals
 */
export const formatTokenAmount = (
  amount: string | number,
  decimals = 4
): string => {
  const numValue = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numValue)) return '0';
  
  // For very small values
  if (numValue > 0 && numValue < 0.0001) {
    return '< 0.0001';
  }
  
  return numValue.toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  });
};

/**
 * Convert Wei to Ether
 */
export const weiToEther = (wei: string): string => {
  try {
    return ethers.utils.formatEther(wei);
  } catch (error) {
    console.error('Error converting wei to ether:', error);
    return '0';
  }
};

/**
 * Convert Ether to Wei
 */
export const etherToWei = (ether: string): string => {
  try {
    return ethers.utils.parseEther(ether).toString();
  } catch (error) {
    console.error('Error converting ether to wei:', error);
    return '0';
  }
};

/**
 * Format with specific number of decimals
 */
export const toFixedNoRounding = (num: number, fixed: number): string => {
  const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
  return num.toString().match(re)?.[0] || num.toFixed(fixed);
};

/**
 * Calculate price impact
 */
export const calculatePriceImpact = (
  inputAmount: number,
  outputAmount: number,
  inputPrice: number,
  outputPrice: number
): number => {
  const inputValue = inputAmount * inputPrice;
  const outputValue = outputAmount * outputPrice;
  
  if (inputValue === 0) return 0;
  
  const impact = ((inputValue - outputValue) / inputValue) * 100;
  return Math.max(0, impact); // Price impact should not be negative
}; 