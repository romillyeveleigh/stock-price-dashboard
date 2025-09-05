/**
 * StockSearch component with autocomplete functionality
 * Provides real-time search with debounced API calls and accessibility features
 */

import { Search, X, TrendingUp, AlertCircle } from 'lucide-react';
import React, { useState, useCallback, useRef, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDebounce, useAllTickers, useStockSelection } from '@/hooks';
import { APP_CONFIG } from '@/lib';
import type { Stock } from '@/types';

interface StockSearchProps {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function StockSearch({
  className = '',
  placeholder = 'Search stocks by symbol or company name...',
  disabled = false,
}: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search query to prevent excessive API calls
  const debouncedQuery = useDebounce(query, APP_CONFIG.DEBOUNCE_DELAY);

  // Get all tickers and stock selection functionality
  const {
    data: allTickers = [],
    isLoading: tickersLoading,
    error: tickersError,
  } = useAllTickers();
  const { selectedStocks, canAddStock, addStock, isStockSelected } =
    useStockSelection();

  // Get first 10 stocks for when input is empty
  const getDefaultStocks = useCallback((): Stock[] => {
    return allTickers
      .slice(0, 10) // Show first 10 stocks alphabetically
      .map(
        (usStock): Stock => ({
          symbol: usStock.symbol,
          name: usStock.name,
          market: usStock.market,
        })
      );
  }, [allTickers]);

  // Filter stocks based on search query or show first 10 stocks
  const filteredStocks = useCallback((): Stock[] => {
    // If there's a search query, filter based on it
    if (
      debouncedQuery &&
      debouncedQuery.length >= APP_CONFIG.SEARCH_MIN_LENGTH
    ) {
      const searchTerm = debouncedQuery.toLowerCase();
      return allTickers
        .filter(
          stock =>
            stock.symbol.toLowerCase().includes(searchTerm) ||
            stock.name.toLowerCase().includes(searchTerm)
        )
        .slice(0, 10) // Limit results for performance
        .sort((a, b) => {
          // Prioritize ticker symbol matches
          const aTickerMatch = a.symbol.toLowerCase().startsWith(searchTerm);
          const bTickerMatch = b.symbol.toLowerCase().startsWith(searchTerm);

          if (aTickerMatch && !bTickerMatch) return -1;
          if (!aTickerMatch && bTickerMatch) return 1;

          return a.symbol.localeCompare(b.symbol);
        })
        .map(
          (usStock): Stock => ({
            symbol: usStock.symbol,
            name: usStock.name,
            market: usStock.market,
          })
        );
    }

    // If input is focused but empty, show first 10 stocks
    if (isOpen && !query) {
      return getDefaultStocks();
    }

    return [];
  }, [debouncedQuery, allTickers, isOpen, query, getDefaultStocks]);

  const suggestions = filteredStocks();

  // Handle stock selection
  const handleSelectStock = useCallback(
    (stock: Stock) => {
      if (isStockSelected(stock.symbol)) {
        return; // Already selected
      }

      if (!canAddStock) {
        return; // Max limit reached
      }

      const success = addStock(stock);
      if (success) {
        setQuery('');
        setIsOpen(false);
        setSelectedIndex(-1);

        // Focus back to input for better UX
        inputRef.current?.focus();
      }
    },
    [addStock, canAddStock, isStockSelected]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown') {
          setIsOpen(true);
          setSelectedIndex(0);
          e.preventDefault();
        }
        return;
      }

