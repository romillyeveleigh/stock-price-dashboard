import { render, screen } from '@testing-library/react';

import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Stock Price Dashboard')).toBeTruthy();
  });

  it('displays the fund manager view indicator', () => {
    render(<App />);
    expect(screen.getByText('Fund Manager View')).toBeTruthy();
  });

  it('shows the professional dashboard title', () => {
    render(<App />);
    expect(
      screen.getByText('Professional Stock Price Analysis Dashboard')
    ).toBeTruthy();
  });
});
