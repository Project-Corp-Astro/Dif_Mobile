import { useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { useTheme } from 'tamagui';

interface ColorSchemeOptions {
  initialColorScheme?: ColorSchemeName;
}

export function useColorScheme(options: ColorSchemeOptions = {}) {
  const { initialColorScheme } = options;
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    initialColorScheme || Appearance.getColorScheme() || 'light'
  );
  const theme = useTheme();
  
  // Set up listener for system color scheme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      if (newColorScheme) {
        setColorScheme(newColorScheme);
      }
    });
    
    return () => subscription.remove();
  }, []);
  
  // Toggle between light and dark
  const toggleColorScheme = () => {
    setColorScheme(prevScheme => (prevScheme === 'dark' ? 'light' : 'dark'));
  };
  
  // Set to a specific scheme
  const setColorSchemeValue = (scheme: ColorSchemeName) => {
    setColorScheme(scheme);
  };
  
  // Check if dark mode
  const isDarkMode = colorScheme === 'dark';
  
  return {
    colorScheme,
    isDarkMode,
    toggleColorScheme,
    setColorScheme: setColorSchemeValue,
    theme
  };
}
