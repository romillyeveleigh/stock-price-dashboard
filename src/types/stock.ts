/**
 * Core stock-related types for the stock price dashboard
 */

// Basic stock information
export interface Stock {
  symbol: string;
  name: string;
  market?: string;
  exchange?: string;
  sector?: string;
  industry?: string;
}

// US Stock with additional metadata
export interface USStock extends Stock {
  market: 'stocks';
  locale: 'us';
  active: boolean;
  type: string; // e.g., 'CS' for Common Stock
  primaryExchange?: string;
}

// Price types for chart display
export type PriceType = 'open' | 'high' | 'low' | 'close';

// Single price data point
export interface PriceDataPoint {
  date: string; // ISO date string (YYYY-MM-DD)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  volumeWeightedPrice?: number;
  transactions?: number;
}

// Stock price data for a specific symbol
export interface StockPriceData {
  symbol: string;
  data: PriceDataPoint[];
  metadata?: {
    isDelayed?: boolean;
    status?: string;
    queryCount?: number;
    resultsCount?: number;
  };
}

// Normalized stock data with metadata
export interface NormalizedStockData {
  symbol: string;
  name: string;
  prices: {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
}

// Chart series data for visualization
export interface LineSeriesData {
  name: string; // Stock symbol
  data: [number, number][]; // [timestamp, price] pairs
  color?: string; // Series color
}

// Volume series data for chart
export interface VolumeSeriesData {
  name: string; // Stock symbol
  data: [number, number][]; // [timestamp, volume]
  color?: string; // Series color
}

// Date range for queries
export interface DateRange {
  from: Date;
  to: Date;
}

// Stock selection constraints
export interface StockSelectionConstraints {
  maxStocks: number;
  allowDuplicates: boolean;
}

// Stock search result
export interface StockSearchResult {
  stocks: Stock[];
  query: string;
  totalResults: number;
}
