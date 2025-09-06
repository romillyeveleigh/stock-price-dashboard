/**
 * Validation Handler component
 * Provides real-time validation feedback for form inputs
 */

import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

import { ValidationError } from '@/components/ErrorStates';
import type { ValidationRule } from '@/lib/validationRules';

interface ValidationHandlerProps {
  value: unknown;
  rules: ValidationRule[];
  className?: string;
  showSuccess?: boolean;
  realTime?: boolean;
}

export function ValidationHandler({
  value,
  rules,
  className = '',
  showSuccess = false,
  realTime = true,
}: ValidationHandlerProps) {
  const [validationResults, setValidationResults] = useState<{
    errors: ValidationRule[];
    warnings: ValidationRule[];
    infos: ValidationRule[];
    isValid: boolean;
  }>({
    errors: [],
    warnings: [],
    infos: [],
    isValid: true,
  });

  useEffect(() => {
    if (!realTime) return;

    const errors: ValidationRule[] = [];
    const warnings: ValidationRule[] = [];
    const infos: ValidationRule[] = [];

    rules.forEach(rule => {
      if (!rule.test(value)) {
        switch (rule.type) {
          case 'warning':
            warnings.push(rule);
            break;
          case 'info':
            infos.push(rule);
            break;
          default:
            errors.push(rule);
        }
      }
    });

    setValidationResults({
      errors,
      warnings,
      infos,
      isValid: errors.length === 0,
    });
  }, [value, rules, realTime]);

  // Validation function for manual validation
  // const validate = () => {
  //   const errors: ValidationRule[] = [];
  //   const warnings: ValidationRule[] = [];
  //   const infos: ValidationRule[] = [];

  //   rules.forEach(rule => {
  //     if (!rule.test(value)) {
  //       switch (rule.type) {
  //         case 'warning':
  //           warnings.push(rule);
  //           break;
  //         case 'info':
  //           infos.push(rule);
  //           break;
  //         default:
  //           errors.push(rule);
  //       }
  //     }
  //   });

  //   const results = {
  //     errors,
  //     warnings,
  //     infos,
  //     isValid: errors.length === 0
  //   };

  //   setValidationResults(results);
  //   return results;
  // };

  if (
    !realTime &&
    validationResults.errors.length === 0 &&
    validationResults.warnings.length === 0 &&
    validationResults.infos.length === 0
  ) {
    return null;
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Errors */}
      {validationResults.errors.map((error, index) => (
        <ValidationError
          key={`error-${index}`}
          error={error.message}
          className='text-xs'
        />
      ))}

      {/* Warnings */}
      {validationResults.warnings.map((warning, index) => (
        <div
          key={`warning-${index}`}
          className='flex items-center gap-2 text-xs text-yellow-600'
        >
          <AlertCircle className='h-3 w-3 flex-shrink-0' />
          <span>{warning.message}</span>
        </div>
      ))}

      {/* Info messages */}
      {validationResults.infos.map((info, index) => (
        <div
          key={`info-${index}`}
          className='flex items-center gap-2 text-xs text-blue-600'
        >
          <Info className='h-3 w-3 flex-shrink-0' />
          <span>{info.message}</span>
        </div>
      ))}

      {/* Success message */}
      {showSuccess && validationResults.isValid && value && (
        <div className='flex items-center gap-2 text-xs text-green-600'>
          <CheckCircle className='h-3 w-3 flex-shrink-0' />
          <span>Valid input</span>
        </div>
      )}
    </div>
  );
}

// Hook moved to separate hooks file to avoid fast refresh issues
