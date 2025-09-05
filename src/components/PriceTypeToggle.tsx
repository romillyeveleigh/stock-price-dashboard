/**
 * PriceTypeToggle component with radio button group
 * Provides price type selection with accessibility features and smooth transitions
 */

import { TrendingUp, TrendingDown, BarChart3, DollarSign } from 'lucide-react';
import React from 'react';

import { Label } from '@/components/ui/label';
import { usePriceType } from '@/hooks';
import type { PriceType } from '@/types';

interface PriceTypeToggleProps {
  className?: string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

// Price type configuration with icons and descriptions
const PRICE_TYPE_CONFIG = {
  open: {
    label: 'Open',
    description: 'Opening price at market start',
    icon: TrendingUp,
    color: 'text-blue-600',
  },
  high: {
    label: 'High',
    description: 'Highest price during trading',
    icon: TrendingUp,
    color: 'text-green-600',
  },
  low: {
    label: 'Low',
    description: 'Lowest price during trading',
    icon: TrendingDown,
    color: 'text-red-600',
  },
  close: {
    label: 'Close',
    description: 'Closing price at market end',
    icon: DollarSign,
    color: 'text-purple-600',
  },
} as const;

export function PriceTypeToggle({
  className = '',
  disabled = false,
  orientation = 'horizontal',
}: PriceTypeToggleProps) {
  const { priceType, priceTypeOptions, updatePriceType } = usePriceType();

  // Handle price type change
  const handlePriceTypeChange = (newPriceType: PriceType) => {
    if (!disabled) {
      updatePriceType(newPriceType);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (
    e: React.KeyboardEvent,
    targetPriceType: PriceType
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePriceTypeChange(targetPriceType);
    }
  };

  const containerClasses =
    orientation === 'horizontal'
      ? 'flex flex-wrap gap-2 sm:gap-3'
      : 'flex flex-col gap-2';

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label and Description */}
      <div className='space-y-1'>
        <Label className='text-sm font-medium'>Price Type</Label>
        <p className='text-xs text-muted-foreground'>
          Select which price data to display in the chart
        </p>
      </div>

      {/* Radio Button Group */}
      <div
        role='radiogroup'
        aria-label='Select price type for chart display'
        className={containerClasses}
      >
        {priceTypeOptions.map(option => {
          const config = PRICE_TYPE_CONFIG[option.value];
          const Icon = config.icon;
          const isSelected = priceType === option.value;

          return (
            <div
              key={option.value}
              className={`
                relative flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all duration-200
                ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-background hover:border-primary/50 hover:bg-accent/50'
                }
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                ${orientation === 'vertical' ? 'w-full' : 'flex-1 min-w-[120px]'}
              `}
              onClick={() => handlePriceTypeChange(option.value)}
              onKeyDown={e => handleKeyDown(e, option.value)}
              role='radio'
              aria-checked={isSelected}
              aria-describedby={`price-type-${option.value}-desc`}
              tabIndex={isSelected ? 0 : -1}
            >
              {/* Selection Indicator */}
              <div
                className={`
                flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors
                ${
                  isSelected
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground'
                }
              `}
              >
                {isSelected && (
                  <div className='h-2 w-2 rounded-full bg-primary-foreground' />
                )}
              </div>

              {/* Icon and Content */}
              <div className='flex flex-1 items-center gap-2'>
                <Icon className={`h-4 w-4 ${config.color}`} />
                <div className='flex flex-col'>
                  <span
                    className={`
                    text-sm font-medium transition-colors
                    ${isSelected ? 'text-primary' : 'text-foreground'}
                  `}
                  >
                    {config.label}
                  </span>
                  <span
                    id={`price-type-${option.value}-desc`}
                    className='text-xs text-muted-foreground'
                  >
                    {config.description}
                  </span>
                </div>
              </div>

              {/* Visual feedback for selection */}
              {isSelected && (
                <div className='absolute inset-0 rounded-lg ring-2 ring-primary/20 ring-offset-2' />
              )}
            </div>
          );
        })}
      </div>

      {/* Current Selection Summary */}
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <BarChart3 className='h-4 w-4' />
        <span>
          Currently displaying:{' '}
          <strong className='text-foreground'>
            {PRICE_TYPE_CONFIG[priceType].label}
          </strong>{' '}
          prices
        </span>
      </div>
    </div>
  );
}
