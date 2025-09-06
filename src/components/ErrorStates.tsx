/**
 * Reusable error state components
 * Provides comprehensive error handling with user-friendly messages and recovery actions
 */

import {
  AlertTriangle,
  Wifi,
  Clock,
  RefreshCw,
  AlertCircle,
  XCircle,
  Shield,
  TrendingDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorStateProps {
  className?: string;
  onRetry?: () => void;
  onReset?: () => void;
}

interface ApiErrorProps extends ErrorStateProps {
  error: Error | string;
  context?: string;
}

// Generic error state
export function GenericError({
  className = '',
  onRetry,
  error = 'Something went wrong',
}: ApiErrorProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10'>
            <AlertCircle className='h-6 w-6 text-destructive' />
          </div>
          <CardTitle className='text-lg'>Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 text-center'>
          <p className='text-sm text-muted-foreground'>{errorMessage}</p>
          {onRetry && (
            <Button onClick={onRetry} className='w-full'>
              <RefreshCw className='mr-2 h-4 w-4' />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Network/API error state
export function NetworkError({
  className = '',
  onRetry,
  error = 'Network connection failed',
}: ApiErrorProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100'>
            <Wifi className='h-6 w-6 text-orange-600' />
          </div>
          <CardTitle className='text-lg'>Connection Problem</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 text-center'>
          <p className='text-sm text-muted-foreground'>{errorMessage}</p>
          <div className='space-y-2'>
            <p className='text-xs text-muted-foreground'>
              Please check your internet connection and try again.
            </p>
            {onRetry && (
              <Button onClick={onRetry} className='w-full'>
                <RefreshCw className='mr-2 h-4 w-4' />
                Retry Connection
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Rate limit error state
export function RateLimitError({
  className = '',
  onRetry,
  retryAfter = 60,
}: ErrorStateProps & { retryAfter?: number }) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100'>
            <Clock className='h-6 w-6 text-yellow-600' />
          </div>
          <CardTitle className='text-lg'>Rate Limit Reached</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 text-center'>
          <p className='text-sm text-muted-foreground'>
            Too many requests have been made. Please wait before trying again.
          </p>
          <div className='rounded-lg bg-yellow-50 p-3'>
            <p className='text-xs text-yellow-800'>
              API limit: 5 calls per minute. Please wait {retryAfter} seconds.
            </p>
          </div>
          {onRetry && (
            <Button onClick={onRetry} variant='outline' className='w-full'>
              <Clock className='mr-2 h-4 w-4' />
              Try Again Later
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// API key error state
export function ApiKeyError({ className = '', onReset }: ErrorStateProps) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
            <Shield className='h-6 w-6 text-red-600' />
          </div>
          <CardTitle className='text-lg'>API Configuration Error</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 text-center'>
          <p className='text-sm text-muted-foreground'>
            The API key is missing or invalid. Please check your configuration.
          </p>
          <div className='rounded-lg bg-red-50 p-3 text-left'>
            <p className='text-xs text-red-800 font-medium mb-1'>
              Required Environment Variable:
            </p>
            <code className='text-xs text-red-700 bg-red-100 px-1 py-0.5 rounded'>
              VITE_POLYGON_API_KEY
            </code>
          </div>
          {onReset && (
            <Button onClick={onReset} variant='outline' className='w-full'>
              <RefreshCw className='mr-2 h-4 w-4' />
              Reload Application
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Chart error state (inline)
export function ChartError({
  className = '',
  onRetry,
  error = 'Failed to load chart data',
  height = 400,
}: ApiErrorProps & { height?: number }) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ height }}
    >
      <div className='flex flex-col items-center gap-4 text-center max-w-sm'>
        <div className='rounded-full bg-destructive/10 p-3'>
          <TrendingDown className='h-8 w-8 text-destructive' />
        </div>
        <div className='space-y-2'>
          <h3 className='font-semibold text-foreground'>Chart Error</h3>
          <p className='text-sm text-muted-foreground'>{errorMessage}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} size='sm'>
            <RefreshCw className='mr-2 h-4 w-4' />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}

// Search error state (inline)
export function SearchError({
  className = '',
  onRetry,
  error = 'Failed to load stock data',
}: ApiErrorProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className={`flex items-center gap-3 p-4 text-sm ${className}`}>
      <AlertTriangle className='h-4 w-4 text-destructive flex-shrink-0' />
      <div className='flex-1'>
        <p className='text-destructive font-medium'>Search Error</p>
        <p className='text-muted-foreground'>{errorMessage}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} size='sm' variant='outline'>
          <RefreshCw className='h-3 w-3' />
        </Button>
      )}
    </div>
  );
}

// Validation error state
export function ValidationError({
  className = '',
  error = 'Invalid input',
  field,
}: ApiErrorProps & { field?: string }) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div
      className={`flex items-center gap-2 text-sm text-destructive ${className}`}
    >
      <XCircle className='h-4 w-4 flex-shrink-0' />
      <span>
        {field && `${field}: `}
        {errorMessage}
      </span>
    </div>
  );
}
