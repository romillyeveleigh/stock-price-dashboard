/**
 * Rate Limit Handler component
 * Provides user-friendly feedback and automatic retry for API rate limits
 */

import { Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface RateLimitHandlerProps {
  className?: string;
  onRetry?: () => void;
  retryAfter?: number; // seconds
  autoRetry?: boolean;
  quotaInfo?: {
    used: number;
    limit: number;
    resetTime: Date;
  };
}

export function RateLimitHandler({
  className = '',
  onRetry,
  retryAfter = 60,
  autoRetry = true,
  quotaInfo,
}: RateLimitHandlerProps) {
  const [timeRemaining, setTimeRemaining] = useState(retryAfter);
  const [isRetrying, setIsRetrying] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;

        // Auto retry when timer reaches 0
        if (newTime <= 0 && autoRetry && onRetry) {
          setIsRetrying(true);
          onRetry();
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, autoRetry, onRetry]);

  const handleManualRetry = () => {
    setIsRetrying(true);
    onRetry?.();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const progressPercentage = ((retryAfter - timeRemaining) / retryAfter) * 100;

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100'>
            <Clock className='h-6 w-6 text-yellow-600' />
          </div>
          <CardTitle className='text-lg'>Rate Limit Reached</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='text-center space-y-2'>
            <p className='text-muted-foreground'>
              Too many requests have been made to the API.
            </p>
            <p className='text-sm text-muted-foreground'>
              Please wait before making more requests.
            </p>
          </div>

          {/* Quota information */}
          {quotaInfo && (
            <div className='rounded-lg bg-yellow-50 p-4 space-y-3'>
              <div className='flex justify-between text-sm'>
                <span className='text-yellow-800 font-medium'>API Usage</span>
                <span className='text-yellow-700'>
                  {quotaInfo.used} / {quotaInfo.limit} calls
                </span>
              </div>
              <Progress
                value={(quotaInfo.used / quotaInfo.limit) * 100}
                className='h-2'
              />
              <p className='text-xs text-yellow-700'>
                Resets at {quotaInfo.resetTime.toLocaleTimeString()}
              </p>
            </div>
          )}

          {/* Countdown timer */}
          {timeRemaining > 0 && (
            <div className='space-y-3'>
              <div className='text-center'>
                <p className='text-sm font-medium'>
                  {autoRetry ? 'Auto-retry in:' : 'Try again in:'}
                </p>
                <p className='text-2xl font-mono font-bold text-primary'>
                  {formatTime(timeRemaining)}
                </p>
              </div>

              <Progress value={progressPercentage} className='h-2' />
            </div>
          )}

          {/* Rate limit info */}
          <div className='rounded-lg bg-muted p-3'>
            <div className='flex items-start gap-2'>
              <AlertTriangle className='h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0' />
              <div className='text-xs text-muted-foreground space-y-1'>
                <p className='font-medium'>API Limits:</p>
                <ul className='space-y-0.5 ml-2'>
                  <li>• 5 calls per minute</li>
                  <li>• Automatic retry after cooldown</li>
                  <li>• Data is cached to reduce requests</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className='space-y-2'>
            {timeRemaining <= 0 && (
              <Button
                onClick={handleManualRetry}
                className='w-full'
                disabled={isRetrying}
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className='mr-2 h-4 w-4' />
                    Try Again Now
                  </>
                )}
              </Button>
            )}

            {timeRemaining > 0 && !autoRetry && (
              <Button
                onClick={handleManualRetry}
                variant='outline'
                className='w-full'
                disabled={isRetrying}
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className='mr-2 h-4 w-4' />
                    Try Anyway
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Help text */}
          <div className='text-center'>
            <p className='text-xs text-muted-foreground'>
              Tip: Use cached data or adjust your date range to reduce API calls
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
