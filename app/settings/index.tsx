import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { Button, YStack, XStack, Separator, Switch, Text, ScrollView, View } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import type { IconProps } from '@expo/vector-icons/build/createIconSet';

import { useUserStore } from '@state/userStore';
import { updateUserSettings } from '@services/userService';
import { useHaptics } from '@hooks/useHaptics';

type SettingType = 'notifications' | 'darkMode' | 'biometrics';

export default function SettingsScreen() {
  const user = useUserStore((state) => state.user);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const { successNotification, errorNotification } = useHaptics();
  
  // Update settings mutation
  const { mutate: updateSettings, isPending } = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: () => {
      successNotification();
    },
    onError: () => {
      errorNotification();
      Alert.alert('Error', 'Failed to update settings');
    },
  });

  const handleToggleSetting = (setting: SettingType, value: boolean) => {
    switch(setting) {
      case 'notifications':
        setNotificationsEnabled(value);
        break;
      case 'darkMode':
        setDarkModeEnabled(value);
        break;
      case 'biometrics':
        setBiometricsEnabled(value);
        break;
    }

    updateSettings({
      userId: user?.id || '',
      settings: {
        [setting]: value
      }
    });
  };

  // Define a type for the Ionicons names we're using
  type IconName = 'notifications-outline' | 'moon-outline' | 'finger-print-outline' | 
                 'person-outline' | 'lock-closed-outline' | 'star-outline' | 
                 'help-circle-outline' | 'chatbox-outline' | 'information-circle-outline' | 
                 'chevron-forward';
  
  const renderSettingItem = (icon: IconName, title: string, description: string, value: boolean, setting: SettingType) => (
    <View>
      <XStack padding="$4" alignItems="center">
        <View backgroundColor="$blue2" padding="$2" borderRadius="$4" marginRight="$3">
          <Ionicons name={icon} size={22} color="#6366f1" />
        </View>
        <YStack flex={1}>
          <Text fontSize="$4" fontWeight="$6" color="$gray12">{title}</Text>
          <Text fontSize="$3" color="$gray10">{description}</Text>
        </YStack>
        <Switch 
          checked={value} 
          onCheckedChange={(checked) => handleToggleSetting(setting, checked)}
          accessibilityLabel={title}
          accessibilityHint={`Toggle ${title.toLowerCase()}`}
          testID={`toggle-${setting}`}
        />
      </XStack>
      <Separator />
    </View>
  );

  // Helper function to render menu items with proper accessibility
  const renderMenuItem = (icon: IconName, title: string, route: string) => (
    <>
      <Button
        unstyled
        onPress={() => router.push(route as any)}
        accessibilityLabel={title}
        accessibilityHint={`Navigate to ${title}`}
        testID={`menu-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <XStack padding="$4" alignItems="center">
          <View backgroundColor="$blue2" padding="$2" borderRadius="$4" marginRight="$3">
            <Ionicons name={icon} size={22} color="#6366f1" />
          </View>
          <Text flex={1} fontSize="$4" color="$gray12">{title}</Text>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </XStack>
      </Button>
      <Separator />
    </>
  );

  return (
    <ScrollView backgroundColor="$gray2" padding="$4">
      <Text fontSize="$5" fontWeight="$7" color="$gray12" marginBottom="$3">App Settings</Text>
      
      <YStack backgroundColor="$background" borderRadius="$4" overflow="hidden" marginBottom="$6">
        {renderSettingItem(
          'notifications-outline', 
          'Push Notifications', 
          'Receive daily horoscope and important updates',
          notificationsEnabled,
          'notifications'
        )}
        
        {renderSettingItem(
          'moon-outline', 
          'Dark Mode', 
          'Switch between light and dark theme',
          darkModeEnabled,
          'darkMode'
        )}
        
        {renderSettingItem(
          'finger-print-outline', 
          'Biometric Authentication', 
          'Use Face ID or Touch ID to secure your account',
          biometricsEnabled,
          'biometrics'
        )}
      </YStack>

      <Text fontSize="$5" fontWeight="$7" color="$gray12" marginBottom="$3">Account</Text>
      
      <YStack backgroundColor="$background" borderRadius="$4" overflow="hidden" marginBottom="$6">
        {renderMenuItem('person-outline', 'Edit Profile', '/(settings)/profile')}
        {renderMenuItem('lock-closed-outline', 'Change Password', '/(settings)/password')}
        {renderMenuItem('star-outline', 'Subscription', '/(settings)/subscription')}
      </YStack>

      <Text fontSize="$5" fontWeight="$7" color="$gray12" marginBottom="$3">Support</Text>
      
      <YStack backgroundColor="$background" borderRadius="$4" overflow="hidden" marginBottom="$6">
        {renderMenuItem('help-circle-outline', 'Help Center', '/(settings)/help')}
        {renderMenuItem('chatbox-outline', 'Send Feedback', '/(settings)/feedback')}
        {renderMenuItem('information-circle-outline', 'About', '/(settings)/about')}
      </YStack>
    </ScrollView>
  );
}

// Define type for the custom Pressable component
interface PressableProps {
  style?: any;
  onPress?: () => void;
  children?: React.ReactNode;
}

// Replace with Tamagui Button that includes haptic feedback
const Pressable = ({ style, onPress, children }: PressableProps) => {
  const haptics = useHaptics();
  
  return (
    <Button
      unstyled
      onPress={() => {
        haptics.selection();
        onPress?.();
      }}
      pressStyle={{ opacity: 0.7 }}
    >
      {children}
    </Button>
  );
};
