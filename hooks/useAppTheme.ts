import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useTheme } from 'tamagui';
import { useThemeStore } from '@state/themeStore';
import { useUserStore } from '@state/userStore';

/**
 * Hook to manage app theme
 * Handles system theme changes and user preferences
 * Integrates with Tamagui theming system
 */
export const useAppTheme = () => {
  const systemColorScheme = useColorScheme();
  const { colorScheme, useSystemTheme, setColorScheme } = useThemeStore();
  const user = useUserStore((state) => state.user);
  const updatePreferences = useUserStore((state) => state.updatePreferences);
  const theme = useTheme();
  
  // Handle system theme changes
  useEffect(() => {
    if (useSystemTheme && systemColorScheme) {
      setColorScheme(systemColorScheme);
    }
  }, [systemColorScheme, useSystemTheme, setColorScheme]);
  
  // Sync theme with user preferences
  useEffect(() => {
    if (user?.preferences?.darkMode !== undefined) {
      const preferredTheme = user.preferences.darkMode ? 'dark' : 'light';
      if (!useSystemTheme && colorScheme !== preferredTheme) {
        setColorScheme(preferredTheme);
      }
    }
  }, [user, colorScheme, useSystemTheme, setColorScheme]);
  
  // Toggle theme and update user preferences
  const toggleTheme = () => {
    const newColorScheme = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(newColorScheme);
    
    // Update user preferences if logged in
    if (user) {
      updatePreferences({ darkMode: newColorScheme === 'dark' });
    }
  };
  
  // Get theme colors from Tamagui theme
  const getThemeColor = (colorName: string) => {
    return theme[colorName] || theme.color;
  };
  
  return {
    colorScheme,
    isDarkMode: colorScheme === 'dark',
    toggleTheme,
    useSystemTheme,
    theme,
    getThemeColor,
  };
};
