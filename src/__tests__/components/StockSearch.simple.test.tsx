/**
 * Simple tests for StockSearch component (without jest-dom matchers)
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { StockSearch } from '../../components/StockSearch';
import { AppProvider } from '../../contexts/AppContext';
import * as hooks from '../../hooks';

// Mock the hooks
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useTickerSearch: jest.fn(),
  useDebounce: jest.fn(),
}));

const mockUseTickerSearch = hooks.useTickerSearch as jest.MockedFunction<
  typeof hooks.useTickerSearch
>;
const mockUseDebounce = hooks.useDebounce as jest.MockedFunction<
  typeof hooks.useDebounce
>;

// Mock data
const mockTickers = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    market: 'stocks' as const,
    locale: 'us' as const,
    active: true,
    type: 'CS',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    market: 'stocks' as const,
    locale: 'us' as const,
    active: true,
    type: 'CS',
  },
];

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

describe('StockSearch', () => {
  beforeEach(() => {
    // Reset mocks
    mockUseTickerSearch.mockReturnValue({
      data: mockTickers,
      isLoading: false,
      error: null,
    } as ReturnType<typeof hooks.useTickerSearch>);

    // Mock debounce to return the value immediately
    mockUseDebounce.mockImplementation(value => value);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input', () => {
    render(
      <TestWrapper>
        <StockSearch />
      </TestWrapper>
    );

    const input = screen.getByRole('combobox');
    expect(input).toBeTruthy();
    expect(input.getAttribute('aria-label')).toBe('Search stocks');
  });

  it('renders with custom placeholder', () => {
    const customPlaceholder = 'Custom search placeholder';

    render(
      <TestWrapper>
        <StockSearch placeholder={customPlaceholder} />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText(customPlaceholder);
    expect(input).toBeTruthy();
  });

  it('can be disabled', () => {
    render(
      <TestWrapper>
        <StockSearch disabled />
      </TestWrapper>
    );

    const input = screen.getByRole('combobox');
    expect(input.hasAttribute('disabled')).toBe(true);
  });

  it('shows loading state when tickers are loading', () => {
    mockUseAllTickers.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    } as unknown as ReturnType<typeof hooks.useAllTickers>);

    render(
      <TestWrapper>
        <StockSearch />
      </TestWrapper>
    );

    // Should show loading spinner
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
  });

  it('handles error state', () => {
    mockUseAllTickers.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error('Failed to load'),
    } as unknown as ReturnType<typeof hooks.useAllTickers>);

    render(
      <TestWrapper>
        <StockSearch />
      </TestWrapper>
    );

    // Component should render without crashing
    const input = screen.getByRole('combobox');
    expect(input).toBeTruthy();
  });
});
