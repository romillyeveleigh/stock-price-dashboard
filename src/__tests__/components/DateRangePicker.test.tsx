/**
 * Tests for DateRangePicker component
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { DateRangePicker } from '../../components/DateRangePicker';
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

describe('DateRangePicker', () => {
  it('renders date inputs with correct labels', () => {
    render(
      <TestWrapper>
        <DateRangePicker />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Select start date')).toBeTruthy();
    expect(screen.getByLabelText('Select end date')).toBeTruthy();
    expect(screen.getByText('From Date')).toBeTruthy();
    expect(screen.getByText('To Date')).toBeTruthy();
  });

  it('renders quick preset buttons', () => {
    render(
      <TestWrapper>
        <DateRangePicker />
      </TestWrapper>
    );

    expect(screen.getByText('Quick Presets')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /Select 1M date range/ })
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /Select 3M date range/ })
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /Select 6M date range/ })
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /Select YTD date range/ })
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: /Select 1Y date range/ })
    ).toBeTruthy();
  });

  it('shows selected date range', () => {
    render(
      <TestWrapper>
        <DateRangePicker />
      </TestWrapper>
    );

    // Should show the selected range text
    expect(screen.getByText(/Selected range:/)).toBeTruthy();
  });

  it('can be disabled', () => {
    render(
      <TestWrapper>
        <DateRangePicker disabled />
      </TestWrapper>
    );

    const fromInput = screen.getByLabelText('Select start date');
    const toInput = screen.getByLabelText('Select end date');

    expect(fromInput.hasAttribute('disabled')).toBe(true);
    expect(toInput.hasAttribute('disabled')).toBe(true);
  });

  it('applies preset when clicked', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <DateRangePicker />
      </TestWrapper>
    );

    const preset1M = screen.getByRole('button', {
      name: /Select 1M date range/,
    });
    await user.click(preset1M);

    // The 1M button should now be selected (default variant)
    expect(preset1M.className).toContain('bg-primary');
  });

  it('validates date inputs', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <DateRangePicker />
      </TestWrapper>
    );

    const fromInput = screen.getByLabelText('Select start date');
    const toInput = screen.getByLabelText('Select end date');

    // Set invalid range (from date after to date)
    await user.clear(fromInput);
    await user.type(fromInput, '2024-12-31');

    await user.clear(toInput);
    await user.type(toInput, '2024-01-01');

    // Should show validation error
    expect(screen.getByText(/Start date must be before end date/)).toBeTruthy();
  });

  it('shows current date warning when today is selected', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <DateRangePicker />
      </TestWrapper>
    );

    const toInput = screen.getByLabelText('Select end date');
    const today = new Date().toISOString().split('T')[0];

    // Set to date to today
    await user.clear(toInput);
    await user.type(toInput, today);

    // Should show warning about incomplete data
    expect(screen.getByText(/Today's data may be incomplete/)).toBeTruthy();
  });

  it('has proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <DateRangePicker />
      </TestWrapper>
    );

    const fromInput = screen.getByLabelText('Select start date');
    const toInput = screen.getByLabelText('Select end date');

    expect(fromInput.getAttribute('aria-describedby')).toBe('date-range-help');
    expect(toInput.getAttribute('aria-describedby')).toBe('date-range-help');
    expect(screen.getByText(/Selected range:/).getAttribute('id')).toBe(
      'date-range-help'
    );
  });
});
