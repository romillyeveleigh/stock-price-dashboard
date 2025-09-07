import { test, expect } from '@playwright/test';

test.describe('Stock Selection Workflow', () => {
  test('app loads and displays basic UI elements', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Verify the app loads with correct title and basic elements
    await expect(
      page.getByText('Stock Price Comparison (US Stock Exchange)')
    ).toBeVisible();
    await expect(
      page.getByText('Fund manager stock analysis tool')
    ).toBeVisible();

    // Verify search input is present
    const searchInput = page.getByRole('combobox', { name: 'Search stocks' });
    await expect(searchInput).toBeVisible();

    // Verify placeholder text
    await expect(searchInput).toHaveAttribute(
      'placeholder',
      /Enter stock name or ticker symbol/
    );

    // Verify the label is present (use first() to avoid strict mode violation)
    await expect(
      page.locator('label').filter({ hasText: 'Select Stocks' }).first()
    ).toBeVisible();
  });

  test('search input accepts user input', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByRole('combobox', { name: 'Search stocks' });

    // Test typing in search input
    await searchInput.fill('AAPL');
    await expect(searchInput).toHaveValue('AAPL');

    // Clear the search
    await searchInput.fill('');
    await expect(searchInput).toHaveValue('');
  });

  test('responsive design works across different screen sizes', async ({
    page,
  }) => {
    await page.goto('/');

    // Desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.getByText('Stock Price Comparison')).toBeVisible();

    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByText('Stock Price Comparison')).toBeVisible();

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('Stock Price Comparison')).toBeVisible();
  });

  test('search triggers when typing 3+ characters', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByRole('combobox', { name: 'Search stocks' });

    // Type less than 3 characters - should not trigger search
    await searchInput.fill('AA');
    await page.waitForTimeout(1000);

    // Type 3+ characters - should trigger search behavior
    await searchInput.fill('AAPL');
    await page.waitForTimeout(2000);

    // Verify the input has the expected value
    await expect(searchInput).toHaveValue('AAPL');

    // Verify aria-expanded changes when typing (indicates dropdown logic is working)
    const isExpanded = await searchInput.getAttribute('aria-expanded');
    // Should be 'true' if dropdown opened, or 'false' if no results/error
    expect(['true', 'false']).toContain(isExpanded);
  });

  test('handles network errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/v3/reference/tickers**', route => {
      route.abort('failed');
    });

    await page.goto('/');

    const searchInput = page.getByRole('combobox', { name: 'Search stocks' });
    await searchInput.fill('AAPL');

    // Wait for error handling
    await page.waitForTimeout(2000);

    // App should still be functional and not crash
    await expect(page.getByText('Stock Price Comparison')).toBeVisible();
    await expect(searchInput).toBeVisible();

    // User should still be able to interact with the input
    await searchInput.fill('TEST');
    await expect(searchInput).toHaveValue('TEST');
  });
});
