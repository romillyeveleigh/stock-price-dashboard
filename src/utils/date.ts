/**
 * Date utility functions
 */

import {
  format,
  parseISO,
  isValid,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';

/**
 * Formats a date for display
 */
export function formatDate(date: Date, formatString = 'yyyy-MM-dd'): string {
  if (!isValid(date)) {
    return '';
  }
  return format(date, formatString);
}

/**
 * Formats a date for API requests (ISO format)
 */
export function formatDateForApi(date: Date): string {
  return formatDate(date, 'yyyy-MM-dd');
}

/**
 * Parses an ISO date string to Date object
 */
export function parseDate(dateString: string): Date | null {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
}

/**
 * Gets preset date ranges for quick selection
 */
export function getPresetDateRanges() {
  const now = new Date();

  return {
    '1D': {
      from: subDays(now, 1),
      to: now,
      label: '1 Day',
    },
    '1W': {
      from: subDays(now, 7),
      to: now,
      label: '1 Week',
    },
    '1M': {
      from: subMonths(now, 1),
      to: now,
      label: '1 Month',
    },
    '3M': {
      from: subMonths(now, 3),
      to: now,
      label: '3 Months',
    },
    '6M': {
      from: subMonths(now, 6),
      to: now,
      label: '6 Months',
    },
    '1Y': {
      from: subYears(now, 1),
      to: now,
      label: '1 Year',
    },
    YTD: {
      from: new Date(now.getFullYear(), 0, 1),
      to: now,
      label: 'Year to Date',
    },
  };
}

/**
 * Checks if a date is a trading day (weekday)
 */
export function isTradingDay(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
}

/**
 * Gets the last trading day before or on the given date
 */
export function getLastTradingDay(date: Date): Date {
  let lastTradingDay = new Date(date);

  while (!isTradingDay(lastTradingDay)) {
    lastTradingDay = subDays(lastTradingDay, 1);
  }

  return lastTradingDay;
}

/**
 * Calculates the number of trading days between two dates
 */
export function getTradingDaysBetween(from: Date, to: Date): number {
  let count = 0;
  let current = new Date(from);

  while (current <= to) {
    if (isTradingDay(current)) {
      count++;
    }
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000); // Add one day
  }

  return count;
}
