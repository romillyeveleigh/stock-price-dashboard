/**
 * Application Context for global state management
 * Manages stock selection, date range, price type, and chart data
 */

import { subMonths } from 'date-fns';
import React, { createContext, useContext, useReducer } from 'react';

import { APP_CONFIG, DEFAULT_PRICE_TYPE, DEFAULT_SMA_PERIOD } from '@/lib';
import { DEFAULT_STOCKS } from '@/lib/constants';
import type {
  AppState,
  AppAction,
  Stock,
  PriceType,
  StockPriceData,
} from '@/types';

// Initial state with defaults
const initialState: AppState = {
  selectedStocks: DEFAULT_STOCKS,
  dateRange: {
    // Default to last 12 months as per APP_CONFIG
    from: subMonths(new Date(), 12),
    to: new Date(),
  },
  smaPeriod: DEFAULT_SMA_PERIOD,
  priceType: DEFAULT_PRICE_TYPE,
  chartData: [],
  loading: false,
  error: null,
  stockSuggestions: [],
};

// Reducer function for state updates
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_STOCK':
      // Prevent duplicates and enforce 3-stock limit
      if (
        state.selectedStocks.some(
          stock => stock.symbol === action.payload.symbol
        )
      ) {
        return {
          ...state,
          error: `${action.payload.symbol} is already selected`,
        };
      }

      if (state.selectedStocks.length >= APP_CONFIG.MAX_STOCKS) {
        return {
          ...state,
          error: `Maximum ${APP_CONFIG.MAX_STOCKS} stocks allowed`,
        };
      }

      return {
        ...state,
        selectedStocks: [...state.selectedStocks, action.payload],
        error: null,
      };

    case 'REMOVE_STOCK':
      return {
        ...state,
        selectedStocks: state.selectedStocks.filter(
          stock => stock.symbol !== action.payload
        ),
        error: null,
      };

    case 'SET_DATE_RANGE':
      return {
        ...state,
        dateRange: action.payload,
        error: null,
      };

    case 'SET_SMA_PERIOD':
      return {
        ...state,
        smaPeriod: action.payload === state.smaPeriod ? null : action.payload,
        error: null,
      };

    case 'SET_PRICE_TYPE':
      return {
        ...state,
        priceType: action.payload,
      };

    case 'SET_CHART_DATA':
      return {
        ...state,
        chartData: action.payload,
        loading: false,
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error, // Clear error when loading starts
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case 'SET_STOCK_SUGGESTIONS':
      return {
        ...state,
        stockSuggestions: action.payload,
      };

    case 'RESET_STATE':
      return {
        selectedStocks: [],
        dateRange: {
          from: subMonths(new Date(), 1),
          to: new Date(),
        },
        smaPeriod: DEFAULT_SMA_PERIOD,
        priceType: DEFAULT_PRICE_TYPE,
        chartData: [],
        loading: false,
        error: null,
        stockSuggestions: [],
      };

    default:
      return state;
  }
}

// Context type definition
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Convenience action creators
  addStock: (stock: Stock) => void;
  removeStock: (symbol: string) => void;
  setDateRange: (from: Date, to: Date) => void;
  setPriceType: (priceType: PriceType) => void;
  setSmaPeriod: (period: number | null) => void;
  setChartData: (data: StockPriceData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setStockSuggestions: (suggestions: Stock[]) => void;
  resetState: () => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Context provider component
interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Convenience action creators
  const addStock = (stock: Stock) => {
    dispatch({ type: 'ADD_STOCK', payload: stock });
  };

  const removeStock = (symbol: string) => {
    dispatch({ type: 'REMOVE_STOCK', payload: symbol });
  };

  const setDateRange = (from: Date, to: Date) => {
    dispatch({ type: 'SET_DATE_RANGE', payload: { from, to } });
  };

  const setPriceType = (priceType: PriceType) => {
    dispatch({ type: 'SET_PRICE_TYPE', payload: priceType });
  };

  const setSmaPeriod = (period: number | null) => {
    dispatch({ type: 'SET_SMA_PERIOD', payload: period });
  };

  const setChartData = (data: StockPriceData[]) => {
    dispatch({ type: 'SET_CHART_DATA', payload: data });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setStockSuggestions = (suggestions: Stock[]) => {
    dispatch({ type: 'SET_STOCK_SUGGESTIONS', payload: suggestions });
  };

  const resetState = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    addStock,
    removeStock,
    setDateRange,
    setPriceType,
    setSmaPeriod,
    setChartData,
    setLoading,
    setError,
    setStockSuggestions,
    resetState,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

// Custom hook to use the app context
// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
