import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TamaguiProvider } from 'tamagui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import your main app components
import tamaguiConfig from './tamagui.config';
import DashboardScreen from './app/dashboard/index';

// Create a React Query client
const queryClient = new QueryClient();

// Create a stack navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen 
                name="Dashboard" 
                component={DashboardScreen}
                options={{ title: 'Corp Astro' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </QueryClientProvider>
    </TamaguiProvider>
  );
}
