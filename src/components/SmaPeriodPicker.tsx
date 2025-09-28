/**
 * DateRangePicker component with validation and presets
 * Provides date input controls with quick preset buttons and accessibility features
 */

import { Button } from '@/components/ui/button';
import { useSmaPeriod } from '@/hooks';

interface SmaPeriodPickerProps {
  className?: string;
  disabled?: boolean;
}

export function SmaPeriodPicker({
  className = '',
  disabled = false,
}: SmaPeriodPickerProps) {
  const { smaPeriod, smaPeriodOptions, updateSmaPeriod } = useSmaPeriod();

  return (
    <div className={`space-y-3 ${className}`}>
      <div className='flex flex-col gap-3 md:flex-row md:items-center'>
        <div className='flex flex-wrap gap-2 w-full md:w-auto'>
          {smaPeriodOptions.map(preset => (
            <Button
              key={preset.value}
              variant={smaPeriod === preset.value ? 'default' : 'outline'}
              size='sm'
              onClick={() => updateSmaPeriod(preset.value)}
              disabled={disabled}
              className='text-xs px-3 py-1.5 '
              aria-label={`Select ${preset.label} date range`}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
