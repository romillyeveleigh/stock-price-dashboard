import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';

import { Layout } from '@/components';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AppProvider } from '@/contexts';
import { useUrlSync } from '@/hooks';

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

// Main app content component
function AppContent() {
  // Initialize URL synchronization
  useUrlSync();

  return <Layout />;
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppProvider>
            <AppContent />
          </AppProvider>

          {/* Development tools */}
          <ReactQueryDevtools initialIsOpen={false} />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
