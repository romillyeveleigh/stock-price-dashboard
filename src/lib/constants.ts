/**
 * Application constants
 */

import type { PriceType } from '@/types';

// Price type options
export const PRICE_TYPES: Array<{ value: PriceType; label: string }> = [
  { value: 'open', label: 'Open' },
  { value: 'high', label: 'High' },
  { value: 'low', label: 'Low' },
  { value: 'close', label: 'Close' },
] as const;

// SMA period options
export const SMA_PERIODS: Array<{ value: number; label: string }> = [
  { value: 5, label: '5D' },
  { value: 10, label: '10D' },
  { value: 50, label: '50D' },
] as const;

// Default price type
export const DEFAULT_PRICE_TYPE: PriceType = 'close';

// Default SMA period
export const DEFAULT_SMA_PERIOD: number | null = null;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const DEFAULT_STOCKS: Array<{
  symbol: string;
  name: string;
  market: string;
}> = [
  { symbol: 'GOOGL', name: 'Alphabet Inc.', market: 'stocks' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', market: 'stocks' },
];
