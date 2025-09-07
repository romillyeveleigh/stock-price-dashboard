/**
 * PriceTypeToggle component with radio button group
 * Provides price type selection with accessibility features
 */

import React, { useRef } from 'react';

import { usePriceType } from '@/hooks';
import type { PriceType } from '@/types';

interface PriceTypeToggleProps {
  className?: string;
  disabled?: boolean;
}

export function PriceTypeToggle({
  className = '',
  disabled = false,
}: PriceTypeToggleProps) {
  const { priceType, priceTypeOptions, updatePriceType } = usePriceType();
  const radioRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Handle price type change
  const handlePriceTypeChange = (newPriceType: PriceType) => {
    if (!disabled) {
      updatePriceType(newPriceType);
    }
  };

  // Handle keyboard navigation for radio button group
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (disabled) return;

    let targetIndex = currentIndex;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        handlePriceTypeChange(priceTypeOptions[currentIndex].value);
        break;

      case 'ArrowRight':
        e.preventDefault();
        targetIndex = (currentIndex + 1) % priceTypeOptions.length;
        break;

      case 'ArrowLeft':
        e.preventDefault();
        targetIndex =
          currentIndex === 0 ? priceTypeOptions.length - 1 : currentIndex - 1;
        break;

      case 'Home':
        e.preventDefault();
        targetIndex = 0;
        break;

      case 'End':
        e.preventDefault();
        targetIndex = priceTypeOptions.length - 1;
        break;
    }

    // Focus the target radio button
    if (targetIndex !== currentIndex && radioRefs.current[targetIndex]) {
      radioRefs.current[targetIndex]?.focus();
    }
  };

  const containerClasses = 'flex flex-wrap gap-1';

  // Determine which radio button should be focusable
  const getTabIndex = (index: number) => {
    // Only the first radio button (or selected one if no selection) should be focusable
    const selectedIndex = priceTypeOptions.findIndex(
      option => option.value === priceType
    );
    const focusableIndex = selectedIndex >= 0 ? selectedIndex : 0;
    return index === focusableIndex ? 0 : -1;
  };

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
        {priceTypeOptions.map((option, index) => {
          const isSelected = priceType === option.value;

          return (
            <div
              key={option.value}
              ref={el => {
                radioRefs.current[index] = el;
              }}
              className={`
                relative flex cursor-pointer items-center border px-4 py-2 transition-all duration-200
                ${
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:border-primary/50 hover:bg-accent'
                }
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              `}
              onClick={() => handlePriceTypeChange(option.value)}
              onKeyDown={e => handleKeyDown(e, index)}
              role='radio'
              aria-checked={isSelected}
              tabIndex={getTabIndex(index)}
            >
              {/* Label */}
              <span className='text-xs font-medium'>{option.label.toUpperCase()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