      if (suggestions.length === 0) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;

        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;

        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            handleSelectStock(suggestions[selectedIndex]);
          }
          break;

        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, suggestions, selectedIndex, handleSelectStock]
  );

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      setIsOpen(true); // Keep dropdown open to show popular stocks or search results
      setSelectedIndex(-1);
    },
    []
  );

  // Handle input focus - always open dropdown to show popular stocks or search results
  const handleInputFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear search
  const handleClear = useCallback(() => {
    setQuery('');
    setIsOpen(true); // Keep dropdown open to show all stocks
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  // Loading state
  const isLoading =
    tickersLoading ||
    (debouncedQuery !== query && query.length >= APP_CONFIG.SEARCH_MIN_LENGTH);

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          ref={inputRef}
          type='text'
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className='pl-10 pr-10'
          aria-label='Search stocks'
          aria-expanded={isOpen}
          aria-haspopup='listbox'
          aria-autocomplete='list'
          aria-describedby='search-help'
          role='combobox'
        />

        {/* Clear button */}
        {query && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={handleClear}
            className='absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0'
            aria-label='Clear search'
          >
            <X className='h-4 w-4' />
          </Button>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className='absolute right-3 top-1/2 -translate-y-1/2'>
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
          </div>
        )}
      </div>

      {/* Help text */}
      <div id='search-help' className='sr-only'>
        Click to see all stocks or type to search. Use arrow keys to navigate
        suggestions and Enter to select.
      </div>
      {/* Dropdown with suggestions */}
      {isOpen && (
        <Card
          ref={dropdownRef}
          className='absolute top-full z-50 mt-1 w-full shadow-lg'
        >
          <CardContent className='p-0'>
            {/* Error state */}
            {tickersError && (
              <div className='flex items-center gap-2 p-4 text-sm text-destructive'>
                <AlertCircle className='h-4 w-4' />
                <span>Failed to load stock data. Please try again.</span>
              </div>
            )}

            {/* No results */}
            {!tickersError &&
              suggestions.length === 0 &&
              debouncedQuery.length >= APP_CONFIG.SEARCH_MIN_LENGTH && (
                <div className='p-4 text-sm text-muted-foreground'>
                  No stocks found for &quot;{debouncedQuery}&quot;. Try a
                  different search term.
                </div>
              )}

            {/* Search suggestions or popular stocks */}
            {suggestions.length > 0 && (
              <div role='listbox' aria-label='Stock suggestions'>
                {/* Header for default stocks when no query */}
                {!query && (
                  <div className='border-b bg-muted/20 px-3 py-2 text-xs font-medium text-muted-foreground'>
                    All Stocks
                  </div>
                )}
                {suggestions.map((stock, index) => {
                  const isSelected = index === selectedIndex;
                  const isAlreadySelected = isStockSelected(stock.symbol);
                  const canSelect = canAddStock;

                  return (
                    <div
                      key={stock.symbol}
                      role='option'
                      tabIndex={isSelected ? 0 : -1}
                      aria-selected={isSelected}
                      aria-disabled={!canSelect}
                      className={`
                        flex cursor-pointer items-center justify-between p-3 transition-colors
                        ${isSelected ? 'bg-accent' : 'hover:bg-accent/50'}
                        ${!canSelect ? 'cursor-not-allowed opacity-50' : ''}
                        ${isAlreadySelected ? 'bg-muted' : ''}
                      `}
                      onClick={() => {
                        if (!isAlreadySelected && canAddStock) {
                          handleSelectStock(stock);
                        }
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (!isAlreadySelected && canAddStock) {
                            handleSelectStock(stock);
                          }
                        }
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className='flex items-center gap-3'>
                        <div className='flex h-8 w-8 items-center justify-center rounded bg-primary/10'>
                          <TrendingUp className='h-4 w-4 text-primary' />
                        </div>
                        <div className='flex flex-col'>
                          <div className='flex items-center gap-2'>
                            <span className='font-medium'>{stock.symbol}</span>
                            {isAlreadySelected && (
                              <Badge variant='secondary' className='text-xs'>
                                Selected
                              </Badge>
                            )}
                          </div>
                          <span className='text-sm text-muted-foreground'>
                            {stock.name}
                          </span>
                        </div>
                      </div>

                      {!canSelect && !isAlreadySelected && (
                        <Badge variant='outline' className='text-xs'>
                          Max {APP_CONFIG.MAX_STOCKS} stocks
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer with selected count */}
            {suggestions.length > 0 && (
              <div className='border-t bg-muted/30 p-2 text-xs text-muted-foreground'>
                {selectedStocks.length} of {APP_CONFIG.MAX_STOCKS} stocks
                selected
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
