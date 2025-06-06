import { useState, useCallback, useMemo } from 'react';
import { isValidEmail, isValidUrl, isValidPhoneNumber } from '../utils/stringUtils';

// Validation rule type
export type ValidationRule = (value: any, formValues?: Record<string, any>) => string | null;

// Field config interface
export interface FieldConfig {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  isEmail?: boolean;
  isNumber?: boolean;
  isPassword?: boolean;
  isUrl?: boolean;
  isPhone?: boolean;
  match?: string;
  customRule?: ValidationRule;
  errorMessages?: {
    required?: string;
    minLength?: string;
    maxLength?: string;
    pattern?: string;
    isEmail?: string;
    isNumber?: string;
    isPassword?: string;
    isUrl?: string;
    isPhone?: string;
    match?: string;
  };
}

// Form config type
export type FormConfig = Record<string, FieldConfig>;

/**
 * Hook for form validation
 */
export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  formConfig: FormConfig
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * Validate a single field
   */
  const validateField = useCallback((name: string, value: any): string | null => {
    const config = formConfig[name];
    if (!config) return null;
    
    // Check if field is required
    if (config.required && (value === undefined || value === null || value === '')) {
      return config.errorMessages?.required || 'This field is required';
    }
    
    // Skip other validations if value is empty and not required
    if (value === undefined || value === null || value === '') {
      return null;
    }
    
    // Check min length
    if (config.minLength !== undefined && typeof value === 'string' && value.length < config.minLength) {
      return config.errorMessages?.minLength || `Minimum length is ${config.minLength} characters`;
    }
    
    // Check max length
    if (config.maxLength !== undefined && typeof value === 'string' && value.length > config.maxLength) {
      return config.errorMessages?.maxLength || `Maximum length is ${config.maxLength} characters`;
    }
    
    // Check pattern
    if (config.pattern && typeof value === 'string' && !config.pattern.test(value)) {
      return config.errorMessages?.pattern || 'Invalid format';
    }
    
    // Check if email
    if (config.isEmail && typeof value === 'string' && !isValidEmail(value)) {
      return config.errorMessages?.isEmail || 'Invalid email address';
    }
    
    // Check if number
    if (config.isNumber && (typeof value !== 'number' && isNaN(Number(value)))) {
      return config.errorMessages?.isNumber || 'Must be a number';
    }
    
    // Check if password (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
    if (config.isPassword && typeof value === 'string' && 
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)) {
      return config.errorMessages?.isPassword || 
        'Password must be at least 8 characters with 1 uppercase letter, 1 lowercase letter, and 1 number';
    }
    
    // Check if URL
    if (config.isUrl && typeof value === 'string' && !isValidUrl(value)) {
      return config.errorMessages?.isUrl || 'Invalid URL';
    }
    
    // Check if phone
    if (config.isPhone && typeof value === 'string' && !isValidPhoneNumber(value)) {
      return config.errorMessages?.isPhone || 'Invalid phone number';
    }
    
    // Check if matches another field
    if (config.match && values[config.match] !== value) {
      return config.errorMessages?.match || `Must match ${config.match}`;
    }
    
    // Check custom rule
    if (config.customRule) {
      return config.customRule(value, values);
    }
    
    return null;
  }, [formConfig, values]);
  
  /**
   * Validate all fields
   */
  const validateForm = useCallback((): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    Object.keys(formConfig).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });
    
    return newErrors;
  }, [formConfig, validateField, values]);
  
  /**
   * Handle field change
   */
  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validate field if it's been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error || '',
      }));
    }
  }, [touched, validateField]);
  
  /**
   * Handle field blur
   */
  const handleBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field
    const error = validateField(name, values[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error || '',
    }));
  }, [validateField, values]);
  
  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (
    onSubmit: (values: T) => Promise<void> | void,
    onError?: (errors: Record<string, string>) => void
  ) => {
    setIsSubmitting(true);
    
    // Validate all fields
    const formErrors = validateForm();
    setErrors(formErrors);
    
    // Mark all fields as touched
    const allTouched = Object.keys(formConfig).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);
    
    // If there are errors, call onError and return
    if (Object.keys(formErrors).length > 0) {
      if (onError) {
        onError(formErrors);
      }
      setIsSubmitting(false);
      return;
    }
    
    // Otherwise call onSubmit
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formConfig, validateForm, values]);
  
  /**
   * Reset the form
   */
  const resetForm = useCallback((newValues?: Partial<T>) => {
    setValues(prev => ({ ...initialValues, ...newValues }));
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  /**
   * Set field value
   */
  const setFieldValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);
  
  /**
   * Set field error
   */
  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);
  
  /**
   * Set field touched
   */
  const setFieldTouched = useCallback((name: string, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
  }, []);
  
  /**
   * Check if form is valid
   */
  const isValid = useMemo(() => {
    return Object.keys(validateForm()).length === 0;
  }, [validateForm]);
  
  /**
   * Check if form is dirty (values different from initial)
   */
  const isDirty = useMemo(() => {
    return Object.keys(initialValues).some(key => initialValues[key] !== values[key]);
  }, [initialValues, values]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    validateForm,
  };
};

/**
 * Common validation rules
 */
export const validationRules = {
  required: (value: any): string | null => {
    return value === undefined || value === null || value === '' 
      ? 'This field is required' 
      : null;
  },
  
  minLength: (length: number) => (value: any): string | null => {
    return typeof value === 'string' && value.length < length 
      ? `Minimum length is ${length} characters` 
      : null;
  },
  
  maxLength: (length: number) => (value: any): string | null => {
    return typeof value === 'string' && value.length > length 
      ? `Maximum length is ${length} characters` 
      : null;
  },
  
  isEmail: (value: any): string | null => {
    return typeof value === 'string' && !isValidEmail(value) 
      ? 'Invalid email address' 
      : null;
  },
  
  isUrl: (value: any): string | null => {
    return typeof value === 'string' && !isValidUrl(value) 
      ? 'Invalid URL' 
      : null;
  },
  
  isPhone: (value: any): string | null => {
    return typeof value === 'string' && !isValidPhoneNumber(value) 
      ? 'Invalid phone number' 
      : null;
  },
  
  isNumber: (value: any): string | null => {
    return (typeof value !== 'number' && isNaN(Number(value))) 
      ? 'Must be a number' 
      : null;
  },
  
  isInteger: (value: any): string | null => {
    return !Number.isInteger(Number(value)) 
      ? 'Must be an integer' 
      : null;
  },
  
  min: (min: number) => (value: any): string | null => {
    return Number(value) < min 
      ? `Must be at least ${min}` 
      : null;
  },
  
  max: (max: number) => (value: any): string | null => {
    return Number(value) > max 
      ? `Must be at most ${max}` 
      : null;
  },
  
  pattern: (pattern: RegExp, message: string = 'Invalid format') => (value: any): string | null => {
    return typeof value === 'string' && !pattern.test(value) 
      ? message 
      : null;
  },
  
  match: (fieldName: string) => (value: any, formValues?: Record<string, any>): string | null => {
    return formValues && formValues[fieldName] !== value 
      ? `Must match ${fieldName}` 
      : null;
  },
};
