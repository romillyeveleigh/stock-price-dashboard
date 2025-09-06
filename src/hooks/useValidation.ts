/**
 * Validation hook for form inputs
 */

import { useState, useEffect, useCallback } from 'react';

import type { ValidationRule } from '@/lib/validationRules';

// Hook for using validation
export function useValidation(value: unknown, rules: ValidationRule[]) {
  const [results, setResults] = useState({
    errors: [] as ValidationRule[],
    warnings: [] as ValidationRule[],
    infos: [] as ValidationRule[],
    isValid: true,
  });

  const validate = useCallback(() => {
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

    const newResults = {
      errors,
      warnings,
      infos,
      isValid: errors.length === 0,
    };

    setResults(newResults);
    return newResults;
  }, [value, rules]);

  useEffect(() => {
    validate();
  }, [validate]);

  return {
    ...results,
    validate,
  };
}
