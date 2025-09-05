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

// Default price type
export const DEFAULT_PRICE_TYPE: PriceType = 'close';

// Popular stock symbols for quick selection
export const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'AMD', name: 'Advanced Micro Devices Inc.' },
  { symbol: 'INTC', name: 'Intel Corporation' },
] as const;

// Market sectors
export const MARKET_SECTORS = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Consumer Cyclical',
  'Communication Services',
  'Industrials',
  'Consumer Defensive',
  'Energy',
  'Utilities',
  'Real Estate',
  'Basic Materials',
] as const;

// Chart themes
export const CHART_THEMES = {
  LIGHT: {
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    gridColor: '#e5e7eb',
    crosshairColor: '#6b7280',
  },
  DARK: {
    backgroundColor: '#1f2937',
    textColor: '#f9fafb',
    gridColor: '#374151',
    crosshairColor: '#9ca3af',
  },
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  SEARCH: 'ctrl+k',
  RESET: 'ctrl+r',
  EXPORT: 'ctrl+e',
  TOGGLE_THEME: 'ctrl+shift+t',
  ZOOM_IN: 'ctrl+=',
  ZOOM_OUT: 'ctrl+-',
  ZOOM_RESET: 'ctrl+0',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  SELECTED_STOCKS: 'stock-dashboard-selected-stocks',
  DATE_RANGE: 'stock-dashboard-date-range',
  PRICE_TYPE: 'stock-dashboard-price-type',
  THEME: 'stock-dashboard-theme',
  CHART_SETTINGS: 'stock-dashboard-chart-settings',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  TICKERS: '/v3/reference/tickers',
  AGGREGATES:
    '/v2/aggs/ticker/{symbol}/range/{multiplier}/{timespan}/{from}/{to}',
  TICKER_DETAILS: '/v3/reference/tickers/{symbol}',
  MARKET_STATUS: '/v1/marketstatus/now',
} as const;

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

// Time constants
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
} as const;

// Regex patterns
export const PATTERNS = {
  STOCK_SYMBOL: /^[A-Z]{1,5}(\.[A-Z]{1,2})?$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  DATE_ISO: /^\d{4}-\d{2}-\d{2}$/,
} as const;

// Animation durations (in milliseconds)
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  CHART_TRANSITION: 750,
} as const;
