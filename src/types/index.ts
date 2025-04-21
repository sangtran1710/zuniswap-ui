/**
 * Token interface representing cryptocurrency tokens in the application
 */
export interface Token {
  name: string;
  symbol: string;
  address: string;
  logoUrl: string;
  logoURI?: string;
  balance: string;
  price: number;
} 