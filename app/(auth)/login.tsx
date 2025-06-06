import { useState } from 'react';
import { Platform, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useHaptics } from '@hooks/useHaptics';
import {
  Form,
  Input,
  Button,
  Text,
  YStack,
  XStack,
  Checkbox,
  Label,
  ScrollView,
  View,
  H2,
  Paragraph,
  SizableText
} from 'tamagui';
import { FormItem } from '@components/ui';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const { errorNotification, successNotification } = useHaptics();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      errorNotification();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Call the login function from useAuth hook
      await login(email, password);
      
      // Provide haptic feedback for successful login
      successNotification();
      
      // Navigate to dashboard
      router.replace('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
      errorNotification();
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    router.push('/(auth)/forgot-password');
    // Provide haptic feedback
    successNotification();
  };

  return (
    <ScrollView flex={1} backgroundColor="$background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <YStack padding="$4" justifyContent="center" flex={1} space="$4">
          <YStack space="$2">
            <H2 size="$8">Welcome Back</H2>
            <Paragraph size="$4" color="$gray10">Sign in to continue to your account</Paragraph>
          </YStack>

          {error && (
            <Text color="$red10" fontSize="$3" marginVertical="$2">
              {error}
            </Text>
          )}

          <Form onSubmit={handleLogin}>
            <FormItem name="email" label="Email">
              <Input
                placeholder="Enter your email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                accessibilityLabel="Email input field"
                testID="email-input"
              />
            </FormItem>

            <FormItem name="password" label="Password">
              <Input
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                accessibilityLabel="Password input field"
                testID="password-input"
              />
            </FormItem>

            <XStack justifyContent="space-between" alignItems="center" marginTop="$2">
              <XStack space="$2" alignItems="center">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                  size="$4"
                  accessibilityLabel="Remember me checkbox"
                  testID="remember-me-checkbox"
                >
                  <Checkbox.Indicator>
                    {rememberMe ? <Text>✓</Text> : null}
                  </Checkbox.Indicator>
                </Checkbox>
                <Label htmlFor="remember-me" fontSize="$3" color="$gray10" onPress={() => setRememberMe(!rememberMe)}>
                  Remember me
                </Label>
              </XStack>

              <Text 
                color="$blue10" 
                fontSize="$3" 
                fontWeight="$6" 
                onPress={handleForgotPassword}
                accessibilityRole="button"
                accessibilityLabel="Forgot password"
                testID="forgot-password"
              >
                Forgot Password?
              </Text>
            </XStack>

            <Button
              backgroundColor="$blue10"
              color="white"
              size="$5"
              onPress={handleLogin}
              disabled={isLoading}
              marginTop="$6"
              accessibilityLabel="Sign in button"
              testID="login-button"
              pressStyle={{ opacity: 0.8 }}
              animation="bouncy"
            >
              <Text color="white" fontWeight="$6">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </Button>
          </Form>

          <XStack justifyContent="center" space="$2" marginTop="$4">
            <Text color="$gray10" fontSize="$3">Don't have an account?</Text>
            <Text 
              color="$blue10" 
              fontSize="$3" 
              fontWeight="$6" 
              onPress={() => router.push('/(auth)/register')}
              accessibilityRole="button"
              accessibilityLabel="Sign up"
              testID="signup-link"
            >
              Sign Up
            </Text>
          </XStack>
        </YStack>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
