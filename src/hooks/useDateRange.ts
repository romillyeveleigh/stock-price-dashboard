/**
 * Custom hook for date range management
 * Handles date validation, presets, and range updates
 */

import {
  subMonths,
  subYears,
  startOfYear,
  isAfter,
  isValid,
  differenceInYears,
} from 'date-fns';
import { useCallback, useMemo } from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { APP_CONFIG } from '@/lib';

export interface DatePreset {
  label: string;
  value: string;
  from: Date;
  to: Date;
}

export function useDateRange() {
  const { state, setDateRange, setError } = useAppContext();

  // Date presets for quick selection
  const datePresets = useMemo((): DatePreset[] => {
    const today = new Date();

    return [
      {
        label: '1M',
        value: '1M',
        from: subMonths(today, 1),
        to: today,
      },
      {
        label: '3M',
        value: '3M',
        from: subMonths(today, 3),
        to: today,
      },
      {
        label: '6M',
        value: '6M',
        from: subMonths(today, 6),
        to: today,
      },
      {
        label: 'YTD',
        value: 'YTD',
        from: startOfYear(today),
        to: today,
      },
      {
        label: '1Y',
        value: '1Y',
        from: subYears(today, 1),
        to: today,
      },
    ];
  }, []);

  // Validate date range
  const validateDateRange = useCallback(
    (from: Date, to: Date): string | null => {
      const today = new Date();

      // Check if dates are valid
      if (!isValid(from) || !isValid(to)) {
        return 'Invalid date format';
      }

      // Check if from date is in the future
      if (isAfter(from, today)) {
        return 'Start date cannot be in the future';
      }

      // Check if to date is in the future
      if (isAfter(to, today)) {
        return 'End date cannot be in the future';
      }

      // Check if from date is after to date
      if (isAfter(from, to)) {
        return 'Start date must be before end date';
      }

      // Check if date range is too large (max 5 years as per config)
      if (differenceInYears(to, from) > APP_CONFIG.MAX_DATE_RANGE_YEARS) {
        return `Date range cannot exceed ${APP_CONFIG.MAX_DATE_RANGE_YEARS} years`;
      }

      return null; // Valid
    },
    []
  );

  // Update date range with validation
  const updateDateRange = useCallback(
    (from: Date, to: Date) => {
      const validationError = validateDateRange(from, to);

      if (validationError) {
        setError(validationError);
        return false;
      }

      setDateRange(from, to);
      return true;
    },
    [setDateRange, setError, validateDateRange]
  );

  // Apply date preset
  const applyPreset = useCallback(
    (preset: DatePreset) => {
      updateDateRange(preset.from, preset.to);
    },
    [updateDateRange]
  );

  // Get current active preset (if any)
  const activePreset = useMemo((): string | null => {
    const { from, to } = state.dateRange;

    for (const preset of datePresets) {
      // Check if current range matches preset (within same day)
      if (
        from.toDateString() === preset.from.toDateString() &&
        to.toDateString() === preset.to.toDateString()
      ) {
        return preset.value;
      }
    }

    return null; // Custom range
  }, [state.dateRange, datePresets]);

  // Check if current date is selected (for warning about incomplete data)
  const isCurrentDateSelected = useMemo((): boolean => {
    const today = new Date();
    return state.dateRange.to.toDateString() === today.toDateString();
  }, [state.dateRange.to]);

  return {
    dateRange: state.dateRange,
    datePresets,
    activePreset,
    isCurrentDateSelected,
    updateDateRange,
    applyPreset,
    validateDateRange,
  };
}
