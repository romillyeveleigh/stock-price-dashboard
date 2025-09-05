/**
 * SelectedStocks component for displaying selected stocks with remove functionality
 * Shows company name, ticker symbol, and provides remove buttons with responsive layout
 */

import { X, TrendingUp, Building2 } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStockSelection } from '@/hooks';
// import { APP_CONFIG } from '@/lib'; // Used in component logic
// import type { Stock } from '@/types'; // Used for type definitions

interface SelectedStocksProps {
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  showRemoveButtons?: boolean;
  showStockCount?: boolean;
}

export function SelectedStocks({
  className = '',
  variant = 'default',
  showRemoveButtons = true,
  showStockCount = true,
}: SelectedStocksProps) {
  const { selectedStocks, removeStock, stockCount, maxStocks } =
    useStockSelection();

  // Handle stock removal
  const handleRemoveStock = (symbol: string) => {
    removeStock(symbol);
  };

  // Handle keyboard removal
  const handleKeyDown = (e: React.KeyboardEvent, symbol: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRemoveStock(symbol);
    }
  };

  // Empty state
  if (selectedStocks.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className='flex flex-col items-center gap-3 text-muted-foreground'>
          <TrendingUp className='h-12 w-12 opacity-50' />
          <div className='space-y-1'>
            <p className='text-sm font-medium'>No stocks selected</p>
            <p className='text-xs'>
              Search and select up to {maxStocks} stocks to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render based on variant
  if (variant === 'minimal') {
    return (
      <div className={`flex flex-wrap gap-1 ${className}`}>
        {selectedStocks.map(stock => (
          <Badge key={stock.symbol} variant='secondary' className='text-xs'>
            {stock.symbol}
            {showRemoveButtons && (
              <Button
                variant='ghost'
                size='sm'
                className='ml-1 h-3 w-3 p-0 hover:bg-destructive hover:text-destructive-foreground'
                onClick={() => handleRemoveStock(stock.symbol)}
                onKeyDown={e => handleKeyDown(e, stock.symbol)}
                aria-label={`Remove ${stock.symbol} from selection`}
              >
                <X className='h-2 w-2' />
              </Button>
            )}
          </Badge>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        {showStockCount && (
          <div className='flex items-center justify-between text-sm'>
            <span className='font-medium'>Selected Stocks</span>
            <Badge variant='outline' className='text-xs'>
              {stockCount} of {maxStocks}
            </Badge>
          </div>
        )}
        <div className='flex flex-wrap gap-2'>
          {selectedStocks.map(stock => (
            <div
              key={stock.symbol}
              className='flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm'
            >
              <TrendingUp className='h-3 w-3 text-primary' />
              <div className='flex flex-col'>
                <span className='font-medium'>{stock.symbol}</span>
                {stock.name && (
                  <span className='text-xs text-muted-foreground truncate max-w-[120px]'>
                    {stock.name}
                  </span>
                )}
              </div>
              {showRemoveButtons && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='ml-1 h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground'
                  onClick={() => handleRemoveStock(stock.symbol)}
                  onKeyDown={e => handleKeyDown(e, stock.symbol)}
                  aria-label={`Remove ${stock.symbol} from selection`}
                >
                  <X className='h-3 w-3' />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default variant - full featured
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with count */}
      {showStockCount && (
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Building2 className='h-4 w-4 text-primary' />
            <h3 className='text-sm font-medium'>Selected Stocks</h3>
          </div>
          <Badge
            variant={stockCount >= maxStocks ? 'destructive' : 'secondary'}
            className='text-xs'
          >
            {stockCount} of {maxStocks}
          </Badge>
        </div>
      )}

      {/* Stock list */}
      <div className='space-y-2'>
        {selectedStocks.map((stock, index) => (
          <Card key={stock.symbol} className='transition-all hover:shadow-sm'>
            <CardContent className='flex items-center justify-between p-4'>
              {/* Stock info */}
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                  <TrendingUp className='h-4 w-4 text-primary' />
                </div>
                <div className='flex flex-col'>
                  <div className='flex items-center gap-2'>
                    <span className='font-semibold text-foreground'>
                      {stock.symbol}
                    </span>
                    <Badge variant='outline' className='text-xs'>
                      #{index + 1}
                    </Badge>
                  </div>
                  {stock.name && (
                    <span className='text-sm text-muted-foreground'>
                      {stock.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Remove button */}
              {showRemoveButtons && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground'
                  onClick={() => handleRemoveStock(stock.symbol)}
                  onKeyDown={e => handleKeyDown(e, stock.symbol)}
                  aria-label={`Remove ${stock.symbol} (${stock.name}) from selection`}
                >
                  <X className='h-4 w-4' />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer info */}
      <div className='flex items-center justify-between text-xs text-muted-foreground'>
        <span>
          {stockCount === maxStocks
            ? 'Maximum stocks selected'
            : `${maxStocks - stockCount} more stock${maxStocks - stockCount === 1 ? '' : 's'} can be added`}
        </span>
        {stockCount > 0 && <span>Click × to remove stocks</span>}
      </div>
    </div>
  );
}
