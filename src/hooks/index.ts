/**
 * Custom React hooks export index
 */

// Stock data hooks
export {
  useAllTickers,
  useStockSearch,
  useStockPrices,
  useMultipleStockPrices,
  useRateLimitStatus,
  useApiQueueStats,
  usePopularStocks,
} from './useStockData';

// Utility hooks
export { useDebounce } from './useDebounce';
export { useLocalStorage } from './useLocalStorage';
export {
  useResponsive,
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  usePrefersDarkMode,
} from './useResponsive';
