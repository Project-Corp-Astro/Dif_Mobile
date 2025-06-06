import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Environment types
export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

// Default configuration
const defaultConfig = {
  // API endpoints
  apiUrl: 'https://api.astro-mobile.com',
  supabaseUrl: 'https://your-supabase-project.supabase.co',
  supabaseAnonKey: 'your-supabase-anon-key',
  
  // Feature flags
  enablePremiumFeatures: false,
  enableBiometricAuth: true,
  enableAnalytics: true,
  enableErrorReporting: true,
  enablePushNotifications: true,
  
  // App settings
  defaultTheme: 'system',
  cacheTimeoutMinutes: 60,
  maxUploadSizeMB: 5,
  
  // Timeouts
  apiTimeoutMs: 10000,
  sessionTimeoutMinutes: 60,
};

// Configuration type
export type AppConfig = typeof defaultConfig;

// Override configurations for different environments
const envConfigs: Record<Environment, Partial<AppConfig>> = {
  [Environment.DEVELOPMENT]: {
    apiUrl: 'http://localhost:3000',
    enableAnalytics: false,
    enableErrorReporting: false,
    apiTimeoutMs: 30000, // Longer timeout for development
  },
  [Environment.STAGING]: {
    apiUrl: 'https://staging-api.astro-mobile.com',
    enableAnalytics: true,
    enableErrorReporting: true,
  },
  [Environment.PRODUCTION]: {
    // Production uses the default config
  },
};

/**
 * Hook for managing app configuration
 */
export const useAppConfig = () => {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [environment, setEnvironment] = useState<Environment>(Environment.DEVELOPMENT);
  const [isLoaded, setIsLoaded] = useState(false);
  const [overrides, setOverrides] = useState<Partial<AppConfig>>({});

  // Determine the current environment
  useEffect(() => {
    const getEnvironment = async () => {
      try {
        // Check if environment is stored in AsyncStorage (for development overrides)
        const storedEnv = await AsyncStorage.getItem('app_environment');
        
        if (storedEnv && Object.values(Environment).includes(storedEnv as Environment)) {
          setEnvironment(storedEnv as Environment);
          return;
        }
        
        // Otherwise determine from Expo release channel or other indicators
        const releaseChannel = Constants.expoConfig?.releaseChannel;
        
        if (releaseChannel === 'production') {
          setEnvironment(Environment.PRODUCTION);
        } else if (releaseChannel === 'staging') {
          setEnvironment(Environment.STAGING);
        } else {
          setEnvironment(Environment.DEVELOPMENT);
        }
      } catch (error) {
        console.error('Error determining environment:', error);
        // Default to development if there's an error
        setEnvironment(Environment.DEVELOPMENT);
      }
    };
    
    getEnvironment();
  }, []);

  // Load configuration based on environment and any stored overrides
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Get any stored configuration overrides
        const storedOverridesJson = await AsyncStorage.getItem('app_config_overrides');
        const storedOverrides = storedOverridesJson ? JSON.parse(storedOverridesJson) : {};
        
        // Merge configurations in order: default -> environment -> stored overrides
        const envConfig = envConfigs[environment] || {};
        const mergedConfig = {
          ...defaultConfig,
          ...envConfig,
          ...storedOverrides,
        };
        
        setOverrides(storedOverrides);
        setConfig(mergedConfig);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading configuration:', error);
        // Use default config if there's an error
        setConfig(defaultConfig);
        setIsLoaded(true);
      }
    };
    
    loadConfig();
  }, [environment]);

  /**
   * Update a configuration value
   * @param key - Configuration key
   * @param value - New value
   * @param persist - Whether to persist the change
   */
  const updateConfig = useCallback(async <K extends keyof AppConfig>(
    key: K,
    value: AppConfig[K],
    persist: boolean = true
  ): Promise<void> => {
    try {
      // Update in memory
      setConfig(prev => ({
        ...prev,
        [key]: value,
      }));
      
      // Update overrides
      const newOverrides = {
        ...overrides,
        [key]: value,
      };
      setOverrides(newOverrides);
      
      // Persist if requested
      if (persist) {
        await AsyncStorage.setItem('app_config_overrides', JSON.stringify(newOverrides));
      }
    } catch (error) {
      console.error(`Error updating configuration key ${key}:`, error);
    }
  }, [overrides]);

  /**
   * Reset configuration to environment defaults
   */
  const resetConfig = useCallback(async (): Promise<void> => {
    try {
      // Clear stored overrides
      await AsyncStorage.removeItem('app_config_overrides');
      
      // Reset to environment defaults
      const envConfig = envConfigs[environment] || {};
      const mergedConfig = {
        ...defaultConfig,
        ...envConfig,
      };
      
      setOverrides({});
      setConfig(mergedConfig);
    } catch (error) {
      console.error('Error resetting configuration:', error);
    }
  }, [environment]);

  /**
   * Change the current environment
   * @param newEnvironment - New environment
   * @param persist - Whether to persist the change
   */
  const changeEnvironment = useCallback(async (
    newEnvironment: Environment,
    persist: boolean = true
  ): Promise<void> => {
    try {
      setEnvironment(newEnvironment);
      
      // Persist if requested
      if (persist) {
        await AsyncStorage.setItem('app_environment', newEnvironment);
      }
      
      // Reset configuration for the new environment
      const envConfig = envConfigs[newEnvironment] || {};
      const mergedConfig = {
        ...defaultConfig,
        ...envConfig,
        ...overrides,
      };
      
      setConfig(mergedConfig);
    } catch (error) {
      console.error('Error changing environment:', error);
    }
  }, [overrides]);

  /**
   * Get app version information
   */
  const getVersionInfo = useCallback(() => {
    const appVersion = Constants.expoConfig?.version || '1.0.0';
    const buildNumber = Platform.select({
      ios: Constants.expoConfig?.ios?.buildNumber || '1',
      android: Constants.expoConfig?.android?.versionCode?.toString() || '1',
      default: '1',
    });
    
    return {
      appVersion,
      buildNumber,
      environment,
      isDebug: __DEV__,
    };
  }, [environment]);

  return {
    config,
    environment,
    isLoaded,
    updateConfig,
    resetConfig,
    changeEnvironment,
    getVersionInfo,
    Environment,
  };
};
