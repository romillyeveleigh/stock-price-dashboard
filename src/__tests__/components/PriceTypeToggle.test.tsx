/**
 * Tests for PriceTypeToggle component
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { PriceTypeToggle } from '../../components/PriceTypeToggle';
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

describe('PriceTypeToggle', () => {
  it('renders all price type options', () => {
    render(
      <TestWrapper>
        <PriceTypeToggle />
      </TestWrapper>
    );

    expect(screen.getByText('Price Type')).toBeTruthy();
    expect(screen.getAllByText('Open')).toHaveLength(1);
    expect(screen.getAllByText('High')).toHaveLength(1);
    expect(screen.getAllByText('Low')).toHaveLength(1);
    expect(screen.getAllByText('Close')).toHaveLength(2); // One in radio button, one in summary
  });

  it('has proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <PriceTypeToggle />
      </TestWrapper>
    );

    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toBeTruthy();
    expect(radioGroup.getAttribute('aria-label')).toBe(
      'Select price type for chart display'
    );

    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(4);

    // Check that one radio button is selected by default (Close)
    const selectedRadio = radioButtons.find(
      radio => radio.getAttribute('aria-checked') === 'true'
    );
    expect(selectedRadio).toBeTruthy();
  });

  it('defaults to Close price type', () => {
    render(
      <TestWrapper>
        <PriceTypeToggle />
      </TestWrapper>
    );

    const closeRadio = screen.getByRole('radio', { name: /Close/ });
    expect(closeRadio.getAttribute('aria-checked')).toBe('true');
    expect(screen.getByText('Close', { selector: 'strong' })).toBeTruthy();
  });

  it('can select different price types', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <PriceTypeToggle />
      </TestWrapper>
    );

    const highRadio = screen.getByRole('radio', { name: /High/ });
    await user.click(highRadio);

    expect(highRadio.getAttribute('aria-checked')).toBe('true');
    expect(screen.getByText('High', { selector: 'strong' })).toBeTruthy();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <PriceTypeToggle />
      </TestWrapper>
    );

    const openRadio = screen.getByRole('radio', { name: /Open/ });

    // Focus and activate with Enter key
    openRadio.focus();
    await user.keyboard('{Enter}');

    expect(openRadio.getAttribute('aria-checked')).toBe('true');
    expect(screen.getByText('Open', { selector: 'strong' })).toBeTruthy();
  });

  it('supports space key activation', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <PriceTypeToggle />
      </TestWrapper>
    );

    const lowRadio = screen.getByRole('radio', { name: /Low/ });

    // Focus and activate with Space key
    lowRadio.focus();
    await user.keyboard(' ');

    expect(lowRadio.getAttribute('aria-checked')).toBe('true');
    expect(screen.getByText('Low', { selector: 'strong' })).toBeTruthy();
  });

  it('can be disabled', () => {
    render(
      <TestWrapper>
        <PriceTypeToggle disabled />
      </TestWrapper>
    );

    const radioButtons = screen.getAllByRole('radio');
    radioButtons.forEach(radio => {
      expect(radio.className).toContain('cursor-not-allowed');
      expect(radio.className).toContain('opacity-50');
    });
  });

  it('renders in vertical orientation', () => {
    render(
      <TestWrapper>
        <PriceTypeToggle orientation='vertical' />
      </TestWrapper>
    );

    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup.className).toContain('flex-col');
  });

  it('renders in horizontal orientation by default', () => {
    render(
      <TestWrapper>
        <PriceTypeToggle />
      </TestWrapper>
    );

    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup.className).toContain('flex-wrap');
    expect(radioGroup.className).not.toContain('flex-col');
  });

  it('shows descriptions for each price type', () => {
    render(
      <TestWrapper>
        <PriceTypeToggle />
      </TestWrapper>
    );

    expect(screen.getByText('Opening price at market start')).toBeTruthy();
    expect(screen.getByText('Highest price during trading')).toBeTruthy();
    expect(screen.getByText('Lowest price during trading')).toBeTruthy();
    expect(screen.getByText('Closing price at market end')).toBeTruthy();
  });

  it('has proper ARIA descriptions', () => {
    render(
      <TestWrapper>
        <PriceTypeToggle />
      </TestWrapper>
    );

    const openRadio = screen.getByRole('radio', { name: /Open/ });
    expect(openRadio.getAttribute('aria-describedby')).toBe(
      'price-type-open-desc'
    );

    const highRadio = screen.getByRole('radio', { name: /High/ });
    expect(highRadio.getAttribute('aria-describedby')).toBe(
      'price-type-high-desc'
    );

    const lowRadio = screen.getByRole('radio', { name: /Low/ });
    expect(lowRadio.getAttribute('aria-describedby')).toBe(
      'price-type-low-desc'
    );

    const closeRadio = screen.getByRole('radio', { name: /Close/ });
    expect(closeRadio.getAttribute('aria-describedby')).toBe(
      'price-type-close-desc'
    );
  });
});
