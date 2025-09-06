/**
 * Reusable empty state components
 * Provides guidance and quick actions when no data is available
 */

import {
  Search,
  TrendingUp,
  Calendar,
  BarChart3,
  Plus,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmptyStateProps {
  className?: string;
  onAction?: () => void;
  actionLabel?: string;
}

interface EmptyStateWithSuggestionsProps extends EmptyStateProps {
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

// No stocks selected state
export function NoStocksSelected({
  className = '',
  onAction,
}: EmptyStateProps) {
  const popularStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA'];

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Card className='w-full max-w-lg'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
            <TrendingUp className='h-8 w-8 text-primary' />
          </div>
          <CardTitle className='text-xl'>Ready to Analyze Stocks?</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6 text-center'>
          <p className='text-muted-foreground'>
            Select up to 3 stocks to start analyzing their historical
            performance and trends.
          </p>

          {/* Quick action suggestions */}
          <div className='space-y-3'>
            <p className='text-sm font-medium'>
              Popular stocks to get started:
            </p>
            <div className='flex flex-wrap justify-center gap-2'>
              {popularStocks.map(stock => (
                <Badge
                  key={stock}
                  variant='secondary'
                  className='cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors'
                  onClick={() => {
                    // Handle popular stock selection
                    console.warn(`Add ${stock} - implement stock selection`);
                  }}
                >
                  {stock}
                </Badge>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <Button onClick={onAction} className='w-full'>
              <Search className='mr-2 h-4 w-4' />
              Search for Stocks
            </Button>
            <p className='text-xs text-muted-foreground'>
              Or use the search box above to find specific companies
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// No data available state
export function NoDataAvailable({
  className = '',
  onAction,
  actionLabel = 'Adjust Date Range',
  dateRange,
  stocks = [],
}: EmptyStateProps & {
  dateRange?: { from: Date; to: Date };
  stocks?: string[];
}) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100'>
            <BarChart3 className='h-6 w-6 text-orange-600' />
          </div>
          <CardTitle className='text-lg'>No Data Available</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 text-center'>
          <p className='text-sm text-muted-foreground'>
            No price data found for the selected criteria.
          </p>

          {stocks.length > 0 && (
            <div className='rounded-lg bg-muted/50 p-3'>
              <p className='text-xs text-muted-foreground mb-2'>
                Selected stocks:
              </p>
              <div className='flex flex-wrap justify-center gap-1'>
                {stocks.map(stock => (
                  <Badge key={stock} variant='outline' className='text-xs'>
                    {stock}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {dateRange && (
            <div className='rounded-lg bg-muted/50 p-3'>
              <p className='text-xs text-muted-foreground mb-1'>Date range:</p>
              <p className='text-xs font-mono'>
                {dateRange.from.toLocaleDateString()} -{' '}
                {dateRange.to.toLocaleDateString()}
              </p>
            </div>
          )}

          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <Lightbulb className='h-3 w-3' />
              <span>
                Try adjusting your date range or selecting different stocks
              </span>
            </div>

            {onAction && (
              <Button onClick={onAction} variant='outline' className='w-full'>
                <Calendar className='mr-2 h-4 w-4' />
                {actionLabel}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// No search results state
export function NoSearchResults({
  className = '',
  query = '',
  suggestions = ['AAPL', 'MSFT', 'GOOGL', 'TSLA'],
  onSuggestionClick,
}: EmptyStateWithSuggestionsProps & { query?: string }) {
  return (
    <div className={`p-4 text-center ${className}`}>
      <div className='space-y-4'>
        <div className='flex flex-col items-center gap-2'>
          <Search className='h-8 w-8 text-muted-foreground' />
          <div>
            <p className='font-medium'>No stocks found</p>
            {query && (
              <p className='text-sm text-muted-foreground'>
                No results for &quot;{query}&quot;
              </p>
            )}
          </div>
        </div>

        <div className='space-y-3'>
          <p className='text-xs text-muted-foreground'>Try searching for:</p>
          <ul className='space-y-1 text-xs text-muted-foreground'>
            <li>
              • Company names (e.g., &quot;Apple&quot;, &quot;Microsoft&quot;)
            </li>
            <li>• Stock symbols (e.g., &quot;AAPL&quot;, &quot;MSFT&quot;)</li>
            <li>• Partial matches (e.g., &quot;APP&quot; for Apple)</li>
          </ul>
        </div>

        {suggestions.length > 0 && (
          <div className='space-y-2'>
            <p className='text-xs font-medium'>Popular stocks:</p>
            <div className='flex flex-wrap justify-center gap-1'>
              {suggestions.map(suggestion => (
                <Badge
                  key={suggestion}
                  variant='secondary'
                  className='cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs'
                  onClick={() => onSuggestionClick?.(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Chart empty state (inline)
export function ChartEmptyState({
  className = '',
  onAction,
  actionLabel = 'Select Stocks',
  height = 400,
  message = 'Select stocks to view their price charts',
}: EmptyStateProps & {
  height?: number;
  message?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ height }}
    >
      <div className='flex flex-col items-center gap-4 text-center max-w-sm'>
        <div className='rounded-full bg-muted p-4'>
          <BarChart3 className='h-8 w-8 text-muted-foreground' />
        </div>
        <div className='space-y-2'>
          <h3 className='font-semibold text-foreground'>No Chart Data</h3>
          <p className='text-sm text-muted-foreground'>{message}</p>
        </div>
        {onAction && (
          <Button onClick={onAction} size='sm'>
            <Plus className='mr-2 h-4 w-4' />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

// Settings empty state
export function SettingsEmptyState({
  className = '',
  onAction,
  actionLabel = 'Load Chart First',
}: EmptyStateProps) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className='text-center space-y-4 max-w-sm'>
        <div className='rounded-full bg-muted p-3 mx-auto w-fit'>
          <TrendingUp className='h-6 w-6 text-muted-foreground' />
        </div>
        <div className='space-y-2'>
          <h3 className='font-medium'>No Chart to Configure</h3>
          <p className='text-sm text-muted-foreground'>
            Select stocks and load chart data to access display settings and
            export options.
          </p>
        </div>
        {onAction && (
          <Button onClick={onAction} variant='outline' size='sm'>
            <ArrowRight className='mr-2 h-4 w-4' />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

// Generic empty state with custom content
export function CustomEmptyState({
  className = '',
  icon: Icon = BarChart3,
  title = 'No Data',
  description = 'No data available to display',
  onAction,
  actionLabel = 'Take Action',
  children,
}: EmptyStateProps & {
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className='text-center space-y-4 max-w-md'>
        <div className='rounded-full bg-muted p-3 mx-auto w-fit'>
          <Icon className='h-6 w-6 text-muted-foreground' />
        </div>
        <div className='space-y-2'>
          <h3 className='font-medium'>{title}</h3>
          <p className='text-sm text-muted-foreground'>{description}</p>
        </div>
        {children}
        {onAction && (
          <Button onClick={onAction} variant='outline'>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
