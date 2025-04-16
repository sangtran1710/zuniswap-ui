import { Token } from '../types';

// Giá token giả lập (tương đối so với USD)
const mockTokenPrices: Record<string, number> = {
  'ETH': 3500,
  'BTC': 65000,
  'USDT': 1,
  'USDC': 1,
  'BNB': 550,
  'LINK': 15.5,
  'XRP': 0.55,
  'SOL': 140
};

// Tính giả lập liquidity (dùng để tính price impact)
const mockLiquidity: Record<string, number> = {
  'ETH': 1000000,
  'BTC': 500000,
  'USDT': 10000000,
  'USDC': 10000000,
  'BNB': 800000,
  'LINK': 400000,
  'XRP': 600000,
  'SOL': 700000
};

/**
 * Tính tỷ giá giữa hai token
 * @param fromToken Token nguồn
 * @param toToken Token đích
 * @returns Tỷ giá (bao nhiêu toToken cho 1 fromToken)
 */
export const calculatePrice = (fromToken: Token, toToken: Token): number => {
  // Lấy giá USD từ mockTokenPrices
  const fromPrice = mockTokenPrices[fromToken.symbol] || 1;
  const toPrice = mockTokenPrices[toToken.symbol] || 1;
  
  // Tính tỷ giá: 1 fromToken = ? toToken
  return fromPrice / toPrice;
};

/**
 * Tính số lượng token đích từ số lượng token nguồn
 * @param inputAmount Số lượng token nguồn
 * @param fromToken Token nguồn
 * @param toToken Token đích
 * @returns Số lượng token đích
 */
export const calculateOutputAmount = (
  inputAmount: string | number,
  fromToken: Token,
  toToken: Token
): number => {
  const amount = typeof inputAmount === 'string' ? parseFloat(inputAmount) : inputAmount;
  
  if (isNaN(amount) || amount <= 0) {
    return 0;
  }
  
  // Lấy tỷ giá
  const rate = calculatePrice(fromToken, toToken);
  
  // Tính slippage giả lập (0.5% với mỗi 1000 token)
  const baseSlippage = 0.005; // 0.5%
  const slippageMultiplier = Math.min(1, (amount / 1000) * 0.005);
  const effectiveRate = rate * (1 - slippageMultiplier);
  
  // Tính số lượng token đích
  return amount * effectiveRate;
};

/**
 * Tính price impact dựa trên số lượng token và liquidity
 * @param amount Số lượng token nguồn
 * @param fromToken Token nguồn
 * @param toToken Token đích
 * @returns Phần trăm price impact
 */
export const calculatePriceImpact = (
  amount: string | number,
  fromToken: Token, 
  toToken: Token
): number => {
  const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return 0;
  }
  
  // Lấy liquidity giả lập
  const fromLiquidity = mockLiquidity[fromToken.symbol] || 1000000;
  const toLiquidity = mockLiquidity[toToken.symbol] || 1000000;
  
  // Tính price impact dựa trên tỷ lệ số lượng swap so với liquidity
  const fromImpact = (parsedAmount * mockTokenPrices[fromToken.symbol]) / fromLiquidity;
  const toImpact = (parsedAmount * mockTokenPrices[fromToken.symbol]) / (toLiquidity * mockTokenPrices[toToken.symbol]);
  
  // Lấy impact lớn nhất giữa hai token
  const impact = Math.max(fromImpact, toImpact);
  
  // Scale impact để có kết quả hợp lý (0.1% đến 10%)
  return Math.min(10, Math.max(0.01, impact * 100));
};

/**
 * Format số với đúng số chữ số thập phân
 * @param amount Số cần format
 * @param decimals Số chữ số thập phân
 * @returns Chuỗi đã được format
 */
export const formatCurrency = (
  amount: string | number, 
  decimals: number = 6
): string => {
  const parsedAmount = parseFloat(amount as string);
  
  if (isNaN(parsedAmount)) {
    return '0';
  }
  
  // Nếu số quá nhỏ, hiển thị nhiều chữ số thập phân hơn
  if (Math.abs(parsedAmount) < 0.001) {
    return parsedAmount.toFixed(8);
  }
  
  return parsedAmount.toFixed(decimals);
};

/**
 * Tính phí giao dịch giả lập
 * @param amount Số lượng token nguồn
 * @param fromToken Token nguồn
 * @returns Phí giao dịch
 */
export const calculateFee = (
  amount: string | number,
  fromToken: Token
): number => {
  const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return 0;
  }
  
  // Phí cố định 0.3%
  return parsedAmount * 0.003;
}; 