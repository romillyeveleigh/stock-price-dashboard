/**
 * Validation utility functions
 */

import type { DateRange, Stock } from '@/types';

/**
 * Validates a stock symbol format
 */
export function validateStockSymbol(symbol: string): boolean {
  if (!symbol || typeof symbol !== 'string') {
    return false;
  }

  // Basic validation: 1-5 uppercase letters, possibly with dots
  const symbolRegex = /^[A-Z]{1,5}(\.[A-Z]{1,2})?$/;
  return symbolRegex.test(symbol.toUpperCase());
}

/**
 * Validates a date range
 */
export function validateDateRange(dateRange: DateRange): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const { from, to } = dateRange;
  const now = new Date();

  // Check if dates are valid Date objects
  if (!(from instanceof Date) || isNaN(from.getTime())) {
    errors.push('From date is invalid');
  }

  if (!(to instanceof Date) || isNaN(to.getTime())) {
    errors.push('To date is invalid');
  }

  // Check if from date is before to date
  if (from >= to) {
    errors.push('From date must be before to date');
  }

  // Check if dates are not in the future
  if (from > now) {
    errors.push('From date cannot be in the future');
  }

  if (to > now) {
    errors.push('To date cannot be in the future');
  }

  // Check if date range is not too large (e.g., more than 5 years)
  const maxRangeMs = 5 * 365 * 24 * 60 * 60 * 1000; // 5 years in milliseconds
  if (to.getTime() - from.getTime() > maxRangeMs) {
    errors.push('Date range cannot exceed 5 years');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates stock selection constraints
 */
export function validateStockSelection(
  selectedStocks: Stock[],
  newStock: Stock,
  maxStocks: number
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if adding this stock would exceed the limit
  if (selectedStocks.length >= maxStocks) {
    errors.push(`Cannot select more than ${maxStocks} stocks`);
  }

  // Check if stock is already selected
  const isDuplicate = selectedStocks.some(
    stock => stock.symbol === newStock.symbol
  );
  if (isDuplicate) {
    errors.push(`Stock ${newStock.symbol} is already selected`);
  }

  // Validate the stock symbol
  if (!validateStockSymbol(newStock.symbol)) {
    errors.push(`Invalid stock symbol: ${newStock.symbol}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates API key format
 */
export function validateApiKey(apiKey: string): boolean {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }

  // Basic validation: non-empty string with reasonable length
  return apiKey.length >= 10 && apiKey.length <= 100;
}
