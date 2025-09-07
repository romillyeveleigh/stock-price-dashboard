/**
 * Main Layout component with responsive design
 * Handles mobile bottom drawer layouts
 */

import { useState, useEffect } from 'react';

import { Card, CardContent } from '@/components/ui/card';

import { DateRangePicker } from './DateRangePicker';
import { PriceTypeToggle } from './PriceTypeToggle';
import { SelectedStocks } from './SelectedStocks';
import { StockChart } from './StockChart';
import { StockSearch } from './StockSearch';
import { Label } from '@radix-ui/react-label';

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='flex h-screen bg-background'>
      {/* Main Content Area */}
      <div className='flex flex-1 flex-col overflow-y-auto'>
        {/* Header */}
        <header className='flex items-center justify-between border-b bg-card px-4 py-3 md:px-6 flex-shrink-0'>
          <div className='flex items-center gap-4'>
            <div>
              <h1 className='text-lg font-semibold text-foreground md:text-xl'>
                Stock Price Comparison (US Stock Exchange)
              </h1>
              <p className='text-sm text-muted-foreground'>
                Fund manager stock analysis tool
              </p>
            </div>
          </div>
        </header>

        {/* Search Stocks Section - Above Chart */}
        <div className='bg-card px-4 py-4 md:px-6 flex-shrink-0'>
          <Card >
            <CardContent className='space-y-4 mt-6'>
              <div className='mt-4'>
                <Label htmlFor='stock-search' className='text-sm font-medium'>Select Stocks</Label>
                <StockSearch />
              </div>
              <SelectedStocks />
              <DateRangePicker />
              <PriceTypeToggle />
              <StockChart className='h-full w-full' />
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className='border-t bg-card px-4 py-3 md:px-6 flex-shrink-0'>
          <div className='flex flex-col items-center justify-center space-y-1 text-center'>
            <p className='text-xs text-muted-foreground'>
              © 2025 Romilly Eveleigh Stock Price Dashboard
            </p>
            <p className='text-xs text-muted-foreground'>
              Data provided by Polygon.io • For educational purposes only
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
