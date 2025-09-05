/**
 * Custom hook for URL state synchronization
 * Handles reading from and writing to URL query parameters
 */

import { format, parse, isValid } from 'date-fns';
import { useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAppContext } from '@/contexts/AppContext';
import { DEFAULT_PRICE_TYPE } from '@/lib';
import type { PriceType } from '@/types';

// Debounce delay for URL updates (prevent excessive history entries)
const URL_UPDATE_DELAY = 500;

export function useUrlSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state, setDateRange, setPriceType, addStock, resetState } =
    useAppContext();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Parse URL parameters on mount only (not when state changes)
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Only parse URL on initial mount to avoid circular updates
    if (!isInitialMount.current) return;

    const stocksParam = searchParams.get('stocks');
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const priceTypeParam = searchParams.get('priceType');

    let hasChanges = false;

    // Parse and set stocks
    if (stocksParam) {
      const stockSymbols = stocksParam.split(',').filter(Boolean);
      const currentSymbols = state.selectedStocks.map(s => s.symbol);

      // Check if stocks have changed
      if (
        JSON.stringify(stockSymbols.sort()) !==
        JSON.stringify(currentSymbols.sort())
      ) {
        // Reset and add stocks from URL
        resetState();
        stockSymbols.forEach(symbol => {
          // Note: We only have symbol from URL, name will be resolved later
          addStock({ symbol: symbol.toUpperCase(), name: '' });
        });
        hasChanges = true;
      }
    }

    // Parse and set date range
    if (fromParam && toParam) {
      try {
        const fromDate = parse(fromParam, 'yyyy-MM-dd', new Date());
        const toDate = parse(toParam, 'yyyy-MM-dd', new Date());

        if (isValid(fromDate) && isValid(toDate)) {
          const currentFrom = format(state.dateRange.from, 'yyyy-MM-dd');
          const currentTo = format(state.dateRange.to, 'yyyy-MM-dd');

          if (fromParam !== currentFrom || toParam !== currentTo) {
            setDateRange(fromDate, toDate);
            hasChanges = true;
          }
        }
      } catch (error) {
        console.warn('Invalid date format in URL:', error);
      }
    }

    // Parse and set price type
    if (priceTypeParam && isPriceType(priceTypeParam)) {
      if (priceTypeParam !== state.priceType) {
        setPriceType(priceTypeParam);
        hasChanges = true;
      }
    }

    // Mark initial mount as complete
    isInitialMount.current = false;

    // Only log if we actually made changes to avoid infinite loops
    if (hasChanges) {
      // eslint-disable-next-line no-console
      console.debug('URL state synchronized on mount');
    }
  }, [searchParams, setDateRange, setPriceType, addStock, resetState]); // Include action functions but not state

  // Update URL when state changes (debounced)
  const updateUrl = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const newParams = new URLSearchParams();

      // Add stocks parameter
      if (state.selectedStocks.length > 0) {
        const stockSymbols = state.selectedStocks
          .map(stock => stock.symbol)
          .join(',');
        newParams.set('stocks', stockSymbols);
      }

      // Add date range parameters
      newParams.set('from', format(state.dateRange.from, 'yyyy-MM-dd'));
      newParams.set('to', format(state.dateRange.to, 'yyyy-MM-dd'));

      // Add price type parameter (only if not default)
      if (state.priceType !== DEFAULT_PRICE_TYPE) {
        newParams.set('priceType', state.priceType);
      }

      // Update URL without triggering navigation
      setSearchParams(newParams, { replace: true });
    }, URL_UPDATE_DELAY);
  }, [state.selectedStocks, state.dateRange, state.priceType, setSearchParams]);

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

  // Generate shareable URL
  const getShareableUrl = useCallback((): string => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams();

    if (state.selectedStocks.length > 0) {
      params.set('stocks', state.selectedStocks.map(s => s.symbol).join(','));
    }

    params.set('from', format(state.dateRange.from, 'yyyy-MM-dd'));
    params.set('to', format(state.dateRange.to, 'yyyy-MM-dd'));

    if (state.priceType !== DEFAULT_PRICE_TYPE) {
      params.set('priceType', state.priceType);
    }

    url.search = params.toString();
    return url.toString();
  }, [state.selectedStocks, state.dateRange, state.priceType]);

  return {
    getShareableUrl,
  };
}

// Type guard for price type validation
function isPriceType(value: string): value is PriceType {
  return ['open', 'high', 'low', 'close'].includes(value);
}
