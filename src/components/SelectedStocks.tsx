/**
 * SelectedStocks component for displaying selected stocks with remove functionality
 * Shows company name, ticker symbol, and provides remove buttons with responsive layout
 */

import { X } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStockSelection } from '@/hooks';
import { APP_CONFIG } from '@/lib';
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
  showRemoveButtons = true,
}: SelectedStocksProps) {
  const { selectedStocks, removeStock } = useStockSelection();

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

  const getColor = (index: number) => {
    const baseColor =
      APP_CONFIG.CHART_COLORS[index % APP_CONFIG.CHART_COLORS.length];
    return `${baseColor}50`; // Adding 80 for 50% opacity in hex
  };

  return (
    <div className={`flex flex-wrap gap-1 ${className} min-h-[22px]`}>
      {selectedStocks.map((stock, index) => (
        <Badge
          key={stock.symbol}
          variant='secondary'
          className='text-xs'
          style={{ backgroundColor: getColor(index) }}
        >
          {stock.symbol} {stock.name && `- ${stock.name}`}
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
