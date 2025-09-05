/**
 * Tests for AppContext and state management
 */

import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { AppProvider, useAppContext } from '../../contexts/AppContext';

// Test component that uses the context
function TestComponent() {
  const { state, addStock, removeStock, setPriceType, resetState } =
    useAppContext();

  return (
    <div>
      <div data-testid='selected-stocks'>
        {state.selectedStocks.map(stock => (
          <span key={stock.symbol}>{stock.symbol}</span>
        ))}
      </div>
      <div data-testid='stock-count'>{state.selectedStocks.length}</div>
      <div data-testid='price-type'>{state.priceType}</div>
      <div data-testid='error'>{state.error || 'no-error'}</div>

      <button
        onClick={() =>
          addStock({ symbol: 'MSFT', name: 'Microsoft Corporation' })
        }
        data-testid='add-stock'
      >
        Add MSFT
      </button>

      <button onClick={() => removeStock('AAPL')} data-testid='remove-stock'>
        Remove AAPL
      </button>

      <button onClick={() => setPriceType('high')} data-testid='set-price-type'>
        Set High Price
      </button>

      <button onClick={() => resetState()} data-testid='reset-state'>
        Reset
      </button>
    </div>
  );
}

// Wrapper component with providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <AppProvider>{children}</AppProvider>
    </BrowserRouter>
  );
}

describe('AppContext', () => {
  it('should provide initial state with default stock', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('selected-stocks').textContent).toContain('AAPL');
    expect(screen.getByTestId('stock-count').textContent).toBe('1');
    expect(screen.getByTestId('price-type').textContent).toBe('close');
    expect(screen.getByTestId('error').textContent).toBe('no-error');
  });

  it('should add stocks correctly', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    act(() => {
      screen.getByTestId('add-stock').click();
    });

    expect(screen.getByTestId('selected-stocks').textContent).toContain('AAPL');
    expect(screen.getByTestId('selected-stocks').textContent).toContain('MSFT');
    expect(screen.getByTestId('stock-count').textContent).toBe('2');
  });

  it('should remove stocks correctly', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    act(() => {
      screen.getByTestId('remove-stock').click();
    });

    expect(screen.getByTestId('selected-stocks').textContent).not.toContain(
      'AAPL'
    );
    expect(screen.getByTestId('stock-count').textContent).toBe('0');
  });

  it('should prevent duplicate stocks', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Try to add AAPL again (it's already in initial state)
    act(() => {
      screen.getByTestId('add-stock').click(); // This adds MSFT
    });

    // Now try to add MSFT again
    act(() => {
      screen.getByTestId('add-stock').click();
    });

    expect(screen.getByTestId('stock-count').textContent).toBe('2'); // Should still be 2
    expect(screen.getByTestId('error').textContent).toBe(
      'MSFT is already selected'
    );
  });

  it('should update price type', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    act(() => {
      screen.getByTestId('set-price-type').click();
    });

    expect(screen.getByTestId('price-type').textContent).toBe('high');
  });

  it('should reset state correctly', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Make some changes first
    act(() => {
      screen.getByTestId('add-stock').click();
      screen.getByTestId('set-price-type').click();
    });

    expect(screen.getByTestId('stock-count').textContent).toBe('2');
    expect(screen.getByTestId('price-type').textContent).toBe('high');

    // Reset state
    act(() => {
      screen.getByTestId('reset-state').click();
    });

    expect(screen.getByTestId('stock-count').textContent).toBe('1'); // Back to default AAPL
    expect(screen.getByTestId('price-type').textContent).toBe('close');
    expect(screen.getByTestId('selected-stocks').textContent).toContain('AAPL');
  });
});
