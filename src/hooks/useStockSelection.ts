/**
 * Custom hook for stock selection logic
 * Handles adding, removing, and validating stock selections
 */

import { useCallback } from 'react';

import { useAppContext } from '@/contexts/AppContext';
import type { Stock } from '@/types';

export function useStockSelection() {
  const { state, addStock, removeStock } = useAppContext();

  // Check if a stock is already selected
  const isStockSelected = useCallback(
    (symbol: string): boolean => {
      return state.selectedStocks.some(stock => stock.symbol === symbol);
    },
    [state.selectedStocks]
  );

  // Check if we can add more stocks
  const canAddStock = useCallback((): boolean => {
    return state.selectedStocks.length < 3; // MAX_STOCKS from config
  }, [state.selectedStocks.length]);

  // Add stock with validation
  const handleAddStock = useCallback(
    (stock: Stock) => {
      if (isStockSelected(stock.symbol)) {
        return false; // Already selected
      }

      if (!canAddStock()) {
        return false; // Max limit reached
      }

      addStock(stock);
      return true;
    },
    [addStock, isStockSelected, canAddStock]
  );

  // Remove stock
  const handleRemoveStock = useCallback(
    (symbol: string) => {
      removeStock(symbol);
    },
    [removeStock]
  );

  // Get selected stock symbols as array
  const selectedSymbols = useCallback((): string[] => {
    return state.selectedStocks.map(stock => stock.symbol);
  }, [state.selectedStocks]);

  return {
    selectedStocks: state.selectedStocks,
    selectedSymbols: selectedSymbols(),
    isStockSelected,
    canAddStock: canAddStock(),
    addStock: handleAddStock,
    removeStock: handleRemoveStock,
    stockCount: state.selectedStocks.length,
    maxStocks: 3,
  };
}
