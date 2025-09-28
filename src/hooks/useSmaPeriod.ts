/**
 * Custom hook for sma period management
 * Handles sma period selection and chart data transformation
 */

import { useCallback, useMemo } from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { SMA_PERIODS } from '@/lib';
// import type { StockPriceData, LineSeriesData } from '@/types';

export function useSmaPeriod() {
  const { state, setSmaPeriod } = useAppContext();

  // Update price type
  const updateSmaPeriod = useCallback(
    (smaPeriod: number | null) => {
      setSmaPeriod(smaPeriod);
    },
    [setSmaPeriod]
  );

  // Get current price type label
  const currentSmaPeriodLabel = useMemo((): string => {
    const smaPeriodOption = SMA_PERIODS.find(
      option => option.value === state.smaPeriod
    );
    return smaPeriodOption?.label || '5D';
  }, [state.smaPeriod]);

  return {
    smaPeriod: state.smaPeriod,
    smaPeriodLabel: currentSmaPeriodLabel,
    smaPeriodOptions: SMA_PERIODS,
    updateSmaPeriod,
  };
}
