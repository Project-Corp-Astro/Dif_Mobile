import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import { useHaptics } from '@hooks/useHaptics';
import { useAppTheme } from '@hooks/useAppTheme';
import {
  YStack,
  XStack,
  Text,
  Heading,
  Button,
  Card,
  ActionCard,
  Container,
  Screen,
  Section,
  Input,
  FormItem,
  Form,
  FormSection,
  Separator,
  Caption,
  ErrorText,
  LinkText
} from '@components/ui';

export default function TamaguiExampleScreen() {
  const { lightImpact, successNotification } = useHaptics();
  const { colorScheme, isDarkMode, toggleTheme } = useAppTheme();
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = () => {
    // Simple validation
    const errors: Record<string, string> = {};
    if (!formValues.name) errors.name = 'Name is required';
    if (!formValues.email) errors.email = 'Email is required';
    if (formValues.email && !formValues.email.includes('@')) errors.email = 'Invalid email format';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Success
    successNotification();
    console.log('Form submitted:', formValues);
    // Reset form
    setFormValues({ name: '', email: '', message: '' });
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Tamagui Examples' }} />
      
      <ScrollView style={{ flex: 1 }}>
        <Container>
          <Heading size="large" marginBottom="$4">Tamagui UI Components</Heading>
          <Caption>This screen demonstrates the Tamagui components we've created for the migration</Caption>
          
          <Separator marginVertical="$4" />
          
          {/* Theme Toggle */}
          <Section>
            <Heading size="medium">Theme</Heading>
            <XStack alignItems="center" space="$4">
              <Text>Current theme: {isDarkMode ? 'Dark' : 'Light'}</Text>
              <Button 
                variant="outline" 
                onPress={() => {
                  toggleTheme();
                  lightImpact();
                }}
              >
                Toggle Theme
              </Button>
            </XStack>
          </Section>
          
          {/* Typography */}
          <Section>
            <Heading size="medium">Typography</Heading>
            <YStack space="$2">
              <Heading size="xlarge">Heading XLarge</Heading>
              <Heading size="large">Heading Large</Heading>
              <Heading>Heading Default</Heading>
              <Heading size="small">Heading Small</Heading>
              <Text>Regular Text</Text>
              <Caption>Caption Text</Caption>
              <ErrorText>Error Text</ErrorText>
              <LinkText onPress={() => console.log('Link pressed')}>Link Text</LinkText>
            </YStack>
          </Section>
          
          {/* Buttons */}
          <Section>
            <Heading size="medium">Buttons</Heading>
            <YStack space="$2">
              <Button variant="primary" onPress={() => lightImpact()}>Primary Button</Button>
              <Button variant="secondary" onPress={() => lightImpact()}>Secondary Button</Button>
              <Button variant="outline" onPress={() => lightImpact()}>Outline Button</Button>
              <Button variant="ghost" onPress={() => lightImpact()}>Ghost Button</Button>
              <XStack space="$2">
                <Button size="small" variant="primary" onPress={() => lightImpact()}>Small</Button>
                <Button size="medium" variant="primary" onPress={() => lightImpact()}>Medium</Button>
                <Button size="large" variant="primary" onPress={() => lightImpact()}>Large</Button>
              </XStack>
            </YStack>
          </Section>
          
          {/* Cards */}
          <Section>
            <Heading size="medium">Cards</Heading>
            <YStack space="$4">
              <Card>
                <Heading size="small">Basic Card</Heading>
                <Text>This is a basic card component with default styling.</Text>
              </Card>
              
              <Card variant="elevated">
                <Heading size="small">Elevated Card</Heading>
                <Text>This card has elevated styling with more pronounced shadow.</Text>
              </Card>
              
              <ActionCard onPress={() => lightImpact()}>
                <Heading size="small">Action Card</Heading>
                <Text>This is a clickable card. Try tapping it!</Text>
              </ActionCard>
            </YStack>
          </Section>
          
          {/* Form */}
          <Section>
            <Heading size="medium">Form</Heading>
            <Form onSubmit={handleSubmit}>
              <FormSection title="Contact Information">
                <FormItem 
                  label="Name" 
                  name="name"
                  error={formErrors.name}
                >
                  <Input
                    value={formValues.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                    placeholder="Enter your name"
                  />
                </FormItem>
                
                <FormItem 
                  label="Email" 
                  name="email"
                  error={formErrors.email}
                  helper="We'll never share your email"
                >
                  <Input
                    value={formValues.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </FormItem>
                
                <FormItem 
                  label="Message" 
                  name="message"
                >
                  <Input
                    value={formValues.message}
                    onChangeText={(text) => handleInputChange('message', text)}
                    placeholder="Enter your message"
                    multiline
                    numberOfLines={4}
                    height={100}
                    textAlignVertical="top"
                  />
                </FormItem>
                
                <Button 
                  variant="primary" 
                  onPress={handleSubmit}
                  marginTop="$4"
                >
                  Submit Form
                </Button>
              </FormSection>
            </Form>
          </Section>
          
          {/* Containers */}
          <Section>
            <Heading size="medium">Containers</Heading>
            <YStack space="$4">
              <Container variant="card" padding="small">
                <Text>Card Container with small padding</Text>
              </Container>
              
              <Container variant="default" padding="large" backgroundColor="$primary">
                <Text color="white">Colored Container with large padding</Text>
              </Container>
            </YStack>
          </Section>
        </Container>
      </ScrollView>
    </Screen>
  );
}
