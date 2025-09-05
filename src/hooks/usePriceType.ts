/**
 * Custom hook for price type management
 * Handles price type selection and chart data transformation
 */

import { useCallback, useMemo } from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { PRICE_TYPES } from '@/lib';
import type { PriceType, StockPriceData, LineSeriesData } from '@/types';

export function usePriceType() {
  const { state, setPriceType } = useAppContext();

  // Update price type
  const updatePriceType = useCallback(
    (priceType: PriceType) => {
      setPriceType(priceType);
    },
    [setPriceType]
  );

  // Transform chart data based on selected price type
  const transformChartData = useCallback(
    (stockData: StockPriceData[]): LineSeriesData[] => {
      return stockData.map((stock, index) => ({
        name: stock.symbol,
        data: stock.data.map(point => [
          new Date(point.date).getTime(),
          point[state.priceType], // Use selected price type
        ]),
        color: getStockColor(index), // Use predefined colors
      }));
    },
    [state.priceType]
  );

  // Get current price type label
  const currentPriceTypeLabel = useMemo((): string => {
    const priceTypeOption = PRICE_TYPES.find(
      option => option.value === state.priceType
    );
    return priceTypeOption?.label || 'Close';
  }, [state.priceType]);

  return {
    priceType: state.priceType,
    priceTypeLabel: currentPriceTypeLabel,
    priceTypeOptions: PRICE_TYPES,
    updatePriceType,
    transformChartData,
  };
}

// Helper function to get consistent colors for stocks
function getStockColor(index: number): string {
  const colors = [
    '#3b82f6', // Professional blue
    '#10b981', // Professional green
    '#f59e0b', // Professional amber
    '#ef4444', // Professional red
    '#8b5cf6', // Professional purple
    '#06b6d4', // Professional cyan
    '#84cc16', // Professional lime
    '#f97316', // Professional orange
  ];

  return colors[index % colors.length];
}
