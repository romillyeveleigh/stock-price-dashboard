import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { PriceDataPoint, PriceType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateSimpleMovingAverage(
  data: PriceDataPoint[],
  period: number | null,
  priceType: PriceType
): [number, number | null][] {
  if (period === null) {
    return data.map(point => {
      return [new Date(point.date).getTime(), null];
    });
  }

  return data.map((point, index) => {
    const timestamp = new Date(point.date).getTime();

    // Not enough data points for this period
    if (index < period - 1) {
      return [timestamp, null];
    }

    // Calculate average of the last 'period' data points
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += data[index - i][priceType];
    }

    const sma = sum / period;
    return [timestamp, sma];
  });
}
