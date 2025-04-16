import { CurrencyOption } from '../types';

/**
 * Format a number as currency with the specified currency symbol
 * @param amount The amount to format
 * @param currency The currency to use (usd or vnd)
 * @returns Formatted currency string
 */
export const formatCurrencyUtil = (
  amount: number,
  currency: CurrencyOption = 'usd'
): string => {
  if (isNaN(amount)) {
    return '0';
  }

  // Format with appropriate currency symbol and precision
  if (currency === 'usd') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount);
  } else if (currency === 'vnd') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Fallback to basic formatting
  return amount.toFixed(2);
}; 