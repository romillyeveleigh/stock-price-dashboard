import { render, screen } from '@testing-library/react';

import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Stock Price Comparison (US Stock Exchange)')).toBeTruthy();
  });

  it('displays the fund manager view indicator', () => {
    render(<App />);
    expect(screen.getByText('Fund manager stock analysis tool')).toBeTruthy();
  });

  it('shows the professional dashboard title', () => {
    render(<App />);
    expect(
      screen.getByText('Stock Price Comparison (US Stock Exchange)')
    ).toBeTruthy();
  });
});
