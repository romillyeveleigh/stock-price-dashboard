/**
 * StockSearch component with autocomplete functionality
 * Provides real-time search with debounced API calls and accessibility features
 */

import { Search, X, TrendingUp } from 'lucide-react';
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';

import { NoSearchResults } from '@/components/EmptyStates';
import { SearchError } from '@/components/ErrorStates';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDebounce, useTickerSearch, useStockSelection } from '@/hooks';
import { APP_CONFIG } from '@/lib';
import type { Stock } from '@/types';

interface StockSearchProps {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function StockSearch({
  className = '',
  placeholder = `Enter stock name or ticker symbol e.g. 'Apple' or AAPL`,
  disabled = false,
}: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const justSelectedRef = useRef(false);

  // Debounce search query to prevent excessive API calls
  const debouncedQuery = useDebounce(query, APP_CONFIG.DEBOUNCE_DELAY);

  // Get search results and stock selection functionality
  const {
    data: searchResults = [],
    isLoading: tickersLoading,
    error: tickersError,
  } = useTickerSearch(debouncedQuery);
  const {
    selectedStocks,
    canAddStock,
    addStock,
    removeStock,
    isStockSelected,
  } = useStockSelection();

  // Convert search results to Stock format
  const suggestions: Stock[] = useMemo(() => {
    return searchResults.map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      market: stock.market,
    }));
  }, [searchResults]);

  // Handle stock selection and deselection
  const handleToggleStock = useCallback(
    (stock: Stock) => {
      if (isStockSelected(stock.symbol)) {
        // Deselect the stock
        removeStock(stock.symbol);
      } else {
        if (!canAddStock) {
          return; // Max limit reached
        }
        // Select the stock
        const success = addStock(stock);
        if (!success) return;
      }

      // Set flag to prevent immediate reopening
      justSelectedRef.current = true;

      // Close dropdown after selection/deselection
      setQuery('');
      setIsOpen(false);
      setSelectedIndex(-1);

      // Focus back to input after a short delay
      setTimeout(() => {
        inputRef.current?.focus();
        justSelectedRef.current = false;
      }, 100);
    },
    [addStock, removeStock, canAddStock, isStockSelected]
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
            handleToggleStock(suggestions[selectedIndex]);
          }
          break;

        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, suggestions, selectedIndex, handleToggleStock]
  );

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      setIsOpen(value.length >= 3); // Only open dropdown when user types 3+ characters
      setSelectedIndex(-1);
    },
    []
  );

  // Handle input focus - only open dropdown if there's a query with 3+ characters
  const handleInputFocus = useCallback(() => {
    // Don't reopen immediately after a selection
    if (!justSelectedRef.current && query.length >= 3) {
      setIsOpen(true);
    }
  }, [query]);

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
    setIsOpen(false); // Close dropdown when clearing
    setSelectedIndex(-1);
    // Remove the focus() call - user clicked X to clear, they don't need focus back
  }, []);

  // Loading state
  const isLoading =
    tickersLoading || (debouncedQuery !== query && query.length >= 3);

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className='relative mt-4'>
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
        {query && !isLoading && (
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
        Type to search for stocks. Use arrow keys to navigate suggestions and
        Enter to select or deselect stocks.
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
              <SearchError
                error={tickersError}
                onRetry={() => window.location.reload()}
              />
            )}

            {/* No results */}
            {!tickersError && !tickersLoading &&
              suggestions.length === 0 &&
              debouncedQuery.length >= 3 && (
                <NoSearchResults
                  query={debouncedQuery}
                  suggestions={[
                    'AAPL',
                    'MSFT',
                    'GOOGL',
                    'TSLA',
                    'AMZN',
                    'NVDA',
                  ]}
                  onSuggestionClick={suggestion => {
                    setQuery(suggestion);
                    setIsOpen(true);
                  }}
                />
              )}

            {/* Minimum character message */}
            {!tickersError && query.length > 0 && query.length < 3 && (
              <div className='p-4 text-center text-sm text-muted-foreground'>
                Type at least 3 characters to search for stocks
              </div>
            )}

            {/* Search suggestions */}
            {suggestions.length > 0 && (
              <div role='listbox' aria-label='Stock suggestions'>
                {/* Header for search results */}
                <div className='border-b bg-muted/20 px-3 py-2 text-xs font-medium text-muted-foreground'>
                  Search Results
                </div>
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
                        flex items-center justify-between p-3 transition-colors
                        ${isSelected ? 'bg-accent' : 'hover:bg-accent/50'}
                        ${!canSelect && !isAlreadySelected ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                        ${isAlreadySelected ? 'bg-muted hover:bg-muted/80' : ''}
                      `}
                      onClick={() => {
                        // Allow clicking to select or deselect
                        if (isAlreadySelected || canAddStock) {
                          handleToggleStock(stock);
                        }
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          // Allow keyboard to select or deselect
                          if (isAlreadySelected || canAddStock) {
                            handleToggleStock(stock);
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
                                Selected (click to remove)
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
