import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { YStack, XStack, Text, Button, Card, Separator, Sheet, Avatar, Switch, useTheme, ScrollView, Spinner, H2, H3, Paragraph, View } from 'tamagui';
import { useAuth } from '../../hooks/useAuth';
import { useHaptics } from '../../hooks/useHaptics';
import { useColorScheme } from '../../hooks/useColorScheme';
import { usePermissions, PermissionType, PermissionStatus } from '../../hooks/usePermissions';
import { useUserStore } from '../../state/userStore';
import { updateUserSettings, uploadUserAvatar } from '../../services/userService';
import { useAnalytics, AnalyticsEvent } from '../../hooks/useAnalytics';
import { useAppTour, Tour, TourStep } from '../../hooks/useAppTour';
// Using types from userService.ts

// Define the update preferences function type
interface UpdatePreferencesData {
  darkMode?: boolean;
  zodiacSign?: string;
  avatarUrl?: string;
  notifications?: boolean;
  biometrics?: boolean;
  language?: string;
}

// We'll use the real updateUserSettings from userService.ts

export default function ProfileScreen() {
  const { logout } = useAuth();
  const { successNotification, errorNotification, lightImpact } = useHaptics();
  const user = useUserStore((state) => state.user);
  const updateUserPrefs = useUserStore((state) => state.updatePreferences);
  const { isDarkMode, toggleColorScheme } = useColorScheme();
  const theme = useTheme();
  const { requestPermission } = usePermissions();
  const { trackScreenView, trackEvent } = useAnalytics();
  const appTour = useAppTour();
  const [showZodiacSheet, setShowZodiacSheet] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.preferences?.notifications ?? true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(isDarkMode);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  
  // Track screen view and set up app tour with useEffect
  useEffect(() => {
    // Track screen view
    trackScreenView('Profile');
    
    // Set initial state based on user preferences
    if (user?.preferences) {
      setNotificationsEnabled(user.preferences.notifications ?? true);
      setDarkModeEnabled(user.preferences.darkMode ?? isDarkMode);
    }
    
    // Set up app tour for profile screen
    const setupTour = async () => {
      // Check if user has completed the profile tour
      const isCompleted = appTour.completedTours.includes('profile_tour');
      
      if (!isCompleted) {
        // Create tour object with proper typing
        const profileTour: Tour = {
          id: 'profile_tour',
          name: 'Profile Tour',
          steps: [
            {
              id: 'step1',
              targetId: 'profile_header',
              title: 'Profile Settings',
              text: 'This is your profile where you can manage your personal settings',
              order: 1,
              position: 'bottom',
              width: 300,
              height: 100
            },
            {
              id: 'step2',
              targetId: 'notifications_toggle',
              title: 'Notifications',
              text: 'Toggle notifications on or off',
              order: 2,
              position: 'right',
              width: 250,
              height: 80
            },
            {
              id: 'step3',
              targetId: 'dark_mode_toggle',
              title: 'Appearance',
              text: 'Switch between light and dark mode',
              order: 3,
              position: 'right',
              width: 250,
              height: 80
            },
            {
              id: 'step4',
              targetId: 'zodiac_sign',
              title: 'Zodiac Sign',
              text: 'Update your zodiac sign here',
              order: 4,
              position: 'top',
              width: 250,
              height: 80
            }
          ],
          isRequired: false,
          version: '1.0'
        };
        
        // Start the tour with a slight delay
        setTimeout(() => {
          appTour.startTour(profileTour);
        }, 1000);
      }
    };
    
    setupTour();
  }, [trackScreenView, appTour, isDarkMode, user]);
  
  // Update preferences mutation
  const { mutate: updatePreferences, isPending } = useMutation({
    mutationFn: async (data: UpdatePreferencesData) => {
      if (!user?.id) {
        throw new Error('User ID is required');
      }
      
      // Track the settings update event
      trackEvent(AnalyticsEvent.UPDATE_SETTINGS, { settings: data });
      
      // Call the real service function
      return updateUserSettings({
        userId: user.id,
        settings: data
      });
    },
    onSuccess: (updatedPreferences) => {
      // Update local state in Zustand store
      updateUserPrefs(updatedPreferences);
      successNotification();
    },
    onError: (error) => {
      errorNotification();
      Alert.alert('Error', `Failed to update preferences: ${error.message}`);
    },
  });
  
  // Handle toggle functions
  const handleToggleNotifications = useCallback((checked: boolean) => {
    setNotificationsEnabled(checked);
    // Provide haptic feedback
    checked ? successNotification() : lightImpact();
    
    // Track the event
    trackEvent(AnalyticsEvent.UPDATE_SETTINGS, { setting: 'notifications', value: checked });
    
    updatePreferences({
      notifications: checked,
    });
  }, [updatePreferences, successNotification, lightImpact, trackEvent]);

  const handleToggleDarkMode = useCallback((checked: boolean) => {
    setDarkModeEnabled(checked);
    toggleColorScheme();
    
    // Provide appropriate haptic feedback based on state
    checked ? successNotification() : lightImpact();
    
    // Track the event
    trackEvent(AnalyticsEvent.UPDATE_SETTINGS, { setting: 'darkMode', value: checked });
    
    updatePreferences({
      darkMode: checked,
    });
  }, [updatePreferences, toggleColorScheme, successNotification, lightImpact, trackEvent]);

  const handleLogout = useCallback(() => {
    // Provide haptic feedback before logout
    lightImpact();
    
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              successNotification();
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              errorNotification();
              console.error('Error during logout:', error);
            }
          },
        },
      ],
    );
  }, [logout, router, successNotification, errorNotification, lightImpact]);

  // Handle avatar upload with permissions check
  const handleAvatarPress = useCallback(async () => {
    try {
      // Request photo library permission first
      const permissionResult = await requestPermission(
        PermissionType.PHOTO_LIBRARY,
        'We need access to your photos to update your profile picture'
      );
      
      if (permissionResult.status !== PermissionStatus.GRANTED) {
        lightImpact();
        return; // Permission handling is done by the hook
      }
      
      // Track analytics event for permission granted
      trackEvent(AnalyticsEvent.UPDATE_PROFILE, { action: 'permission_granted', permission: 'photo_library' });
      
      setIsAvatarLoading(true);
      lightImpact(); // Provide feedback when starting the process
      
      // Use ImagePicker to select an image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        // Get the selected image URI
        const imageUri = result.assets[0].uri;
        
        // Track analytics event for avatar selection
        trackEvent(AnalyticsEvent.UPDATE_PROFILE, { action: 'select_avatar' });
        
        if (user?.id) {
          // Use the real service to upload avatar
          const avatarUrl = await uploadUserAvatar(user.id);
          
          // Update the user preferences with the new avatar URL
          updatePreferences({
            avatarUrl: avatarUrl
          });
          
          // Show success feedback
          successNotification();
        }
      }
    } catch (error) {
      errorNotification();
      console.error('Avatar upload error:', error);
      Alert.alert('Error', 'Failed to update profile picture');
    } finally {
      setIsAvatarLoading(false);
    }
  }, [errorNotification, successNotification, lightImpact, requestPermission, updatePreferences, user, trackEvent]);

  // Avatar upload completed

  return (
    <YStack flex={1}>
      <View flex={1} backgroundColor="$background">
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          <YStack space="$4" alignItems="center" marginBottom="$6">
            <Button
            unstyled
            onPress={handleAvatarPress} 
            disabled={isAvatarLoading}
            accessibilityLabel="Update profile picture"
            accessibilityHint="Double tap to upload a new profile picture"
            testID="avatar"
            pressStyle={{ opacity: 0.9 }}
            animation="bouncy"
          >
            {isAvatarLoading ? (
              <Avatar circular size="$12" backgroundColor="$gray5">
                <Spinner size="large" color={theme.primary?.val || '#007AFF'} />
              </Avatar>
            ) : (
              <Avatar circular size="$12" backgroundColor="$blue5">
                {user?.avatarUrl ? (
                  <Avatar.Image accessibilityLabel="Profile picture" source={{ uri: user.avatarUrl }} />
                ) : (
                  <Avatar.Fallback backgroundColor="$blue8">
                    <Text color="white" fontSize="$8">{user?.name?.charAt(0) || 'U'}</Text>
                  </Avatar.Fallback>
                )}
                <XStack 
                  position="absolute" 
                  bottom={0} 
                  right={0} 
                  backgroundColor="$primary" 
                  borderRadius="$full"
                  padding="$1.5"
                >
                  <Ionicons name="camera" size={14} color="white" />
                </XStack>
              </Avatar>
            )}
          </Button>

          <H2 marginTop="$3">{user?.name || 'User'}</H2>
          <Paragraph fontSize="$3" color="$gray10">{user?.email || 'email@example.com'}</Paragraph>

          <XStack space="$2" marginTop="$2">
            <Card
              backgroundColor="$blue2"
              paddingHorizontal="$3"
              paddingVertical="$1.5"
              borderRadius="$6"
            >
              <Text color="$blue10" fontWeight="$6">{user?.zodiacSign || 'Aries'}</Text>
            </Card>
            <Button
              onPress={() => {
                successNotification();
                setShowZodiacSheet(true);
              }}
              paddingVertical="$1.5"
              paddingHorizontal="$3"
              backgroundColor="$gray3"
              borderRadius="$6"
              accessibilityLabel="Change zodiac sign"
              accessibilityHint="Opens a menu to select your zodiac sign"
              testID="zodiac-sign-button"
            >
              <Text>Change</Text>
            </Button>
          </XStack>
          </YStack>

          <YStack space="$4" marginTop="$6">
            <Text fontSize="$5" fontWeight="$6" color="$color" marginBottom="$2">Account</Text>

            <Card backgroundColor="$background" borderRadius="$4" overflow="hidden">
              <Button unstyled onPress={() => router.push("/dashboard/profile")}>
                <XStack padding="$4" alignItems="center">
                  <Ionicons name="person-outline" size={22} color="$primary" />
                  <Text flex={1} fontSize="$4" color="$color" marginLeft="$3">Edit Profile</Text>
                  <Ionicons name="chevron-forward" size={20} color="$gray10" />
                </XStack>
              </Button>

              <Separator />

              <Button unstyled onPress={() => router.push("/dashboard/chat")}>
                <XStack padding="$4" alignItems="center">
                  <Ionicons name="star-outline" size={22} color="$primary" />
                  <Text flex={1} fontSize="$4" color="$color" marginLeft="$3">Subscription</Text>
                  <Ionicons name="chevron-forward" size={20} color="$gray10" />
                </XStack>
              </Button>

              <Separator />

              <Button unstyled onPress={() => router.push("/")}>
                <XStack padding="$4" alignItems="center">
                  <Ionicons name="card-outline" size={22} color="$primary" />
                  <Text flex={1} fontSize="$4" color="$color" marginLeft="$3">Payment Methods</Text>
                  <Ionicons name="chevron-forward" size={20} color="$gray10" />
                </XStack>
              </Button>
            </Card>

            <Card marginTop="$6" testID="settings">
              <Text fontSize="$5" fontWeight="$6" padding="$4" borderBottomColor="$borderColor" borderBottomWidth={1}>
                Settings
              </Text>
              <XStack padding="$4" alignItems="center" justifyContent="space-between">
                <XStack alignItems="center">
                  <Ionicons name="notifications-outline" size={22} color="$primary" />
                  <Text fontSize="$4" color="$color" marginLeft="$3">Notifications</Text>
                </XStack>
                {isPending && notificationsEnabled !== undefined ? (
                  <Spinner size="small" color={theme.primary?.val || '#007AFF'} />
                ) : (
                  <Switch
                    size="$4"
                    checked={notificationsEnabled}
                    onCheckedChange={handleToggleNotifications}
                    backgroundColor={notificationsEnabled ? "$blue10" : "$gray5"}
                    borderColor={notificationsEnabled ? "$blue8" : "$gray7"}
                    accessibilityLabel="Toggle notifications"
                    accessibilityHint="Double tap to turn notifications on or off"
                    accessibilityState={{ checked: notificationsEnabled }}
                    testID="notifications-toggle"
                  />
                )}
              </XStack>

              <Separator />

              <XStack padding="$4" alignItems="center" justifyContent="space-between">
                <XStack alignItems="center">
                  <Ionicons name="moon-outline" size={22} color="$primary" />
                  <Text fontSize="$4" color="$color" marginLeft="$3">Dark Mode</Text>
                </XStack>
                {isPending && darkModeEnabled !== undefined ? (
                  <Spinner size="small" color={theme.primary?.val || '#007AFF'} />
                ) : (
                  <Switch
                    size="$4"
                    checked={darkModeEnabled}
                    onCheckedChange={handleToggleDarkMode}
                    backgroundColor={darkModeEnabled ? "$blue10" : "$gray5"}
                    borderColor={darkModeEnabled ? "$blue8" : "$gray7"}
                    accessibilityLabel="Toggle dark mode"
                    accessibilityHint="Double tap to turn dark mode on or off"
                    accessibilityState={{ checked: darkModeEnabled }}
                    testID="dark-mode-toggle"
                  />
                )}
              </XStack>
            </Card>
            
            <Button
              onPress={handleLogout}
              marginTop="$6"
              backgroundColor="$red10"
              color="white"
              icon={<Ionicons name="log-out-outline" size={20} color="white" />}
              disabled={isPending}
              pressStyle={{ opacity: 0.8, scale: 0.98 }}
              animation="bouncy"
              accessibilityLabel="Logout"
              accessibilityHint="Double tap to log out of your account"
              testID="logout"
            >
              {isPending ? 'Logging out...' : 'Logout'}
            </Button>
          </YStack>
        </ScrollView>
      </View>
      
      <Sheet
        open={showZodiacSheet}
        onOpenChange={setShowZodiacSheet}
        snapPoints={[60]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame>
          <Sheet.Handle />
          <YStack padding="$4" space="$4">
            <Text fontSize="$5" fontWeight="$6" textAlign="center">Select Your Zodiac Sign</Text>
            <ScrollView>
              {[
                'Aries', 'Taurus', 'Gemini', 'Cancer', 
                'Leo', 'Virgo', 'Libra', 'Scorpio', 
                'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
              ].map((sign) => (
                <Button
                  key={sign}
                  unstyled
                  onPress={() => {
                    // Track zodiac sign change
                    trackEvent(AnalyticsEvent.CHANGE_ZODIAC_SIGN, { sign });
                    
                    // Update preferences with the new zodiac sign
                    updatePreferences({
                      zodiacSign: sign,
                    });
                    
                    setShowZodiacSheet(false);
                    successNotification();
                  }}
                  testID={`zodiac-sign-${sign}`}
                  accessibilityLabel={`Select ${sign} as your zodiac sign`}
                  accessibilityHint="Double tap to select this zodiac sign"
                >
                  <XStack 
                    padding="$4" 
                    alignItems="center" 
                    justifyContent="space-between" 
                    borderBottomColor="$borderColor" 
                    borderBottomWidth={1}
                  >
                    <Text fontSize="$4" color="$color">{sign}</Text>
                    {user?.zodiacSign === sign && (
                      <Ionicons name="checkmark" size={20} color={theme.primary?.val || "$blue10"} />
                    )}
                  </XStack>
                </Button>
              ))}
            </ScrollView>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
}
