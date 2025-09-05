/**
 * Custom hooks for stock data with TanStack Query integration
 * STRATEGY: Client-side caching with TanStack Query prevents redundant API calls
 */

import { useQuery, useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import { APP_CONFIG } from '@/lib';
import type { DateRange, StockPriceData, USStock } from '@/types';

import { PolygonApiService } from '../services/polygonApi';

// Singleton instance for API calls
const polygonApi = new PolygonApiService();

/**
 * Hook to fetch all available tickers with aggressive caching
 * EFFICIENCY: Single API call on app load, cached for 24 hours
 */
export function useAllTickers() {
  return useQuery({
    queryKey: ['tickers', 'all'],
    queryFn: () => polygonApi.getAllTickers(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - ticker list changes infrequently
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days - keep cached for a week
    retry: (failureCount, error) => {
      // Never retry rate limit errors to prevent API spam
      if ((error as Error)?.message?.includes('rate limit')) return false;
      if ((error as Error)?.message?.includes('API_RATE_LIMIT')) return false;
      if ((error as Error)?.message?.includes('UNAUTHORIZED')) return false;
      return failureCount < 2; // Conservative retry for other errors
    },
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
  });
}

/**
 * Client-side stock search hook to minimize API usage
 * EFFICIENCY: No API calls, searches cached ticker list
 */
export function useStockSearch(query: string, allTickers: USStock[] = []) {
  return useMemo(() => {
    if (!query || query.length < APP_CONFIG.SEARCH_MIN_LENGTH) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();

    return allTickers
      .filter(
        stock =>
          stock.symbol.toLowerCase().includes(searchTerm) ||
          stock.name.toLowerCase().includes(searchTerm)
      )
      .slice(0, 10) // Limit results for performance
      .sort((a, b) => {
        // Prioritize symbol matches
        const aSymbolMatch = a.symbol.toLowerCase().startsWith(searchTerm);
        const bSymbolMatch = b.symbol.toLowerCase().startsWith(searchTerm);

        if (aSymbolMatch && !bSymbolMatch) return -1;
        if (!aSymbolMatch && bSymbolMatch) return 1;

        // Then prioritize exact matches
        const aExactMatch = a.symbol.toLowerCase() === searchTerm;
        const bExactMatch = b.symbol.toLowerCase() === searchTerm;

        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;

        // Finally sort alphabetically
        return a.symbol.localeCompare(b.symbol);
      });
  }, [query, allTickers]);
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
 * Hook for popular stocks with pre-loaded data
 * EFFICIENCY: Uses popular stocks as fallback when search is empty
 */
export function usePopularStocks(allTickers: USStock[] = []) {
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

    return popularSymbols
      .map(symbol => allTickers.find(stock => stock.symbol === symbol))
      .filter((stock): stock is USStock => stock !== undefined);
  }, [allTickers]);
}
