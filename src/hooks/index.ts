/**
 * Custom React hooks export index
 */

// Stock data hooks
export {
  useTickerSearch,
  useStockPrices,
  useMultipleStockPrices,
  usePopularStocks,
} from './useStockData';

// State management hooks
export { useStockSelection } from './useStockSelection';
export { useDateRange } from './useDateRange';
export { usePriceType } from './usePriceType';
export { useUrlSync } from './useUrlSync';

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
