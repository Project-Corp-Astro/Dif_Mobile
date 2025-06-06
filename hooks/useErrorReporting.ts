import { useState, useCallback, useEffect } from 'react';
import * as Sentry from 'sentry-expo';
import { Alert, Platform } from 'react-native';
import { useUserStore } from '@state/userStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error types
export enum ErrorType {
  NETWORK = 'network',
  API = 'api',
  AUTH = 'auth',
  DATABASE = 'database',
  VALIDATION = 'validation',
  UI = 'ui',
  UNKNOWN = 'unknown',
}

// Error interface
export interface AppError {
  message: string;
  type: ErrorType;
  severity: ErrorSeverity;
  timestamp: Date;
  metadata?: Record<string, any>;
  stack?: string;
  handled: boolean;
}

/**
 * Hook for handling and reporting errors throughout the app
 */
export const useErrorReporting = () => {
  const [lastError, setLastError] = useState<AppError | null>(null);
  const [errorCount, setErrorCount] = useState<number>(0);
  const user = useUserStore((state) => state.user);
  
  // Initialize error reporting
  useEffect(() => {
    const initErrorReporting = async () => {
      try {
        // Check if error reporting is enabled
        const errorReportingEnabled = await AsyncStorage.getItem('error_reporting_enabled');
        
        if (errorReportingEnabled !== 'false') {
          // In a real app, you would initialize your error reporting service here
          // For example:
          // Sentry.init({
          //   dsn: 'YOUR_SENTRY_DSN',
          //   enableInExpoDevelopment: true,
          //   debug: __DEV__,
          // });
          
          // Set user context if available
          if (user?.id) {
            // Sentry.setUser({
            //   id: user.id,
            //   email: user.email,
            // });
          }
        }
      } catch (error) {
        console.error('Error initializing error reporting:', error);
      }
    };
    
    initErrorReporting();
  }, []);
  
  // Update user context when user changes
  useEffect(() => {
    if (user?.id) {
      // In a real app, you would update your error reporting service with user info
      // For example:
      // Sentry.setUser({
      //   id: user.id,
      //   email: user.email,
      // });
    }
  }, [user]);
  
  /**
   * Report an error to the error reporting service
   * @param error - Error object or message
   * @param type - Type of error
   * @param severity - Severity of error
   * @param metadata - Additional metadata
   * @param showAlert - Whether to show an alert to the user
   */
  const reportError = useCallback((
    error: Error | string,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    metadata?: Record<string, any>,
    showAlert: boolean = false,
  ) => {
    try {
      // Create error object
      const errorObj: AppError = {
        message: typeof error === 'string' ? error : error.message,
        type,
        severity,
        timestamp: new Date(),
        metadata: {
          ...metadata,
          platform: Platform.OS,
          appVersion: '1.0.0', // Replace with actual app version
        },
        stack: typeof error !== 'string' ? error.stack : undefined,
        handled: true,
      };
      
      // Set last error
      setLastError(errorObj);
      setErrorCount((prev) => prev + 1);
      
      // Log error to console in development
      if (__DEV__) {
        console.error('[Error]', errorObj);
      }
      
      // In a real app, you would report the error to your error reporting service
      // For example:
      // Sentry.captureException(error, {
      //   tags: {
      //     type,
      //     severity,
      //   },
      //   extra: metadata,
      // });
      
      // Show alert if requested
      if (showAlert) {
        Alert.alert(
          'Error',
          typeof error === 'string' ? error : error.message,
          [{ text: 'OK' }]
        );
      }
      
      return errorObj;
    } catch (e) {
      console.error('Error in reportError:', e);
      return null;
    }
  }, []);
  
  /**
   * Handle a network error
   * @param error - Error object or message
   * @param metadata - Additional metadata
   * @param showAlert - Whether to show an alert to the user
   */
  const handleNetworkError = useCallback((
    error: Error | string,
    metadata?: Record<string, any>,
    showAlert: boolean = true,
  ) => {
    return reportError(
      error,
      ErrorType.NETWORK,
      ErrorSeverity.MEDIUM,
      metadata,
      showAlert,
    );
  }, [reportError]);
  
  /**
   * Handle an API error
   * @param error - Error object or message
   * @param metadata - Additional metadata
   * @param showAlert - Whether to show an alert to the user
   */
  const handleApiError = useCallback((
    error: Error | string,
    metadata?: Record<string, any>,
    showAlert: boolean = true,
  ) => {
    return reportError(
      error,
      ErrorType.API,
      ErrorSeverity.MEDIUM,
      metadata,
      showAlert,
    );
  }, [reportError]);
  
  /**
   * Handle an authentication error
   * @param error - Error object or message
   * @param metadata - Additional metadata
   * @param showAlert - Whether to show an alert to the user
   */
  const handleAuthError = useCallback((
    error: Error | string,
    metadata?: Record<string, any>,
    showAlert: boolean = true,
  ) => {
    return reportError(
      error,
      ErrorType.AUTH,
      ErrorSeverity.HIGH,
      metadata,
      showAlert,
    );
  }, [reportError]);
  
  /**
   * Set whether error reporting is enabled
   * @param enabled - Whether error reporting is enabled
   */
  const setErrorReportingEnabled = useCallback(async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem('error_reporting_enabled', enabled ? 'true' : 'false');
      
      // In a real app, you would update your error reporting service
      // For example:
      // if (enabled) {
      //   Sentry.enableNativeIntegrations();
      // } else {
      //   Sentry.disableNativeIntegrations();
      // }
    } catch (error) {
      console.error('Error setting error reporting enabled:', error);
    }
  }, []);
  
  /**
   * Clear the last error
   */
  const clearLastError = useCallback(() => {
    setLastError(null);
  }, []);
  
  return {
    lastError,
    errorCount,
    reportError,
    handleNetworkError,
    handleApiError,
    handleAuthError,
    setErrorReportingEnabled,
    clearLastError,
    ErrorType,
    ErrorSeverity,
  };
};
