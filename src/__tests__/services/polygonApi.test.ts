/**
 * Tests for Polygon API service
 */

import { PolygonApiService } from '../../services/polygonApi';

// Mock fetch globally
global.fetch = jest.fn();

describe('PolygonApiService', () => {
  let apiService: PolygonApiService;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    // Reset mocks
    mockFetch.mockReset();

    // Mock environment variable
    process.env.VITE_POLYGON_API_KEY = 'test-api-key';

    apiService = new PolygonApiService();
  });

  afterEach(() => {
    // Clean up
    apiService.clearQueue();
  });

  describe('constructor', () => {
    it('should initialize with API key', () => {
      expect(apiService).toBeInstanceOf(PolygonApiService);
    });

    it('should handle missing API key', () => {
      const originalEnv = process.env.VITE_POLYGON_API_KEY;
      delete process.env.VITE_POLYGON_API_KEY;

      try {
        // The service should still initialize but will fail on API calls
        const service = new PolygonApiService();
        expect(service).toBeInstanceOf(PolygonApiService);
      } finally {
        // Restore the original value
        if (originalEnv) {
          process.env.VITE_POLYGON_API_KEY = originalEnv;
        }
      }
    });
  });

  describe('getAllTickers', () => {
    it('should fetch and transform ticker data', async () => {
      const mockResponse = {
        status: 'OK',
        results: [
          {
            ticker: 'AAPL',
            name: 'Apple Inc.',
            market: 'stocks',
            locale: 'us',
            active: true,
            type: 'CS',
            primary_exchange: 'NASDAQ',
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiService.getAllTickers();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        ticker: 'AAPL',
        name: 'Apple Inc.',
        symbol: 'AAPL',
        market: 'stocks',
        locale: 'us',
        active: true,
        type: 'CS',
      });
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: async () => ({ error: 'Rate limit exceeded' }),
      } as Response);

      await expect(apiService.getAllTickers()).rejects.toMatchObject({
        type: 'API_ERROR',
      });
    });
  });

  describe('getStockPrices', () => {
    it('should fetch and transform stock price data', async () => {
      const mockResponse = {
        status: 'OK',
        ticker: 'AAPL',
        results: [
          {
            t: 1640995200000, // 2022-01-01
            o: 100,
            h: 105,
            l: 95,
            c: 102,
            v: 1000000,
            vw: 101,
            n: 1000,
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const from = new Date('2022-01-01');
      const to = new Date('2022-01-02');

      const result = await apiService.getStockPrices('AAPL', from, to);

      expect(result.symbol).toBe('AAPL');
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({
        date: '2022-01-01',
        open: 100,
        high: 105,
        low: 95,
        close: 102,
        volume: 1000000,
      });
    });

    it('should return empty data for no results', async () => {
      const mockResponse = {
        status: 'OK',
        ticker: 'AAPL',
        results: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const from = new Date('2022-01-01');
      const to = new Date('2022-01-02');

      const result = await apiService.getStockPrices('AAPL', from, to);

      expect(result.symbol).toBe('AAPL');
      expect(result.data).toHaveLength(0);
    });
  });

  describe('rate limiting', () => {
    it('should provide rate limit status', () => {
      const status = apiService.getRateLimitStatus();

      expect(status).toHaveProperty('requestsInWindow');
      expect(status).toHaveProperty('maxRequests');
      expect(status).toHaveProperty('queueLength');
      expect(status).toHaveProperty('canMakeRequest');
    });

    it('should provide queue statistics', () => {
      const stats = apiService.getQueueStats();

      expect(stats).toHaveProperty('totalQueued');
      expect(stats).toHaveProperty('averageWaitTime');
      expect(stats).toHaveProperty('oldestRequestAge');
    });
  });
});
