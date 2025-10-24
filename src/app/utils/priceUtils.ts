/**
 * Calculate discount percentage based on original and current price
 * @param originalPrice - The original price
 * @param currentPrice - The current/discounted price
 * @returns The discount percentage as a string (e.g., "42%")
 */
export function calculateDiscountPercentage(originalPrice: number, currentPrice: number): string {
  if (originalPrice <= 0 || currentPrice <= 0) return '0%';
  if (currentPrice >= originalPrice) return '0%';
  
  const discountAmount = originalPrice - currentPrice;
  const discountPercentage = (discountAmount / originalPrice) * 100;
  
  // Round to nearest integer
  return `${Math.round(discountPercentage)}%`;
}

/**
 * Format price with Turkish Lira symbol
 * @param price - The price to format
 * @returns Formatted price string (e.g., "₺ 1,200.00")
 */
export function formatPrice(price: number): string {
  return `₺ ${price.toFixed(2)}`;
}
