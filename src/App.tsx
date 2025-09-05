import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: unknown) => {
        // Don't retry on rate limit errors
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('429')) return false;
        if (errorMessage.includes('403')) return false;
        return failureCount < 2;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className='min-h-screen bg-background'>
          <header className='border-b bg-card'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <div className='flex items-center justify-between py-4'>
                <h1 className='text-2xl font-semibold text-foreground'>
                  Stock Price Dashboard
                </h1>
                <div className='text-sm text-muted-foreground'>
                  Fund Manager View
                </div>
              </div>
            </div>
          </header>

          <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
            <div className='flex flex-col items-center space-y-8'>
              <Card className='w-full max-w-2xl'>
                <CardHeader className='text-center'>
                  <CardTitle className='text-3xl'>
                    Professional Stock Price Analysis Dashboard
                  </CardTitle>
                  <CardDescription className='text-lg'>
                    Ready for implementation with TanStack Query, TypeScript,
                    Shadcn/ui, and professional architecture
                  </CardDescription>
                </CardHeader>
                <CardContent className='text-center'>
                  <div className='space-y-4'>
                    <p className='text-muted-foreground'>
                      Built with modern tools for fund managers and financial
                      professionals
                    </p>
                    <div className='flex justify-center space-x-4'>
                      <Button>Get Started</Button>
                      <Button variant='outline'>Learn More</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className='grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Real-time Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground'>
                      Live stock prices and market data integration
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Professional UI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground'>
                      Bloomberg-inspired interface with modern design
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>
                      Advanced Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-muted-foreground'>
                      Interactive charts and technical indicators
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>

        {/* Development tools */}
        <ReactQueryDevtools initialIsOpen={false} />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
