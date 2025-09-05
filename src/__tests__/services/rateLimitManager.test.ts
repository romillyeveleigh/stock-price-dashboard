/**
 * Tests for Rate Limit Manager
 */

import { RateLimitManager } from '../../services/rateLimitManager';

describe('RateLimitManager', () => {
  let rateLimitManager: RateLimitManager;

  beforeEach(() => {
    rateLimitManager = new RateLimitManager({
      maxRequests: 2,
      windowMs: 1000, // 1 second for testing
    });
  });

  afterEach(() => {
    rateLimitManager.clearQueue();
  });

  describe('execute', () => {
    it('should execute requests within rate limits', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');

      const result = await rateLimitManager.execute(mockFn);

      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should queue requests when rate limit is exceeded', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');

      // Execute multiple requests quickly
      const promises = [
        rateLimitManager.execute(mockFn),
        rateLimitManager.execute(mockFn),
        rateLimitManager.execute(mockFn), // This should be queued
      ];

      const results = await Promise.all(promises);

      expect(results).toEqual(['success', 'success', 'success']);
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('should handle request failures', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('API Error'));

      await expect(rateLimitManager.execute(mockFn)).rejects.toThrow(
        'API Error'
      );
    });
  });

  describe('getStatus', () => {
    it('should return current rate limit status', () => {
      const status = rateLimitManager.getStatus();

      expect(status).toHaveProperty('requestsInWindow');
      expect(status).toHaveProperty('maxRequests');
      expect(status).toHaveProperty('queueLength');
      expect(status).toHaveProperty('canMakeRequest');
      expect(status).toHaveProperty('nextAvailableTime');

      expect(status.maxRequests).toBe(2);
      expect(status.requestsInWindow).toBe(0);
      expect(status.canMakeRequest).toBe(true);
    });
  });

  describe('getQueueStats', () => {
    it('should return queue statistics', () => {
      const stats = rateLimitManager.getQueueStats();

      expect(stats).toHaveProperty('totalQueued');
      expect(stats).toHaveProperty('averageWaitTime');
      expect(stats).toHaveProperty('oldestRequestAge');

      expect(stats.totalQueued).toBe(0);
    });
  });

  describe('clearQueue', () => {
    it('should clear the queue', () => {
      // Clear the queue should not throw
      expect(() => rateLimitManager.clearQueue()).not.toThrow();

      // Queue should be empty after clearing
      expect(rateLimitManager.getQueueStats().totalQueued).toBe(0);
    });
  });
});
