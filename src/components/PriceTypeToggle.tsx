/**
 * PriceTypeToggle component with radio button group
 * Provides price type selection with accessibility features
 */

import React from 'react';

import { usePriceType } from '@/hooks';
import type { PriceType } from '@/types';

interface PriceTypeToggleProps {
  className?: string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

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
      ? 'flex flex-wrap gap-1'
      : 'flex flex-col gap-1';

  return (
    <div className={`${className}`}>
      {/* Label */}
      <div className='mb-2'>
        <label
          htmlFor='price-type'
          className='text-sm font-medium text-foreground'
        >
          Price Type
        </label>
      </div>

      {/* Radio Button Group */}
      <div
        role='radiogroup'
        aria-label='Select price type for chart display'
        className={containerClasses}
      >
        {priceTypeOptions.map(option => {
          const isSelected = priceType === option.value;

          return (
            <div
              key={option.value}
              className={`
                relative flex cursor-pointer items-center border px-4 py-2 transition-all duration-200
                ${
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:border-primary/50 hover:bg-accent'
                }
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                ${orientation === 'vertical' ? 'w-full' : ''}
              `}
              onClick={() => handlePriceTypeChange(option.value)}
              onKeyDown={e => handleKeyDown(e, option.value)}
              role='radio'
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
            >
              {/* Label */}
              <span className='text-xs font-medium'>{option.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
