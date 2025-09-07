/**
 * Application configuration
 */

import { DEV, NODE_ENV, POLYGON_API_KEY, PROD } from '@/constants';
import type { ApiClientConfig, RateLimitConfig } from '@/types';

export const ENV = {
  POLYGON_API_KEY: POLYGON_API_KEY,
  NODE_ENV: NODE_ENV,
  DEV: DEV,
  PROD: PROD,
} as const;

// Debug logging in development
if (ENV.DEV) {
  console.warn('Environment variables:', {
    POLYGON_API_KEY: ENV.POLYGON_API_KEY
      ? `${ENV.POLYGON_API_KEY.slice(0, 8)}...`
      : 'NOT SET',
    NODE_ENV: ENV.NODE_ENV,
  });
}

// API Configuration
export const API_CONFIG: ApiClientConfig = {
  baseUrl: 'https://api.polygon.io',
  apiKey: ENV.POLYGON_API_KEY,
  rateLimit: {
    maxRequests: 5, // Polygon.io free tier: 5 requests per minute
    windowMs: 60 * 1000, // 1 minute
    retryAfter: 60 * 1000, // Wait 1 minute before retrying
  } satisfies RateLimitConfig,
  defaultTimeout: 10000, // 10 seconds
  maxRetries: 2,
};

// Application Constants
export const APP_CONFIG = {
  // Stock selection
  MAX_STOCKS: 3,
  DEFAULT_STOCK: 'AAPL',

  // Date ranges
  DEFAULT_DATE_RANGE_DAYS: 30,
  MAX_DATE_RANGE_YEARS: 5,

  // Chart configuration
  DEFAULT_CHART_HEIGHT: {
    mobile: 320,  
    tablet: 400,  
    desktop: 480, 
  },
  CHART_COLORS: [
    '#3b82f6', // Professional blue
    '#10b981', // Professional green
    '#f59e0b', // Professional amber
    '#ef4444', // Professional red
    '#8b5cf6', // Professional purple
    '#06b6d4', // Professional cyan
    '#84cc16', // Professional lime
    '#f97316', // Professional orange
  ],

  // Performance
  DEBOUNCE_DELAY: 300, // ms
  SEARCH_MIN_LENGTH: 2,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes

  // UI
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
} as const;

// Feature flags
export const FEATURES = {
  ENABLE_DARK_MODE: true,
  ENABLE_EXPORT: true,
  ENABLE_ADVANCED_CHARTS: true,
  ENABLE_REAL_TIME: false, // Future feature
  ENABLE_PORTFOLIO: false, // Future feature
} as const;

// Error messages
export const ERROR_MESSAGES = {
  INVALID_API_KEY:
    'Invalid or missing API key. Please check your configuration.',
  RATE_LIMIT_EXCEEDED:
    'API rate limit exceeded. Please wait before making more requests.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  INVALID_STOCK_SYMBOL: 'Invalid stock symbol. Please enter a valid symbol.',
  DATE_RANGE_TOO_LARGE:
    'Date range is too large. Please select a smaller range.',
  NO_DATA_AVAILABLE: 'No data available for the selected criteria.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

// Validation rules
export const VALIDATION = {
  STOCK_SYMBOL: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 5,
    PATTERN: /^[A-Z]{1,5}(\.[A-Z]{1,2})?$/,
  },
  API_KEY: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 100,
  },
  DATE_RANGE: {
    MAX_YEARS: 5,
  },
} as const;

// Development helpers
export const isDevelopment = ENV.NODE_ENV === 'development';
export const isProduction = ENV.NODE_ENV === 'production';

// Logging configuration
export const LOGGING = {
  LEVEL: isDevelopment ? 'debug' : 'error',
  ENABLE_CONSOLE: isDevelopment,
  ENABLE_REMOTE: isProduction,
} as const;
