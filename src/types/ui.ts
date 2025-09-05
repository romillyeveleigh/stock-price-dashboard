/**
 * UI-related types for components and state management
 */

import type { AppError } from './api';
import type { PriceType, Stock, StockPriceData, DateRange } from './stock';

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Application state
export interface AppState {
  selectedStocks: Stock[];
  dateRange: DateRange;
  priceType: PriceType;
  chartData: StockPriceData[];
  loading: boolean;
  error: AppError | null;
  stockSuggestions: Stock[];
}

// State actions for useReducer
export type AppAction =
  | { type: 'ADD_STOCK'; payload: Stock }
  | { type: 'REMOVE_STOCK'; payload: string }
  | { type: 'SET_DATE_RANGE'; payload: DateRange }
  | { type: 'SET_PRICE_TYPE'; payload: PriceType }
  | { type: 'SET_CHART_DATA'; payload: StockPriceData[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: AppError | null }
  | { type: 'SET_STOCK_SUGGESTIONS'; payload: Stock[] }
  | { type: 'RESET_STATE' };

// Component prop types
export interface StockSearchProps {
  onStockSelect: (stock: Stock) => void;
  selectedStocks: Stock[];
  maxStocks: number;
  loading?: boolean;
  error?: string | null;
}

export interface DateRangePickerProps {
  fromDate: Date;
  toDate: Date;
  onDateChange: (from: Date, to: Date) => void;
  maxDate: Date;
  minDate?: Date;
  disabled?: boolean;
}

export interface PriceTypeToggleProps {
  selectedType: PriceType;
  onTypeChange: (type: PriceType) => void;
  disabled?: boolean;
}

export interface SelectedStocksProps {
  stocks: Stock[];
  onRemoveStock: (symbol: string) => void;
  maxStocks: number;
  loading?: boolean;
}

export interface StockChartProps {
  data: LineSeriesData[];
  volumeData: VolumeSeriesData[];
  isLoading: boolean;
  error?: string | null;
  priceType: PriceType;
  dateRange: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
}

// Chart-specific types
export interface LineSeriesData {
  name: string; // Stock symbol
  data: [number, number][]; // [timestamp, price] pairs
  color?: string; // Series color
}

export interface VolumeSeriesData {
  name: string; // Stock symbol
  data: [number, number][]; // [timestamp, volume]
  color?: string; // Series color
}

// Layout component props
export interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface HeaderProps {
  onReset: () => void;
  onSettingsToggle: () => void;
  userContext: string; // e.g., "Fund Manager View"
  className?: string;
}

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

// Form validation
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}
