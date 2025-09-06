/**
 * Error Boundary component for catching and handling React errors
 * Provides graceful error handling with recovery options
 */

import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to external service
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className='min-h-screen flex items-center justify-center p-4 bg-background'>
          <Card className='w-full max-w-lg'>
            <CardHeader className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10'>
                <AlertTriangle className='h-8 w-8 text-destructive' />
              </div>
              <CardTitle className='text-xl'>Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='text-center space-y-2'>
                <p className='text-muted-foreground'>
                  An unexpected error occurred while loading the application.
                </p>
                <p className='text-sm text-muted-foreground'>
                  This error has been logged and we&apos;ll work to fix it.
                </p>
              </div>

              {/* Error details (development only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className='rounded-lg bg-muted p-4'>
                  <summary className='cursor-pointer text-sm font-medium mb-2 flex items-center gap-2'>
                    <Bug className='h-4 w-4' />
                    Error Details (Development)
                  </summary>
                  <div className='space-y-2 text-xs font-mono'>
                    <div>
                      <strong>Error:</strong>
                      <pre className='mt-1 whitespace-pre-wrap text-destructive'>
                        {this.state.error.message}
                      </pre>
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className='mt-1 whitespace-pre-wrap text-muted-foreground text-xs overflow-auto max-h-32'>
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className='mt-1 whitespace-pre-wrap text-muted-foreground text-xs overflow-auto max-h-32'>
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Recovery actions */}
              <div className='space-y-3'>
                <Button onClick={this.handleRetry} className='w-full'>
                  <RefreshCw className='mr-2 h-4 w-4' />
                  Try Again
                </Button>

                <div className='grid grid-cols-2 gap-2'>
                  <Button onClick={this.handleGoHome} variant='outline'>
                    <Home className='mr-2 h-4 w-4' />
                    Go Home
                  </Button>
                  <Button onClick={this.handleReload} variant='outline'>
                    <RefreshCw className='mr-2 h-4 w-4' />
                    Reload Page
                  </Button>
                </div>
              </div>

              {/* Help text */}
              <div className='text-center'>
                <p className='text-xs text-muted-foreground'>
                  If the problem persists, try refreshing the page or clearing
                  your browser cache.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by error handler:', error, errorInfo);
    // Could integrate with error reporting service here
  };
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
