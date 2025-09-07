/**
 * Reusable loading state components
 * Provides skeleton loading states for different parts of the application
 */

import { Loader2, TrendingUp } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { useResponsive } from '@/hooks';

interface LoadingStateProps {
  className?: string;
  message?: string;
}

interface ChartLoadingProps extends LoadingStateProps {
  height?: number;
}

// Generic loading spinner
export function LoadingSpinner({
  className = '',
  message = 'Loading...',
}: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className='flex flex-col items-center gap-3'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <p className='text-sm text-muted-foreground'>{message}</p>
      </div>
    </div>
  );
}

// Chart skeleton loading state
export function ChartLoadingSkeleton({
  className = '',
  height,
}: ChartLoadingProps) {
  const { isMobile, isTablet } = useResponsive();
  const chartHeight = height || isMobile ? 400 : isTablet ? 500 : 600;
  return (
    <div className={`space-y-4 p-6 ${className}`} style={{ height: chartHeight }}>
      

      {/* Chart area skeleton */}
      <div className='relative flex-1 space-y-4'>
        {/* Y-axis labels */}
        <div className='absolute left-0 top-0 flex h-full flex-col justify-between py-4'>
          <Skeleton className='h-3 w-12' />
          <Skeleton className='h-3 w-12' />
          <Skeleton className='h-3 w-12' />
          <Skeleton className='h-3 w-12' />
          <Skeleton className='h-3 w-12' />
        </div>

        {/* Main chart area */}
        <div className='ml-16 space-y-2'>
          <Skeleton className='h-48 w-full' />
          <Skeleton className='h-12 w-full' /> {/* Volume bars */}
        </div>

        {/* X-axis labels */}
        <div className='ml-16 flex justify-between'>
          <Skeleton className='h-3 w-16' />
          <Skeleton className='h-3 w-16' />
          <Skeleton className='h-3 w-16' />
          <Skeleton className='h-3 w-16' />
        </div>
      </div>

      {/* Legend skeleton */}
      <div className='flex justify-center gap-4'>
        <Skeleton className='h-4 w-20' />
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-4 w-18' />
      </div>
    </div>
  );
}

// Search loading state
export function SearchLoadingSkeleton({ className = '' }: LoadingStateProps) {
  return (
    <div className={`space-y-2 p-3 ${className}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className='flex items-center gap-3 p-2'>
          <Skeleton className='h-8 w-8 rounded' />
          <div className='flex-1 space-y-1'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-3 w-32' />
          </div>
        </div>
      ))}
    </div>
  );
}

// Sidebar loading state
export function SidebarLoadingSkeleton({ className = '' }: LoadingStateProps) {
  return (
    <div className={`space-y-6 p-6 ${className}`}>
      {/* Search section */}
      <div className='space-y-3'>
        <Skeleton className='h-5 w-24' />
        <Skeleton className='h-10 w-full' />
      </div>

      {/* Selected stocks section */}
      <div className='space-y-3'>
        <Skeleton className='h-5 w-32' />
        <div className='space-y-2'>
          <Skeleton className='h-8 w-full' />
          <Skeleton className='h-8 w-full' />
        </div>
      </div>

      {/* Date range section */}
      <div className='space-y-3'>
        <Skeleton className='h-5 w-24' />
        <div className='grid grid-cols-2 gap-2'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
        </div>
      </div>

      {/* Price type section */}
      <div className='space-y-3'>
        <Skeleton className='h-5 w-20' />
        <div className='grid grid-cols-2 gap-2'>
          <Skeleton className='h-8 w-full' />
          <Skeleton className='h-8 w-full' />
        </div>
      </div>
    </div>
  );
}

// Data loading with progress indicator
export function DataLoadingProgress({
  className = '',
  message = 'Loading stock data...',
  progress,
  stocks = [],
}: LoadingStateProps & {
  progress?: number;
  stocks?: string[];
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <div className='flex items-center gap-3'>
        <TrendingUp className='h-6 w-6 text-primary' />
        <div className='space-y-1'>
          <p className='font-medium'>{message}</p>
          {stocks.length > 0 && (
            <p className='text-sm text-muted-foreground'>
              Fetching data for: {stocks.join(', ')}
            </p>
          )}
        </div>
      </div>

      {progress !== undefined && (
        <div className='w-64 space-y-2'>
          <div className='flex justify-between text-xs text-muted-foreground'>
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className='h-2 w-full rounded-full bg-muted'>
            <div
              className='h-2 rounded-full bg-primary transition-all duration-300'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className='flex gap-1'>
        <div className='h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]' />
        <div className='h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]' />
        <div className='h-2 w-2 animate-bounce rounded-full bg-primary' />
      </div>
    </div>
  );
}
