import { useEffect, useCallback } from 'react';
// Mock Analytics import - replace with actual analytics library when available
const Analytics = {/* Mock implementation */};
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '../state/userStore';

// Mock Analytics implementation for development
// In a real app, you would replace this with a real analytics provider
// like Firebase Analytics, Amplitude, Segment, etc.
const mockAnalytics = {
  logEvent: (eventName: string, properties?: Record<string, any>) => {
    if (__DEV__) {
      console.log(`[Analytics] ${eventName}`, properties);
    }
  },
  setUserProperties: (properties: Record<string, any>) => {
    if (__DEV__) {
      console.log('[Analytics] Set User Properties', properties);
    }
  },
  identify: (userId: string) => {
    if (__DEV__) {
      console.log('[Analytics] Identify User', userId);
    }
  },
};

// Analytics event names
export enum AnalyticsEvent {
  // Screen views
  SCREEN_VIEW = 'screen_view',
  
  // Authentication events
  LOGIN = 'login',
  SIGNUP = 'signup',
  LOGOUT = 'logout',
  PASSWORD_RESET = 'password_reset',
  
  // User events
  UPDATE_PROFILE = 'update_profile',
  UPDATE_SETTINGS = 'update_settings',
  CHANGE_ZODIAC_SIGN = 'change_zodiac_sign',
  
  // Content events
  VIEW_HOROSCOPE = 'view_horoscope',
  VIEW_REPORT = 'view_report',
  SHARE_REPORT = 'share_report',
  DOWNLOAD_REPORT = 'download_report',
  
  // Chat events
  SEND_MESSAGE = 'send_message',
  VIEW_CHAT = 'view_chat',
  
  // Subscription events
  VIEW_SUBSCRIPTION = 'view_subscription',
  START_SUBSCRIPTION = 'start_subscription',
  CANCEL_SUBSCRIPTION = 'cancel_subscription',
  
  // IAP events
  IAP_PRODUCTS_FETCH_START = 'iap_products_fetch_start',
  IAP_PRODUCTS_FETCH_SUCCESS = 'iap_products_fetch_success',
  IAP_PRODUCTS_FETCH_FAILURE = 'iap_products_fetch_failure',
  IAP_PURCHASE_START = 'iap_purchase_start',
  IAP_PURCHASE_SUCCESS = 'iap_purchase_success',
  IAP_PURCHASE_FAILURE = 'iap_purchase_failure',
  IAP_PURCHASE_CANCELLED = 'iap_purchase_cancelled',
  IAP_RESTORE_START = 'iap_restore_start',
  IAP_RESTORE_SUCCESS = 'iap_restore_success',
  IAP_RESTORE_FAILURE = 'iap_restore_failure',
  IAP_RECEIPT_VERIFICATION_START = 'iap_receipt_verification_start',
  IAP_RECEIPT_VERIFICATION_SUCCESS = 'iap_receipt_verification_success',
  IAP_RECEIPT_VERIFICATION_FAILURE = 'iap_receipt_verification_failure',
  IAP_SUBSCRIPTION_STATUS_CHANGED = 'iap_subscription_status_changed',
  
  // App lifecycle events
  APP_OPEN = 'app_open',
  APP_CLOSE = 'app_close',
}

/**
 * Hook for tracking analytics events throughout the app
 */
export const useAnalytics = () => {
  const user = useUserStore((state) => state.user);
  
  // Initialize analytics
  useEffect(() => {
    const initAnalytics = async () => {
      try {
        // Check if user has opted in to analytics
        const analyticsEnabled = await AsyncStorage.getItem('analytics_enabled');
        
        if (analyticsEnabled === 'true') {
          // In a real app, you would initialize your analytics provider here
          // For example:
          // await Analytics.initialize('your-api-key');
          
          // Log app open event
          trackEvent(AnalyticsEvent.APP_OPEN);
        }
      } catch (error) {
        console.error('Error initializing analytics:', error);
      }
    };
    
    initAnalytics();
    
    return () => {
      // Log app close event when component unmounts
      trackEvent(AnalyticsEvent.APP_CLOSE);
    };
  }, []);
  
  // Set user properties when user changes
  useEffect(() => {
    if (user?.id) {
      identifyUser(user.id);
      
      setUserProperties({
        email: user.email,
        zodiacSign: user.zodiacSign,
        // Only include properties that exist on the User type
        // isPremium property removed as it doesn't exist on User type
        createdAt: user.createdAt,
      });
    }
  }, [user]);
  
  /**
   * Track an analytics event
   * @param eventName - Name of the event
   * @param properties - Optional properties to include with the event
   */
  const trackEvent = useCallback((
    eventName: AnalyticsEvent | string,
    properties?: Record<string, any>
  ) => {
    try {
      // Add default properties
      const eventProperties = {
        ...properties,
        platform: Platform.OS,
        appVersion: '1.0.0', // Replace with actual app version
        timestamp: new Date().toISOString(),
      };
      
      // Log the event
      mockAnalytics.logEvent(eventName, eventProperties);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, []);
  
  /**
   * Track a screen view
   * @param screenName - Name of the screen
   * @param properties - Optional properties to include with the event
   */
  const trackScreenView = useCallback((
    screenName: string,
    properties?: Record<string, any>
  ) => {
    trackEvent(AnalyticsEvent.SCREEN_VIEW, {
      screen_name: screenName,
      ...properties,
    });
  }, [trackEvent]);
  
  /**
   * Identify a user
   * @param userId - User ID
   */
  const identifyUser = useCallback((userId: string) => {
    try {
      mockAnalytics.identify(userId);
    } catch (error) {
      console.error('Error identifying user:', error);
    }
  }, []);
  
  /**
   * Set user properties
   * @param properties - User properties
   */
  const setUserProperties = useCallback((properties: Record<string, any>) => {
    try {
      mockAnalytics.setUserProperties(properties);
    } catch (error) {
      console.error('Error setting user properties:', error);
    }
  }, []);
  
  /**
   * Reset analytics (e.g., on logout)
   */
  const resetAnalytics = useCallback(() => {
    try {
      // In a real app, you would reset your analytics provider here
      // For example:
      // Analytics.reset();
      
      console.log('[Analytics] Reset');
    } catch (error) {
      console.error('Error resetting analytics:', error);
    }
  }, []);
  
  /**
   * Enable or disable analytics
   * @param enabled - Whether analytics should be enabled
   */
  const setAnalyticsEnabled = useCallback(async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem('analytics_enabled', enabled ? 'true' : 'false');
      
      if (enabled) {
        // Re-initialize analytics if enabled
        // In a real app, you would initialize your analytics provider here
        
        // Track the opt-in event
        trackEvent('analytics_opt_in');
      } else {
        // Reset analytics if disabled
        resetAnalytics();
        
        // Track the opt-out event before disabling
        trackEvent('analytics_opt_out');
      }
    } catch (error) {
      console.error('Error setting analytics enabled:', error);
    }
  }, [trackEvent, resetAnalytics]);
  
  return {
    trackEvent,
    trackScreenView,
    identifyUser,
    setUserProperties,
    resetAnalytics,
    setAnalyticsEnabled,
    AnalyticsEvent,
  };
};
