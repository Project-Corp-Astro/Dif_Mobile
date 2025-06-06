import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { router } from 'expo-router';
import { Button, YStack, XStack, View, Text, Spinner } from 'tamagui';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useHaptics } from '@hooks/useHaptics';

export default function WelcomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { selection } = useHaptics();

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const token = await SecureStore.getItemAsync('auth_token');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Redirect to dashboard if authenticated
        router.replace('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated]);

  const handleLogin = () => {
    selection();
    router.push('/(auth)/login');
  };

  const handleRegister = () => {
    selection();
    router.push('/(auth)/register');
  };

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="$primary" />
        <Text marginTop="$4" fontSize="$4" color="$primary">Loading...</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background" padding="$5">
      <StatusBar style="light" />
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Image
          source={require('@assets/logo-placeholder.png')}
          style={{ width: 120, height: 120, marginBottom: 20 }}
          resizeMode="contain"
        />
        <Text fontSize="$8" fontWeight="$9" color="$gray12" marginBottom="$2">Corp Astro</Text>
        <Text fontSize="$5" color="$purple10" textAlign="center" marginBottom="$8">Your Personal Astrological Guide</Text>
      </YStack>

      <YStack marginBottom="$10" space="$4">
        <Button
          size="$5"
          theme="active"
          backgroundColor="$primary"
          color="white"
          onPress={handleLogin}
          borderRadius="$6"
          pressStyle={{ opacity: 0.8 }}
          animation="bouncy"
          accessibilityLabel="Sign in"
          testID="sign-in-button"
        >
          <Text color="white" fontWeight="$6">Sign In</Text>
        </Button>
        
        <Button
          size="$5"
          variant="outlined"
          backgroundColor="transparent"
          borderColor="$primary"
          color="$primary"
          onPress={handleRegister}
          borderRadius="$6"
          pressStyle={{ opacity: 0.8 }}
          animation="bouncy"
          accessibilityLabel="Create account"
          testID="create-account-button"
        >
          <Text color="$primary" fontWeight="$6">Create Account</Text>
        </Button>
      </YStack>
    </YStack>
  );
}


