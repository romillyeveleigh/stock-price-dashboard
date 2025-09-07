/**
 * Custom hooks for stock data with TanStack Query integration
 * STRATEGY: Client-side caching with TanStack Query prevents redundant API calls
 */

import { useQuery, useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { DateRange, StockPriceData } from '@/types';

import { PolygonApiService } from '../services/polygonApi';

// Singleton instance for API calls
const polygonApi = new PolygonApiService();

/**
 * Hook to search for tickers using server-side search
 * OPTIMIZATION: Only searches when user types 3+ characters, uses server-side filtering
 */
export function useTickerSearch(query: string) {
  return useQuery({
    queryKey: ['tickers', 'search', query.trim()],
    queryFn: () => polygonApi.searchTickers(query),
    enabled: query.length >= 3, // Only search when user types 3+ characters
    staleTime: 5 * 60 * 1000, // 5 minutes - search results can be cached briefly
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in memory
    retry: (failureCount, error) => {
      // Never retry rate limit errors to prevent API spam
      if ((error as Error)?.message?.includes('rate limit')) return false;
      if ((error as Error)?.message?.includes('API_RATE_LIMIT')) return false;
      if ((error as Error)?.message?.includes('UNAUTHORIZED')) return false;
      return failureCount < 2; // Limited retries for search
    },
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch stock prices with TanStack Query caching
 * STRATEGY: 60-second staleTime prevents redundant API calls for same stock/date combinations
 */
export function useStockPrices(
  symbol: string,
  dateRange: DateRange,
  enabled = true
) {
  return useQuery({
    queryKey: [
      'stock-prices',
      symbol,
      dateRange.from.toISOString(),
      dateRange.to.toISOString(),
    ],
    queryFn: () =>
      polygonApi.getStockPrices(symbol, dateRange.from, dateRange.to),
    enabled: enabled && !!symbol,
    staleTime: 60 * 1000, // 1 minute - prevents repeat calls within rate limit window
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in memory longer
    retry: (failureCount, error) => {
      // Never retry rate limit errors to avoid API spam
      if ((error as Error)?.message?.includes('rate limit')) return false;
      if ((error as Error)?.message?.includes('API_RATE_LIMIT')) return false;
      if ((error as Error)?.message?.includes('UNAUTHORIZED')) return false;
      return failureCount < 2; // Limited retries for other errors
    },
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch multiple stock prices efficiently with TanStack Query caching
 * STRATEGY: Each stock gets its own query with 60-second cache to prevent redundant calls
 */
export function useMultipleStockPrices(
  symbols: string[],
  dateRange: DateRange,
  enabled = true
) {
  const queries = useQueries({
    queries: symbols.map(symbol => ({
      queryKey: [
        'stock-prices',
        symbol,
        dateRange.from.toISOString(),
        dateRange.to.toISOString(),
      ],
      queryFn: () =>
        polygonApi.getStockPrices(symbol, dateRange.from, dateRange.to),
      enabled: enabled && symbols.length > 0 && symbols.length <= 3, // Limit to 3 stocks
      staleTime: 60 * 1000, // 1 minute cache per stock/date combination
      gcTime: 30 * 60 * 1000, // 30 minutes in memory
      retry: (failureCount: number, error: unknown) => {
        // Never retry rate limit errors to avoid API spam
        if ((error as Error)?.message?.includes('rate limit')) return false;
        if ((error as Error)?.message?.includes('API_RATE_LIMIT')) return false;
        if ((error as Error)?.message?.includes('UNAUTHORIZED')) return false;
        return failureCount < 2; // Limited retries for other errors
      },
      refetchOnWindowFocus: false,
    })),
  });

  return useMemo(() => {
    const isLoading = queries.some(query => query.isLoading);
    const isError = queries.some(query => query.isError);
    const errors = queries
      .filter(query => query.isError)
      .map(query => query.error);

    const data: StockPriceData[] = queries
      .filter(query => query.isSuccess && query.data)
      .map(query => query.data as StockPriceData);

    return {
      data,
      isLoading,
      isError,
      errors,
      queries, // Individual query states for detailed error handling
    };
  }, [queries]);
}

/**
 * Hook for popular stocks suggestions
 * EFFICIENCY: Returns static list of popular stock symbols for suggestions
 */
export function usePopularStocks() {
  return useMemo(() => {
    const popularSymbols = [
      'AAPL',
      'MSFT',
      'GOOGL',
      'AMZN',
      'TSLA',
      'META',
      'NVDA',
      'NFLX',
    ];

    return popularSymbols.map(symbol => ({
      symbol,
      name: '', // Will be filled when user searches
      market: 'stocks' as const,
      locale: 'us' as const,
      active: true,
      type: 'CS',
      primaryExchange: '',
    }));
  }, []);
}
