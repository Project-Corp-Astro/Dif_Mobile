import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { useUserStore } from '../state/userStore';

// User type definition
interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  zodiacSign?: string;
  createdAt?: string;
  preferences?: {
    notifications?: boolean;
    darkMode?: boolean;
    [key: string]: any;
  };
}

// In a real app, these would be in environment variables
const SUPABASE_URL = 'https://your-supabase-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync('auth_token');
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        
        if (!token || !refreshToken) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        // Validate token or refresh if needed
        const { data, error } = await supabase.auth.getUser(token);
        
        if (error || !data.user) {
          // Token is invalid, try to refresh
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
            refresh_token: refreshToken,
          });
          
          if (refreshError || !refreshData.session) {
            // Refresh failed, user needs to login again
            await logout();
            return;
          }
          
          // Save new tokens
          await SecureStore.setItemAsync('auth_token', refreshData.session.access_token);
          await SecureStore.setItemAsync('refresh_token', refreshData.session.refresh_token);
          
          // Fetch user profile
          if (refreshData.user) {
            await refreshProfile(refreshData.user.id);
          }
        } else {
          // Token is valid
          await refreshProfile(data.user.id);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Fetch user profile from database
  const refreshProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error || !data) {
        throw new Error('Failed to fetch user profile');
      }
      
      setUser({
        id: userId,
        email: data.email,
        name: data.full_name,
        avatarUrl: data.avatar_url,
        zodiacSign: data.zodiac_sign || 'Aries',
        createdAt: data.created_at,
      });
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // We can't call logout here as it would create a circular dependency
      setIsAuthenticated(false);
      clearUser(); // Use the clearUser function from userStore instead of setUser(null)
    }
  }, [clearUser, setUser, setIsAuthenticated]);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error || !data.session) {
        throw new Error(error?.message || 'Failed to login');
      }
      
      // Save tokens to secure storage
      await SecureStore.setItemAsync('auth_token', data.session.access_token);
      await SecureStore.setItemAsync('refresh_token', data.session.refresh_token);
      
      // Fetch user profile
      await refreshProfile(data.user.id);
      
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [refreshProfile, setIsLoading]);

  // Register function
  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error || !data.user) {
        throw new Error(error?.message || 'Failed to register');
      }
      
      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email,
          full_name: name,
          created_at: new Date().toISOString(),
        },
      ]);
      
      if (profileError) {
        throw new Error('Failed to create user profile');
      }
      
      // Fetch user profile
      if (data.session) {
        // Save tokens to secure storage
        await SecureStore.setItemAsync('auth_token', data.session.access_token);
        await SecureStore.setItemAsync('refresh_token', data.session.refresh_token);
      }
      
      await refreshProfile(data.user.id);
      
      return data.user;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [refreshProfile, setIsLoading]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear tokens from secure storage
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('refresh_token');
      
      // Clear user from store
      clearUser();
      
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [clearUser]);

  // Reset password function
  const resetPassword = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'corpastro://reset-password-confirmation',
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to send reset password email');
      }
      
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  return {
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    resetPassword,
  };
};
