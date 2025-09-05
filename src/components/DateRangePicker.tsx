/**
 * DateRangePicker component with validation and presets
 * Provides date input controls with quick preset buttons and accessibility features
 */

import { format } from 'date-fns';
import { Calendar, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDateRange } from '@/hooks';

interface DateRangePickerProps {
  className?: string;
  disabled?: boolean;
}

export function DateRangePicker({
  className = '',
  disabled = false,
}: DateRangePickerProps) {
  const {
    dateRange,
    datePresets,
    activePreset,
    isCurrentDateSelected,
    updateDateRange,
    applyPreset,
    validateDateRange,
  } = useDateRange();

  const [fromInput, setFromInput] = useState(
    format(dateRange.from, 'yyyy-MM-dd')
  );
  const [toInput, setToInput] = useState(format(dateRange.to, 'yyyy-MM-dd'));
  const [validationError, setValidationError] = useState<string | null>(null);

  // Handle date input changes
  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromInput(value);

    if (value) {
      const fromDate = new Date(value);
      const toDate = new Date(toInput);

      const error = validateDateRange(fromDate, toDate);
      setValidationError(error);

      if (!error) {
        updateDateRange(fromDate, toDate);
      }
    }
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToInput(value);

    if (value) {
      const fromDate = new Date(fromInput);
      const toDate = new Date(value);

      const error = validateDateRange(fromDate, toDate);
      setValidationError(error);

      if (!error) {
        updateDateRange(fromDate, toDate);
      }
    }
  };

  // Handle preset selection
  const handlePresetClick = (preset: (typeof datePresets)[0]) => {
    applyPreset(preset);
    setFromInput(format(preset.from, 'yyyy-MM-dd'));
    setToInput(format(preset.to, 'yyyy-MM-dd'));
    setValidationError(null);
  };

  // Get today's date for max attribute
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Date Range Inputs */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {/* From Date */}
        <div className='space-y-2'>
          <Label htmlFor='from-date' className='text-sm font-medium'>
            From Date
          </Label>
          <div className='relative'>
            <Calendar className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              id='from-date'
              type='date'
              value={fromInput}
              onChange={handleFromDateChange}
              max={today}
              disabled={disabled}
              className='pl-10'
              aria-label='Select start date'
              aria-describedby='date-range-help'
            />
          </div>
        </div>

        {/* To Date */}
        <div className='space-y-2'>
          <Label htmlFor='to-date' className='text-sm font-medium'>
            To Date
          </Label>
          <div className='relative'>
            <Calendar className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              id='to-date'
              type='date'
              value={toInput}
              onChange={handleToDateChange}
              max={today}
              disabled={disabled}
              className='pl-10'
              aria-label='Select end date'
              aria-describedby='date-range-help'
            />
          </div>
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div className='space-y-2'>
        <Label className='text-sm font-medium'>Quick Presets</Label>
        <div className='flex flex-wrap gap-2'>
          {datePresets.map(preset => (
            <Button
              key={preset.value}
              variant={activePreset === preset.value ? 'default' : 'outline'}
              size='sm'
              onClick={() => handlePresetClick(preset)}
              disabled={disabled}
              className='text-xs'
              aria-label={`Select ${preset.label} date range`}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Current Date Warning */}
      {isCurrentDateSelected && (
        <Card className='border-amber-200 bg-amber-50'>
          <CardContent className='flex items-center gap-2 p-3'>
            <AlertCircle className='h-4 w-4 text-amber-600' />
            <div className='text-sm text-amber-800'>
              <strong>Note:</strong> Today&apos;s data may be incomplete until
              market close.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Error */}
      {validationError && (
        <Card className='border-destructive/20 bg-destructive/5'>
          <CardContent className='flex items-center gap-2 p-3'>
            <AlertCircle className='h-4 w-4 text-destructive' />
            <div className='text-sm text-destructive'>{validationError}</div>
          </CardContent>
        </Card>
      )}

      {/* Selected Range Display */}
      <div className='flex items-center justify-between text-sm text-muted-foreground'>
        <div id='date-range-help'>
          Selected range: {format(dateRange.from, 'MMM dd, yyyy')} -{' '}
          {format(dateRange.to, 'MMM dd, yyyy')}
        </div>
        {activePreset && (
          <Badge variant='secondary' className='text-xs'>
            {activePreset}
          </Badge>
        )}
      </div>
    </div>
  );
}
