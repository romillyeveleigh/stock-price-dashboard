/**
 * Custom hook for URL state synchronization
 * Handles reading from and writing to URL query parameters with browser navigation support
 */

import { format, parse, isValid } from 'date-fns';
import { useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

import { useAppContext } from '@/contexts/AppContext';
import { DEFAULT_PRICE_TYPE } from '@/lib';
import type { PriceType } from '@/types';

// Debounce delay for URL updates (prevent excessive history entries)
const URL_UPDATE_DELAY = 500;

// URL parameter keys
const URL_PARAMS = {
  STOCKS: 'stocks',
  FROM: 'from',
  TO: 'to',
  PRICE_TYPE: 'priceType',
} as const;

export function useUrlSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { state, setDateRange, setPriceType, addStock, resetState } =
    useAppContext();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);
  const lastUrlState = useRef<string>('');

  // Parse and validate URL parameters
  const parseUrlParams = useCallback(() => {
    const stocksParam = searchParams.get(URL_PARAMS.STOCKS);
    const fromParam = searchParams.get(URL_PARAMS.FROM);
    const toParam = searchParams.get(URL_PARAMS.TO);
    const priceTypeParam = searchParams.get(URL_PARAMS.PRICE_TYPE);

    const result = {
      stocks: [] as string[],
      dateRange: null as { from: Date; to: Date } | null,
      priceType: DEFAULT_PRICE_TYPE as PriceType,
      hasValidParams: false,
    };

    // Parse stocks
    if (stocksParam) {
      const stockSymbols = stocksParam
        .split(',')
        .map(s => s.trim().toUpperCase())
        .filter(Boolean)
        .slice(0, 3); // Limit to 3 stocks

      if (stockSymbols.length > 0) {
        result.stocks = stockSymbols;
        result.hasValidParams = true;
      }
    }

    // Parse date range with validation
    if (fromParam && toParam) {
      try {
        const fromDate = parse(fromParam, 'yyyy-MM-dd', new Date());
        const toDate = parse(toParam, 'yyyy-MM-dd', new Date());

        if (isValid(fromDate) && isValid(toDate) && fromDate <= toDate) {
          // Ensure dates are not in the future
          const today = new Date();
          const validFromDate = fromDate > today ? today : fromDate;
          const validToDate = toDate > today ? today : toDate;

          result.dateRange = { from: validFromDate, to: validToDate };
          result.hasValidParams = true;
        }
      } catch (error) {
        console.warn('Invalid date format in URL:', error);
      }
    }

    // Parse price type
    if (priceTypeParam && isPriceType(priceTypeParam)) {
      result.priceType = priceTypeParam;
      result.hasValidParams = true;
    }

    return result;
  }, [searchParams]);

  // Handle URL changes (including browser back/forward navigation)
  useEffect(() => {
    const currentUrlState = location.search;

    // Skip if URL hasn't changed (prevents infinite loops)
    if (currentUrlState === lastUrlState.current && !isInitialMount.current) {
      return;
    }

    lastUrlState.current = currentUrlState;

    const urlParams = parseUrlParams();

    if (!urlParams.hasValidParams && !isInitialMount.current) {
      // If URL has no valid params and it's not initial mount, don't change state
      return;
    }

    let hasChanges = false;

    // Update stocks if they've changed
    if (urlParams.stocks.length > 0) {
      const currentSymbols = state.selectedStocks.map(s => s.symbol);

      if (
        JSON.stringify(urlParams.stocks.sort()) !==
        JSON.stringify(currentSymbols.sort())
      ) {
        // Reset and add stocks from URL
        resetState();
        urlParams.stocks.forEach(symbol => {
          addStock({ symbol, name: '' }); // Name will be resolved by the component
        });
        hasChanges = true;
      }
    } else if (isInitialMount.current && state.selectedStocks.length === 0) {
      // On initial mount with no URL stocks, keep default state
      hasChanges = false;
    }

    // Update date range if it's changed
    if (urlParams.dateRange) {
      const currentFrom = format(state.dateRange.from, 'yyyy-MM-dd');
      const currentTo = format(state.dateRange.to, 'yyyy-MM-dd');
      const urlFrom = format(urlParams.dateRange.from, 'yyyy-MM-dd');
      const urlTo = format(urlParams.dateRange.to, 'yyyy-MM-dd');

      if (urlFrom !== currentFrom || urlTo !== currentTo) {
        setDateRange(urlParams.dateRange.from, urlParams.dateRange.to);
        hasChanges = true;
      }
    }

    // Update price type if it's changed
    if (urlParams.priceType !== state.priceType) {
      setPriceType(urlParams.priceType);
      hasChanges = true;
    }

    // Mark initial mount as complete
    if (isInitialMount.current) {
      isInitialMount.current = false;

      if (hasChanges) {
        // URL state synchronized on mount
      }
    }
  }, [
    location.search,
    parseUrlParams,
    state.selectedStocks,
    state.dateRange,
    state.priceType,
    setDateRange,
    setPriceType,
    addStock,
    resetState,
  ]);

  // Update URL when state changes (debounced)
  const updateUrl = useCallback(() => {
    // Skip URL updates during initial mount to prevent overriding URL params
    if (isInitialMount.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const newParams = new URLSearchParams();

      // Add stocks parameter (only if stocks are selected)
      if (state.selectedStocks.length > 0) {
        const stockSymbols = state.selectedStocks
          .map(stock => stock.symbol)
          .filter(Boolean) // Remove any empty symbols
          .join(',');

        if (stockSymbols) {
          newParams.set(URL_PARAMS.STOCKS, stockSymbols);
        }
      }

      // Always add date range parameters (they're always valid)
      try {
        newParams.set(
          URL_PARAMS.FROM,
          format(state.dateRange.from, 'yyyy-MM-dd')
        );
        newParams.set(URL_PARAMS.TO, format(state.dateRange.to, 'yyyy-MM-dd'));
      } catch (error) {
        console.warn('Error formatting dates for URL:', error);
      }

      // Add price type parameter (only if not default)
      if (state.priceType !== DEFAULT_PRICE_TYPE) {
        newParams.set(URL_PARAMS.PRICE_TYPE, state.priceType);
      }

      // Only update URL if parameters have actually changed
      const newUrlString = newParams.toString();
      const currentUrlString = searchParams.toString();

      if (newUrlString !== currentUrlString) {
        lastUrlState.current = `?${newUrlString}`;
        setSearchParams(newParams, { replace: true });
      }
    }, URL_UPDATE_DELAY);
  }, [
    state.selectedStocks,
    state.dateRange,
    state.priceType,
    setSearchParams,
    searchParams,
  ]);

  // Update URL when relevant state changes
  useEffect(() => {
    updateUrl();

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [updateUrl]);

  // Generate shareable URL with current state
  const getShareableUrl = useCallback((): string => {
    try {
      const url = new URL(window.location.origin + window.location.pathname);
      const params = new URLSearchParams();

      // Add stocks if any are selected
      if (state.selectedStocks.length > 0) {
        const stockSymbols = state.selectedStocks
          .map(s => s.symbol)
          .filter(Boolean)
          .join(',');

        if (stockSymbols) {
          params.set(URL_PARAMS.STOCKS, stockSymbols);
        }
      }

      // Always add date range
      params.set(URL_PARAMS.FROM, format(state.dateRange.from, 'yyyy-MM-dd'));
      params.set(URL_PARAMS.TO, format(state.dateRange.to, 'yyyy-MM-dd'));

      // Add price type if not default
      if (state.priceType !== DEFAULT_PRICE_TYPE) {
        params.set(URL_PARAMS.PRICE_TYPE, state.priceType);
      }

      url.search = params.toString();
      return url.toString();
    } catch (error) {
      console.warn('Error generating shareable URL:', error);
      return window.location.href;
    }
  }, [state.selectedStocks, state.dateRange, state.priceType]);

  // Check if current URL has valid parameters
  const hasUrlParams = useCallback((): boolean => {
    return (
      searchParams.has(URL_PARAMS.STOCKS) ||
      searchParams.has(URL_PARAMS.FROM) ||
      searchParams.has(URL_PARAMS.TO) ||
      searchParams.has(URL_PARAMS.PRICE_TYPE)
    );
  }, [searchParams]);

  // Clear all URL parameters
  const clearUrlParams = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  // Copy current URL to clipboard
  const copyShareableUrl = useCallback(async (): Promise<boolean> => {
    try {
      const url = getShareableUrl();
      await navigator.clipboard.writeText(url);
      return true;
    } catch (error) {
      console.warn('Failed to copy URL to clipboard:', error);
      return false;
    }
  }, [getShareableUrl]);

  return {
    getShareableUrl,
    hasUrlParams,
    clearUrlParams,
    copyShareableUrl,
  };
}

// Type guard for price type validation
function isPriceType(value: string): value is PriceType {
  return ['open', 'high', 'low', 'close'].includes(value);
}
