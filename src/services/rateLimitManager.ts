/**
 * Rate limit manager to prevent API crashes
 * CRITICAL: Enforces 5 calls/minute constraint with intelligent request queuing
 */

import type { RateLimitConfig } from '@/types';

interface QueuedRequest {
  id: string;
  execute: () => Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
  timestamp: number;
}

export class RateLimitManager {
  private requests: number[] = [];
  private queue: QueuedRequest[] = [];
  private processing = false;
  private requestCounter = 0;

  constructor(private config: RateLimitConfig) {}

  /**
   * Executes a request with rate limiting
   */
  async execute<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const requestId = `req_${++this.requestCounter}_${Date.now()}`;

      const queuedRequest: QueuedRequest = {
        id: requestId,
        execute: requestFn,
        resolve: resolve as (value: unknown) => void,
        reject,
        timestamp: Date.now(),
      };

      this.queue.push(queuedRequest);
      this.processQueue();
    });
  }

  /**
   * Processes the request queue with rate limiting
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      // Clean up old requests from tracking
      this.cleanupOldRequests();

      // Check if we can make a request
      if (this.canMakeRequest()) {
        const request = this.queue.shift();
        if (!request) break;

        try {
          // Record the request timestamp
          this.requests.push(Date.now());

          // Execute the request
          const result = await request.execute();
          request.resolve(result);
        } catch (error) {
          request.reject(error as Error);
        }
      } else {
        // Wait before checking again
        const waitTime = this.getWaitTime();
        await this.sleep(waitTime);
      }
    }

    this.processing = false;
  }

  /**
   * Checks if we can make a request within rate limits
   */
  private canMakeRequest(): boolean {
    return this.requests.length < this.config.maxRequests;
  }

  /**
   * Calculates how long to wait before the next request
   */
  private getWaitTime(): number {
    if (this.requests.length === 0) {
      return 0;
    }

    const oldestRequest = Math.min(...this.requests);
    const timeSinceOldest = Date.now() - oldestRequest;
    const timeToWait = this.config.windowMs - timeSinceOldest;

    return Math.max(timeToWait, 1000); // Minimum 1 second wait
  }

  /**
   * Removes old requests from tracking
   */
  private cleanupOldRequests(): void {
    const cutoff = Date.now() - this.config.windowMs;
    this.requests = this.requests.filter(timestamp => timestamp > cutoff);
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Gets current rate limit status
   */
  getStatus(): {
    requestsInWindow: number;
    maxRequests: number;
    queueLength: number;
    canMakeRequest: boolean;
    nextAvailableTime: number;
  } {
    this.cleanupOldRequests();

    return {
      requestsInWindow: this.requests.length,
      maxRequests: this.config.maxRequests,
      queueLength: this.queue.length,
      canMakeRequest: this.canMakeRequest(),
      nextAvailableTime:
        this.requests.length > 0
          ? Math.min(...this.requests) + this.config.windowMs
          : Date.now(),
    };
  }

  /**
   * Clears the queue (useful for cleanup)
   */
  clearQueue(): void {
    // Reject all queued requests
    this.queue.forEach(request => {
      request.reject(new Error('Request queue cleared'));
    });

    this.queue = [];
    this.processing = false;
  }

  /**
   * Gets queue statistics
   */
  getQueueStats(): {
    totalQueued: number;
    averageWaitTime: number;
    oldestRequestAge: number;
  } {
    const now = Date.now();
    const waitTimes = this.queue.map(req => now - req.timestamp);

    return {
      totalQueued: this.queue.length,
      averageWaitTime:
        waitTimes.length > 0
          ? waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length
          : 0,
      oldestRequestAge: waitTimes.length > 0 ? Math.max(...waitTimes) : 0,
    };
  }
}
