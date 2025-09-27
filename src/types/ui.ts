/**
 * UI-related types for components and state management
 */

// import type { AppError } from './api'; // Unused for now
import type { PriceType, Stock, StockPriceData, DateRange } from './stock';

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Application state
export interface AppState {
  selectedStocks: Stock[];
  dateRange: DateRange;
  priceType: PriceType;
  smaPeriod: number;
  chartData: StockPriceData[];
  loading: boolean;
  error: string | null;
  stockSuggestions: Stock[];
}

// State actions for useReducer
export type AppAction =
  | { type: 'ADD_STOCK'; payload: Stock }
  | { type: 'REMOVE_STOCK'; payload: string }
  | { type: 'SET_DATE_RANGE'; payload: DateRange }
  | { type: 'SET_PRICE_TYPE'; payload: PriceType }
  | { type: 'SET_SMA_PERIOD'; payload: number }
  | { type: 'SET_CHART_DATA'; payload: StockPriceData[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_STOCK_SUGGESTIONS'; payload: Stock[] }
  | { type: 'RESET_STATE' };

// Theme and styling
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  theme: Theme;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
}

// Responsive breakpoints
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveConfig {
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}
