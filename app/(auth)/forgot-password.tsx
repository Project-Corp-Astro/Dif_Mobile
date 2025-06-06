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
  Form,
  ScrollView,
  H2,
  Paragraph,
  View
} from 'tamagui';
import { FormItem } from '@components/ui';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { resetPassword } = useAuth();
  const { errorNotification, successNotification } = useHaptics();

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      errorNotification();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      // Call the resetPassword function from useAuth hook
      await resetPassword(email);
      
      // Provide haptic feedback for successful submission
      successNotification();
      
      // Show success message
      setSuccess('Password reset instructions have been sent to your email');
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Failed to send reset instructions. Please try again.');
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
        <YStack padding="$4" space="$4" width="100%" justifyContent="center" flex={1}>
          <YStack space="$2">
            <H2 size="$8">Reset Password</H2>
            <Paragraph size="$4" color="$gray10">
              Enter your email address and we'll send you instructions to reset your password
            </Paragraph>
          </YStack>

          {error && (
            <Text color="$red10" fontSize="$3" marginVertical="$2">
              {error}
            </Text>
          )}

          {success && (
            <Text color="$green10" fontSize="$3" marginVertical="$2">
              {success}
            </Text>
          )}

          <Form>
            <YStack space="$4">
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
            </YStack>

            <Button
              backgroundColor="$blue10"
              color="white"
              size="$5"
              onPress={handleResetPassword}
              disabled={isLoading}
              marginTop="$4"
              marginBottom="$2"
              accessibilityLabel="Reset password button"
              testID="reset-password-button"
              pressStyle={{ opacity: 0.8 }}
              animation="bouncy"
            >
              <Text color="white" fontWeight="$6">
                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              </Text>
            </Button>

            <XStack justifyContent="center" space="$2" marginTop="$4">
              <Text 
                color="$blue10" 
                fontSize="$3" 
                fontWeight="$6" 
                onPress={() => router.push('/(auth)/login')}
                accessibilityRole="button"
                accessibilityLabel="Back to login"
                testID="back-to-login-link"
              >
                Back to Login
              </Text>
            </XStack>
          </Form>
        </YStack>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
