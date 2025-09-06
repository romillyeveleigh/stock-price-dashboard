/**
 * Application-wide loading state
 * Displays during initial app load and critical operations
 */

import { TrendingUp, BarChart3, Search, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Progress } from '@/components/ui/progress';

interface AppLoadingStateProps {
  className?: string;
  message?: string;
  showProgress?: boolean;
  steps?: string[];
}

export function AppLoadingState({
  className = '',
  message = 'Loading Stock Price Dashboard...',
  showProgress = true,
  steps = [
    'Initializing application...',
    'Loading stock data...',
    'Setting up charts...',
    'Preparing interface...',
  ],
}: AppLoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!showProgress) return;

    const stepDuration = 800; // ms per step
    const progressInterval = 50; // ms between progress updates

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress =
          prev + 100 / steps.length / (stepDuration / progressInterval);

        // Update current step based on progress
        const newStep = Math.floor((newProgress / 100) * steps.length);
        if (newStep !== currentStep && newStep < steps.length) {
          setCurrentStep(newStep);
        }

        return Math.min(newProgress, 95); // Stop at 95% to avoid completing before actual load
      });
    }, progressInterval);

    return () => clearInterval(timer);
  }, [showProgress, steps.length, currentStep]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-background ${className}`}
    >
      <div className='w-full max-w-md space-y-8 p-8'>
        {/* Logo/Icon */}
        <div className='text-center'>
          <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10'>
            <TrendingUp className='h-10 w-10 text-primary' />
          </div>
          <h1 className='text-2xl font-bold text-foreground'>
            Stock Price Dashboard
          </h1>
          <p className='text-muted-foreground mt-2'>
            Professional stock analysis tool
          </p>
        </div>

        {/* Loading message */}
        <div className='text-center'>
          <p className='text-lg font-medium text-foreground mb-2'>{message}</p>
          {showProgress && currentStep < steps.length && (
            <p className='text-sm text-muted-foreground'>
              {steps[currentStep]}
            </p>
          )}
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className='space-y-3'>
            <Progress value={progress} className='h-2' />
            <div className='flex justify-between text-xs text-muted-foreground'>
              <span>Loading...</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        {/* Feature icons */}
        <div className='grid grid-cols-3 gap-4 pt-4'>
          <div className='text-center space-y-2'>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100'>
              <Search className='h-6 w-6 text-blue-600' />
            </div>
            <p className='text-xs text-muted-foreground'>Stock Search</p>
          </div>
          <div className='text-center space-y-2'>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100'>
              <BarChart3 className='h-6 w-6 text-green-600' />
            </div>
            <p className='text-xs text-muted-foreground'>Price Charts</p>
          </div>
          <div className='text-center space-y-2'>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100'>
              <Calendar className='h-6 w-6 text-purple-600' />
            </div>
            <p className='text-xs text-muted-foreground'>Date Analysis</p>
          </div>
        </div>

        {/* Loading dots */}
        <div className='flex justify-center gap-1'>
          <div className='h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]' />
          <div className='h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]' />
          <div className='h-2 w-2 animate-bounce rounded-full bg-primary' />
        </div>

        {/* Footer */}
        <div className='text-center'>
          <p className='text-xs text-muted-foreground'>
            Powered by Polygon.io API
          </p>
        </div>
      </div>
    </div>
  );
}

// Minimal loading spinner for quick operations
export function QuickLoadingSpinner({
  className = '',
  size = 'md',
  message,
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizeClasses[size]}`}
      />
      {message && (
        <span className='text-sm text-muted-foreground'>{message}</span>
      )}
    </div>
  );
}
