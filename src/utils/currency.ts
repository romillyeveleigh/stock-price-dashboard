/**
 * Currency and number formatting utilities
 */

/**
 * Formats a number as currency (USD)
 */
export function formatCurrency(
  value: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    compact?: boolean;
  } = {}
): string {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    compact = false,
  } = options;

  if (compact && Math.abs(value) >= 1000000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Formats a number as a percentage
 */
export function formatPercentage(
  value: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSign?: boolean;
  } = {}
): string {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    showSign = false,
  } = options;

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
    signDisplay: showSign ? 'always' : 'auto',
  }).format(value / 100);

  return formatted;
}

/**
 * Formats a large number with appropriate suffixes (K, M, B)
 */
export function formatLargeNumber(value: number): string {
  const absValue = Math.abs(value);

  if (absValue >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  } else if (absValue >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (absValue >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value.toString();
}

/**
 * Formats volume numbers for display
 */
export function formatVolume(volume: number): string {
  return formatLargeNumber(volume);
}

/**
 * Calculates percentage change between two values
 */
export function calculatePercentageChange(
  oldValue: number,
  newValue: number
): number {
  if (oldValue === 0) {
    return newValue === 0 ? 0 : 100;
  }

  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Formats a price change with appropriate styling information
 */
export function formatPriceChange(
  change: number,
  percentChange: number
): {
  change: string;
  percentage: string;
  isPositive: boolean;
  isNegative: boolean;
  isNeutral: boolean;
} {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isNeutral = change === 0;

  return {
    change: formatCurrency(Math.abs(change)),
    percentage: formatPercentage(Math.abs(percentChange)),
    isPositive,
    isNegative,
    isNeutral,
  };
}
