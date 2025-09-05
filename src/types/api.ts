/**
 * API-related types for Polygon.io integration
 */

// Base API response structure
export interface BaseApiResponse {
  status: string;
  request_id?: string;
  next_url?: string;
}

// API error types
export interface ApiError {
  status?: number;
  message?: string;
  details?: unknown;
}

// Error types for different scenarios
export enum ErrorType {
  API_RATE_LIMIT = 'API_RATE_LIMIT',
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_DATE_RANGE = 'INVALID_DATE_RANGE',
  NO_DATA_AVAILABLE = 'NO_DATA_AVAILABLE',
  STOCK_LIMIT_EXCEEDED = 'STOCK_LIMIT_EXCEEDED',
  INVALID_STOCK_SYMBOL = 'INVALID_STOCK_SYMBOL',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

// Application error with context
export interface AppError {
  type: ErrorType;
  message: string;
  details?: unknown;
  timestamp: Date;
}

// Polygon.io specific response types
export interface PolygonTickersResponse extends BaseApiResponse {
  results: {
    ticker: string;
    name: string;
    market: string;
    locale: string;
    primary_exchange: string;
    type: string;
    active: boolean;
    currency_name?: string;
    cik?: string;
    composite_figi?: string;
    share_class_figi?: string;
    last_updated_utc?: string;
  }[];
  count: number;
}

// Polygon.io aggregates response
export interface PolygonAggregatesResponse extends BaseApiResponse {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: {
    v: number; // Volume
    vw: number; // Volume weighted average price
    o: number; // Open price
    c: number; // Close price
    h: number; // High price
    l: number; // Low price
    t: number; // Timestamp (Unix milliseconds)
    n: number; // Number of transactions
  }[];
}

// API request configuration
export interface ApiRequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
}

// Rate limiting configuration
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  retryAfter?: number;
}

// API client configuration
export interface ApiClientConfig {
  baseUrl: string;
  apiKey: string;
  rateLimit: RateLimitConfig;
  defaultTimeout: number;
  maxRetries: number;
}
