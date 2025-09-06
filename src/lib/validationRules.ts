/**
 * Common validation rules for form inputs
 */

interface ValidationRule {
  test: (value: unknown) => boolean;
  message: string;
  type?: 'error' | 'warning' | 'info';
}

// Common validation rules
export const ValidationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    test: value => value !== null && value !== undefined && value !== '',
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    test: value => !value || (typeof value === 'string' && value.length >= min),
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    test: value => !value || (typeof value === 'string' && value.length <= max),
    message: message || `Must be no more than ${max} characters`,
  }),

  dateRange: (from: Date, to: Date, message?: string): ValidationRule => ({
    test: value => {
      if (!value) return true;
      const date = new Date(value as string);
      return date >= from && date <= to;
    },
    message:
      message ||
      `Date must be between ${from.toLocaleDateString()} and ${to.toLocaleDateString()}`,
  }),

  futureDate: (message = 'Date cannot be in the future'): ValidationRule => ({
    test: value => {
      if (!value) return true;
      const date = new Date(value as string);
      return date <= new Date();
    },
    message,
  }),

  stockSymbol: (message = 'Invalid stock symbol format'): ValidationRule => ({
    test: value => {
      if (!value) return true;
      return /^[A-Z]{1,5}$/.test(value as string);
    },
    message,
  }),

  maxStocks: (
    max: number,
    currentCount: number,
    message?: string
  ): ValidationRule => ({
    test: () => currentCount < max,
    message: message || `Maximum ${max} stocks allowed`,
    type: 'warning',
  }),

  dateNotWeekend: (
    message = 'Market is closed on weekends'
  ): ValidationRule => ({
    test: value => {
      if (!value) return true;
      const date = new Date(value as string);
      const day = date.getDay();
      return day !== 0 && day !== 6; // 0 = Sunday, 6 = Saturday
    },
    message,
    type: 'info',
  }),

  recentDate: (days = 30, message?: string): ValidationRule => ({
    test: value => {
      if (!value) return true;
      const date = new Date(value as string);
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      return date >= daysAgo;
    },
    message: message || `Data older than ${days} days may be limited`,
    type: 'info',
  }),
};

export type { ValidationRule };
