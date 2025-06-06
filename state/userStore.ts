import { create } from 'zustand';
import { User, UserPreferences } from '../services/userService';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  setUser: (user) => set({ user, error: null }),
  
  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null,
  })),
  
  updatePreferences: (preferences) => set((state) => ({
    user: state.user ? {
      ...state.user,
      preferences: {
        ...(state.user.preferences || {
          notifications: true,
          darkMode: false,
          biometrics: true,
          language: 'en',
        }),
        ...preferences,
      },
    } : null,
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  clearUser: () => set({ user: null, error: null }),
}));
