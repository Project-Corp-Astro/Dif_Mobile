import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useHaptics } from '@hooks/useHaptics';
import { useAuth } from '@hooks/useAuth';
import { 
  Text, 
  Button, 
  Input, 
  YStack, 
  XStack, 
  Checkbox, 
  Label,
  Form,
  ScrollView,
  H2,
  Paragraph,
  View
} from 'tamagui';
import { FormItem } from '@components/ui';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register } = useAuth();
  const { errorNotification, successNotification } = useHaptics();

  const handleRegister = async () => {
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      errorNotification();
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      errorNotification();
      return;
    }

    if (!agreeToTerms) {
      setError('You must agree to the Terms and Conditions');
      errorNotification();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Call the register function from useAuth hook
      await register(name, email, password);
      
      // Provide haptic feedback for successful registration
      successNotification();
      
      // Navigate to dashboard
      router.replace('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setError('Failed to register. Please try again.');
      errorNotification();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView flex={1} backgroundColor="$background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        style={{ flex: 1 }}
      >
        <YStack padding="$4" space="$4" width="100%">
          <YStack space="$2">
            <H2 size="$8">Create Account</H2>
            <Paragraph size="$4" color="$gray10">Sign up to get started with Corp Astro</Paragraph>
          </YStack>

          {error && (
            <Text color="$red10" fontSize="$3" marginVertical="$2">
              {error}
            </Text>
          )}

          <Form>
            <YStack space="$4">
              <FormItem label="Full Name" name="name">
                <Input
                  size="$5"
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                  value={name}
                  onChangeText={setName}
                  accessibilityLabel="Full name input field"
                  testID="name-input"
                />
              </FormItem>

              <FormItem label="Email Address" name="email">
                <Input
                  size="$5"
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  accessibilityLabel="Email input field"
                  testID="email-input"
                />
              </FormItem>

              <FormItem label="Password" name="password">
                <Input
                  size="$5"
                  placeholder="Create a password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  accessibilityLabel="Password input field"
                  testID="password-input"
                />
              </FormItem>

              <FormItem label="Confirm Password" name="confirmPassword">
                <Input
                  size="$5"
                  placeholder="Confirm your password"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  accessibilityLabel="Confirm password input field"
                  testID="confirm-password-input"
                />
              </FormItem>

              <XStack space="$2" alignItems="center" marginTop="$2">
                <Checkbox
                  id="agree-terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
                  size="$4"
                  accessibilityLabel="Agree to terms and conditions"
                  testID="agree-terms-checkbox"
                >
                  <Checkbox.Indicator>
                    {agreeToTerms ? <Text>✓</Text> : null}
                  </Checkbox.Indicator>
                </Checkbox>
                <Label 
                  htmlFor="agree-terms" 
                  fontSize="$3" 
                  color="$gray10"
                  onPress={() => setAgreeToTerms(!agreeToTerms)}
                >
                  I agree to the Terms and Privacy Policy
                </Label>
              </XStack>
            </YStack>

            <Button
              backgroundColor="$blue10"
              color="white"
              size="$5"
              onPress={handleRegister}
              disabled={isLoading}
              marginTop="$4"
              marginBottom="$2"
              accessibilityLabel="Create account button"
              testID="register-button"
              pressStyle={{ opacity: 0.8 }}
              animation="bouncy"
            >
              <Text color="white" fontWeight="$6">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </Button>

            <XStack justifyContent="center" space="$2" marginTop="$2">
              <Text color="$gray10" fontSize="$3">Already have an account?</Text>
              <Text 
                color="$blue10" 
                fontSize="$3" 
                fontWeight="$6" 
                onPress={() => router.push('/(auth)/login')}
                accessibilityRole="button"
                accessibilityLabel="Sign in"
                testID="signin-link"
              >
                Sign In
              </Text>
            </XStack>
          </Form>
        </YStack>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

