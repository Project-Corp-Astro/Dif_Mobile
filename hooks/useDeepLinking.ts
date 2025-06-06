import { useEffect, useState, useCallback } from 'react';
import { Linking } from 'react-native';
import { router } from 'expo-router';
import { useHaptics } from './useHaptics';

/**
 * Hook for handling deep links in the application
 */
export const useDeepLinking = () => {
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const { mediumImpact } = useHaptics();

  /**
   * Parse a deep link URL and extract path and params
   */
  const parseUrl = useCallback((url: string) => {
    try {
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname;
      
      // Extract query params
      const params: Record<string, string> = {};
      parsedUrl.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      
      return { path, params };
    } catch (error) {
      console.error('Error parsing URL:', error);
      return { path: '', params: {} };
    }
  }, []);

  /**
   * Handle a deep link URL
   */
  const handleUrl = useCallback((url: string) => {
    if (!url) return;
    
    setLastUrl(url);
    mediumImpact();
    
    // Parse the URL
    const { path, params } = parseUrl(url);
    
    // Handle different paths
    if (path.includes('/horoscope')) {
      const sign = params.sign || '';
      if (sign) {
        router.push(`/dashboard/horoscope/${sign}`);
      } else {
        router.push('/dashboard/horoscope');
      }
    } else if (path.includes('/reports')) {
      const month = params.month || '';
      if (month) {
        router.push(`/reports/${month}`);
      } else {
        router.push('/dashboard/reports');
      }
    } else if (path.includes('/chat')) {
      router.push('/dashboard/chat');
    } else if (path.includes('/profile')) {
      router.push('/dashboard/profile');
    } else if (path.includes('/settings')) {
      router.push('/settings');
    } else {
      // Default to dashboard
      router.push('/dashboard');
    }
  }, [parseUrl, mediumImpact]);

  // Handle initial URL
  useEffect(() => {
    const getInitialUrl = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          handleUrl(initialUrl);
        }
      } catch (error) {
        console.error('Error getting initial URL:', error);
      }
    };
    
    getInitialUrl();
  }, [handleUrl]);

  // Listen for URL events
  useEffect(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleUrl(url);
    });
    
    return () => {
      subscription.remove();
    };
  }, [handleUrl]);

  /**
   * Create a deep link URL
   */
  const createDeepLink = useCallback((path: string, params: Record<string, string> = {}) => {
    try {
      // Base URL for the app
      const baseUrl = 'astro-mobile://';
      
      // Create URL with path
      let url = `${baseUrl}${path.startsWith('/') ? path.slice(1) : path}`;
      
      // Add query params if any
      if (Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          searchParams.append(key, value);
        });
        url += `?${searchParams.toString()}`;
      }
      
      return url;
    } catch (error) {
      console.error('Error creating deep link:', error);
      return '';
    }
  }, []);

  return {
    lastUrl,
    handleUrl,
    parseUrl,
    createDeepLink,
  };
};
