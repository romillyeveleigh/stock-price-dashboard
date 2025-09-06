/**
 * Production-grade Polygon API service with optimized fetch implementation
 * BUNDLE OPTIMIZATION: Uses native fetch instead of 1.37MB SDK
 * STABILITY: TanStack Query caching prevents redundant API calls
 */

import { format } from 'date-fns';

import { API_CONFIG, ERROR_MESSAGES, HTTP_STATUS } from '@/lib';
import type {
  AppError,
  PolygonAggregatesResponse,
  PolygonTickersResponse,
  StockPriceData,
  USStock,
} from '@/types';
import { ErrorType } from '@/types';

export class PolygonApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.apiKey = this.getSecureApiKey();
  }

  /**
   * Fetches comprehensive ticker list with bundle-optimized approach
   * CRITICAL: Single API call on app load, then client-side search to minimize API usage
   */
  async getAllTickers(): Promise<USStock[]> {
    try {
      const url = this.buildUrl('/v3/reference/tickers', {
        type: 'CS',
        market: 'stocks',
        active: 'true',
        limit: '1000',
        sort: 'ticker',
      });

      const response = await this.fetchWithTimeout(url);

      if (!response.ok) {
        throw await this.handleHttpError(response);
      }

      const data: PolygonTickersResponse = await response.json();

      if (!data.results) {
        throw this.createAppError(
          ErrorType.NO_DATA_AVAILABLE,
          'No ticker data received from API'
        );
      }

      // Filter for US common stocks only
      return data.results
        .filter(
          ticker =>
            ticker.market === 'stocks' &&
            ticker.locale === 'us' &&
            ticker.active &&
            ticker.type === 'CS' // Common stock
        )
        .map(ticker => ({
          symbol: ticker.ticker, // Use symbol as the primary property
          name: ticker.name,
          market: ticker.market as 'stocks',
          locale: ticker.locale as 'us',
          active: ticker.active,
          type: ticker.type,
          primaryExchange: ticker.primary_exchange,
        }));
    } catch (error) {
      // Re-throw AppError instances directly
      if (error && typeof error === 'object' && 'type' in error) {
        throw error;
      }

      throw this.createAppError(
        ErrorType.API_ERROR,
        `Failed to fetch ticker list: ${(error as Error).message}`,
        error
      );
    }
  }

  /**
   * Gets stock prices using aggregates endpoint with bundle-optimized approach
   * STABILITY: TanStack Query caching prevents redundant API calls
   */
  async getStockPrices(
    symbol: string,
    from: Date,
    to: Date
  ): Promise<StockPriceData> {
    try {
      const fromStr = format(from, 'yyyy-MM-dd');
      const toStr = format(to, 'yyyy-MM-dd');

      const url = this.buildUrl(
        `/v2/aggs/ticker/${symbol}/range/1/day/${fromStr}/${toStr}`,
        {
          adjusted: 'true',
          sort: 'asc',
          limit: '5000',
        }
      );

      const response = await this.fetchWithTimeout(url);

      if (!response.ok) {
        throw await this.handleHttpError(response, symbol);
      }

      const data: PolygonAggregatesResponse = await response.json();

      // Handle different status responses from Polygon API
      if (data.status === 'ERROR') {
        throw this.createAppError(
          ErrorType.API_ERROR,
          `API returned error status: ${data.status}`,
          data
        );
      }

      // 'OK' and 'DELAYED' are both valid statuses
      // 'DELAYED' indicates data might be delayed (e.g., requesting today's data before market close)
      if (!['OK', 'DELAYED'].includes(data.status)) {
        throw this.createAppError(
          ErrorType.API_ERROR,
          `API returned unexpected status: ${data.status}`,
          data
        );
      }
      if (!data.results || data.results.length === 0) {
        return {
          symbol: symbol,
          data: [],
        };
      }

      return this.transformAggregatesData(data, data.status === 'DELAYED');
    } catch (error) {
      // Re-throw AppError instances directly
      if (error && typeof error === 'object' && 'type' in error) {
        throw error;
      }

      throw this.createAppError(
        ErrorType.API_ERROR,
        `Failed to fetch stock prices for ${symbol}: ${(error as Error).message}`,
        error
      );
    }
  }

  /**
   * Builds URL with query parameters
   */
  private buildUrl(
    endpoint: string,
    params: Record<string, string> = {}
  ): string {
    const url = new URL(endpoint, this.baseUrl);

    // Add API key
    url.searchParams.set('apikey', this.apiKey);

    // Add other parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    return url.toString();
  }

  /**
   * Fetch with timeout and proper error handling
   */
  private async fetchWithTimeout(
    url: string,
    timeoutMs = API_CONFIG.defaultTimeout
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'StockDashboard/1.0',
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw this.createAppError(
          ErrorType.NETWORK_ERROR,
          `Request timeout after ${timeoutMs}ms`,
          error
        );
      }

      throw this.createAppError(
        ErrorType.NETWORK_ERROR,
        `Network request failed: ${(error as Error).message}`,
        error
      );
    }
  }

  /**
   * Handles HTTP errors with specific error types
   */
  private async handleHttpError(
    response: Response,
    symbol?: string
  ): Promise<AppError> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // Ignore JSON parsing errors for error responses
    }

    switch (response.status) {
      case HTTP_STATUS.TOO_MANY_REQUESTS:
        return this.createAppError(
          ErrorType.API_RATE_LIMIT,
          ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
          { status: response.status, symbol }
        );

      case HTTP_STATUS.UNAUTHORIZED:
      case HTTP_STATUS.FORBIDDEN:
        return this.createAppError(
          ErrorType.UNAUTHORIZED,
          ERROR_MESSAGES.INVALID_API_KEY,
          { status: response.status }
        );

      case HTTP_STATUS.NOT_FOUND:
        return this.createAppError(
          ErrorType.INVALID_STOCK_SYMBOL,
          symbol ? `Stock symbol ${symbol} not found` : 'Resource not found',
          { status: response.status, symbol }
        );

      default:
        return this.createAppError(ErrorType.API_ERROR, errorMessage, {
          status: response.status,
          symbol,
        });
    }
  }

  /**
   * Transforms Polygon aggregates data to our internal format
   * @param response - The Polygon API response
   * @param isDelayed - Whether the data is delayed (status === 'DELAYED')
   */
  private transformAggregatesData(
    response: PolygonAggregatesResponse,
    isDelayed = false
  ): StockPriceData {
    return {
      symbol: response.ticker,
      data: response.results.map(result => ({
        date: new Date(result.t).toISOString().split('T')[0],
        open: result.o,
        high: result.h,
        low: result.l,
        close: result.c,
        volume: result.v,
        volumeWeightedPrice: result.vw,
        transactions: result.n,
      })),
      // Add metadata about data status
      metadata: {
        isDelayed,
        status: response.status,
        queryCount: response.queryCount,
        resultsCount: response.resultsCount,
      },
    };
  }

  /**
   * Gets secure API key with validation
   */
  private getSecureApiKey(): string {
    const apiKey = API_CONFIG.apiKey;

    if (!apiKey) {
      throw this.createAppError(
        ErrorType.UNAUTHORIZED,
        ERROR_MESSAGES.INVALID_API_KEY
      );
    }

    return apiKey;
  }

  /**
   * Creates standardized application errors
   */
  private createAppError(
    type: ErrorType,
    message: string,
    details?: unknown
  ): AppError {
    return {
      type,
      message,
      details,
      timestamp: new Date(),
    };
  }
}
