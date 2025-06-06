import { create } from 'zustand';
import { ColorSchemeName } from 'react-native';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  colorScheme: ColorSchemeName;
  useSystemTheme: boolean;
  setColorScheme: (colorScheme: ColorSchemeName) => void;
  setUseSystemTheme: (useSystemTheme: boolean) => void;
  toggleColorScheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      colorScheme: 'light',
      useSystemTheme: true,
      
      setColorScheme: (colorScheme) => set({ colorScheme }),
      
      setUseSystemTheme: (useSystemTheme) => set({ useSystemTheme }),
      
      toggleColorScheme: () => set((state) => ({
        colorScheme: state.colorScheme === 'dark' ? 'light' : 'dark',
        useSystemTheme: false,
      })),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
