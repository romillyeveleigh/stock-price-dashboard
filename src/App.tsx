import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import './App.css';

// Create a client with conservative caching for production stability
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
        <div className='min-h-screen bg-gray-50'>
          <header className='bg-white shadow-sm border-b'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
              <div className='flex justify-between items-center py-4'>
                <h1 className='text-2xl font-semibold text-gray-900'>
                  Stock Price Dashboard
                </h1>
                <div className='text-sm text-gray-500'>Fund Manager View</div>
              </div>
            </div>
          </header>

          <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='text-center'>
              <h2 className='text-lg font-medium text-gray-900 mb-4'>
                Professional Stock Price Analysis Dashboard
              </h2>
              <p className='text-gray-600'>
                Ready for implementation with TanStack Query, TypeScript, and
                professional architecture
              </p>
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
