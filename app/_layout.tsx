import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';

// Import our configuration
import { queryClient } from '@lib/queryClient';
import tamaguiConfig from '../tamagui.config';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // Add your custom fonts here
    // 'Inter-Regular': require('@assets/fonts/Inter-Regular.ttf'),
    // 'Inter-Medium': require('@assets/fonts/Inter-Medium.ttf'),
    // 'Inter-Bold': require('@assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after fonts have loaded (or an error occurred)
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Render null until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={tamaguiConfig}>
          <SafeAreaProvider>
            <StatusBar style="auto" />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen
                name="(auth)"
                options={{
                  headerShown: false,
                  animation: 'slide_from_bottom',
                }}
              />
              <Stack.Screen
                name="dashboard"
                options={{
                  headerShown: false,
                  animation: 'fade',
                }}
              />
              <Stack.Screen
                name="horoscope/[date]"
                options={{
                  headerShown: true,
                  headerTitle: 'Daily Horoscope',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen
                name="reports/[month]"
                options={{
                  headerShown: true,
                  headerTitle: 'Monthly Report',
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen
                name="settings"
                options={{
                  headerShown: true,
                  headerTitle: 'Settings',
                  animation: 'slide_from_right',
                }}
              />
            </Stack>
          </SafeAreaProvider>
        </TamaguiProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
