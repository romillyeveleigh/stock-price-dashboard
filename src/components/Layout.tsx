/**
 * Main Layout component with responsive design
 * Handles mobile bottom drawer layouts
 */

import { Label } from '@radix-ui/react-label';

import { Card, CardContent } from '@/components/ui/card';

import { DateRangePicker } from './DateRangePicker';
import { PriceTypeToggle } from './PriceTypeToggle';
import { SelectedStocks } from './SelectedStocks';
import { StockChart } from './StockChart';
import { StockSearch } from './StockSearch';

export function Layout() {
  return (
    <div className='flex h-screen bg-background'>
      {/* Main Content Area */}
      <div className='flex flex-1 flex-col overflow-y-auto '>
        {/* Header */}
        <header className='flex items-center justify-between border-b bg-card px-4 py-2 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex-shrink-0'>
          <div className='w-full max-w-6xl mx-auto'>
            <div className='flex items-center gap-4'>
              <div>
                <h1 className='text-2xl font-semibold text-foreground md:text-3xl'>
                  Stock Price Comparison (US Stock Exchange)
                </h1>
                <p className='text-sm text-muted-foreground'>
                  Fund manager stock analysis tool
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Search Stocks Section */}
        <main className='bg-card px-4 py-2 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex-shrink-0'>
          <div className='w-full max-w-6xl mx-auto'>
            <Card>
              <CardContent className='space-y-4 mt-4'>
                <div className='mt-0'>
                  <Label htmlFor='stock-search' className='text-sm font-medium'>
                    Select Stocks
                  </Label>
                  <StockSearch />
                </div>
                <SelectedStocks />
                <DateRangePicker />
                <PriceTypeToggle />
                <StockChart className='h-full w-full' />
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <footer className='border-t bg-card px-4 py-2 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex-shrink-0'>
          <div className='w-full max-w-6xl mx-auto'>
            <div className='flex flex-col items-center justify-center space-y-1 text-center'>
              <p className='text-xs text-muted-foreground'>
                © 2025 Romilly Eveleigh Stock Price Dashboard
              </p>
              <p className='text-xs text-muted-foreground'>
                Data provided by Polygon.io • For educational purposes only
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
