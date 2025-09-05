/**
 * Tests for SelectedStocks component
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { SelectedStocks } from '../../components/SelectedStocks';
import { AppProvider } from '../../contexts/AppContext';

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

describe('SelectedStocks', () => {
  it('shows empty state when no stocks are selected', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <SelectedStocks />
      </TestWrapper>
    );

    // First remove the default AAPL stock
    const removeButton = screen.getByLabelText(/Remove AAPL.*from selection/);
    await user.click(removeButton);

    // Now should show empty state
    expect(screen.getByText('No stocks selected')).toBeTruthy();
    expect(
      screen.getByText(/Search and select up to.*stocks to get started/)
    ).toBeTruthy();
  });

  it('displays selected stocks with company names', () => {
    render(
      <TestWrapper>
        <SelectedStocks />
      </TestWrapper>
    );

    // The default state includes AAPL
    expect(screen.getByText('AAPL')).toBeTruthy();
    expect(screen.getByText('Apple Inc.')).toBeTruthy();
  });

  it('shows stock count and maximum', () => {
    render(
      <TestWrapper>
        <SelectedStocks />
      </TestWrapper>
    );

    expect(screen.getByText('Selected Stocks')).toBeTruthy();
    expect(screen.getByText('1 of 3')).toBeTruthy();
  });

  it('can hide stock count', () => {
    render(
      <TestWrapper>
        <SelectedStocks showStockCount={false} />
      </TestWrapper>
    );

    expect(screen.queryByText('Selected Stocks')).toBeNull();
    expect(screen.queryByText('1 of 3')).toBeNull();
  });

  it('can hide remove buttons', () => {
    render(
      <TestWrapper>
        <SelectedStocks showRemoveButtons={false} />
      </TestWrapper>
    );

    const removeButtons = screen.queryAllByLabelText(/Remove.*from selection/);
    expect(removeButtons).toHaveLength(0);
  });

  it('shows remove buttons by default', () => {
    render(
      <TestWrapper>
        <SelectedStocks />
      </TestWrapper>
    );

    const removeButtons = screen.getAllByLabelText(/Remove.*from selection/);
    expect(removeButtons.length).toBeGreaterThan(0);
  });

  it('renders in compact variant', () => {
    render(
      <TestWrapper>
        <SelectedStocks variant='compact' />
      </TestWrapper>
    );

    expect(screen.getByText('Selected Stocks')).toBeTruthy();
    expect(screen.getByText('AAPL')).toBeTruthy();
  });

  it('renders in minimal variant', () => {
    render(
      <TestWrapper>
        <SelectedStocks variant='minimal' />
      </TestWrapper>
    );

    expect(screen.getByText('AAPL')).toBeTruthy();
    // Should not show "Selected Stocks" header in minimal variant
    expect(screen.queryByText('Selected Stocks')).toBeNull();
  });

  it('shows position numbers for stocks', () => {
    render(
      <TestWrapper>
        <SelectedStocks />
      </TestWrapper>
    );

    expect(screen.getByText('#1')).toBeTruthy();
  });

  it('shows helpful footer messages', () => {
    render(
      <TestWrapper>
        <SelectedStocks />
      </TestWrapper>
    );

    expect(screen.getByText(/more stocks can be added/)).toBeTruthy();
    expect(screen.getByText('Click × to remove stocks')).toBeTruthy();
  });

  it('supports keyboard navigation for remove buttons', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <SelectedStocks />
      </TestWrapper>
    );

    const removeButton = screen.getByLabelText(/Remove AAPL.*from selection/);

    // Focus and activate with Enter key
    removeButton.focus();
    await user.keyboard('{Enter}');

    // Stock should be removed (empty state should appear)
    expect(screen.getByText('No stocks selected')).toBeTruthy();
  });

  it('supports space key for remove buttons', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <SelectedStocks />
      </TestWrapper>
    );

    const removeButton = screen.getByLabelText(/Remove AAPL.*from selection/);

    // Focus and activate with Space key
    removeButton.focus();
    await user.keyboard(' ');

    // Stock should be removed (empty state should appear)
    expect(screen.getByText('No stocks selected')).toBeTruthy();
  });

  it('can remove stocks by clicking', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <SelectedStocks />
      </TestWrapper>
    );

    const removeButton = screen.getByLabelText(/Remove AAPL.*from selection/);
    await user.click(removeButton);

    // Stock should be removed (empty state should appear)
    expect(screen.getByText('No stocks selected')).toBeTruthy();
  });

  it('has proper accessibility labels', () => {
    render(
      <TestWrapper>
        <SelectedStocks />
      </TestWrapper>
    );

    const removeButton = screen.getByLabelText(
      /Remove AAPL.*Apple Inc.*from selection/
    );
    expect(removeButton).toBeTruthy();
  });

  it('applies custom className', () => {
    render(
      <TestWrapper>
        <SelectedStocks className='custom-class' />
      </TestWrapper>
    );

    // Just check that the component renders without error when className is provided
    expect(screen.getByText('Selected Stocks')).toBeTruthy();
  });
});
