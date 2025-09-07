/**
 * Tests for SelectedStocks component
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { SelectedStocks } from '../../components/SelectedStocks';
import { AppProvider, useAppContext } from '../../contexts/AppContext';

// Test wrapper with providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProvider>{children}</AppProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

// Helper component that adds a stock and renders SelectedStocks
function SelectedStocksWithStock() {
  const { addStock } = useAppContext();

  React.useEffect(() => {
    addStock({ symbol: 'AAPL', name: 'Apple Inc.' });
  }, []);

  return <SelectedStocks />;
}

describe('SelectedStocks', () => {
  it('renders empty when no stocks are selected', () => {
    render(
      <TestWrapper>
        <SelectedStocks />
      </TestWrapper>
    );

    // Should render a div with no children when empty
    const container = document.querySelector('.flex.flex-wrap.gap-1');
    expect(container).toBeTruthy();
    expect(container?.children).toHaveLength(0);
  });

  it('displays selected stocks with company names', () => {
    render(
      <TestWrapper>
        <SelectedStocksWithStock />
      </TestWrapper>
    );

    // Should show AAPL badge with company name
    expect(screen.getByText(/AAPL.*-.*Apple Inc\./)).toBeTruthy();
  });

  it('can hide remove buttons', () => {
    function SelectedStocksWithStockNoButtons() {
      const { addStock } = useAppContext();

      React.useEffect(() => {
        addStock({ symbol: 'AAPL', name: 'Apple Inc.' });
      }, []);

      return <SelectedStocks showRemoveButtons={false} />;
    }

    render(
      <TestWrapper>
        <SelectedStocksWithStockNoButtons />
      </TestWrapper>
    );

    const removeButtons = screen.queryAllByLabelText(/Remove.*from selection/);
    expect(removeButtons).toHaveLength(0);
  });

  it('can remove stocks by clicking', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <SelectedStocksWithStock />
      </TestWrapper>
    );

    const removeButton = screen.getByLabelText(/Remove AAPL.*from selection/);
    await user.click(removeButton);

    // Stock should be removed - no more AAPL text
    expect(screen.queryByText(/AAPL/)).toBeNull();
  });

  it('applies custom className', () => {
    render(
      <TestWrapper>
        <SelectedStocks className='custom-class' />
      </TestWrapper>
    );

    // Check that custom class is applied
    const container = document.querySelector('.custom-class');
    expect(container).toBeTruthy();
  });
});
