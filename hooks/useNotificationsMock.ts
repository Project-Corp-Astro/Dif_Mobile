import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { useUserStore } from '@state/userStore';

// Mock types to replace Expo Notifications types
type MockNotification = {
  request: {
    content: {
      title: string;
      body: string;
    };
  };
};

// This is a mock version that doesn't use native modules
export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string>('mock-expo-push-token');
  const [notification, setNotification] = useState<MockNotification | undefined>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const user = useUserStore((state) => state.user);

  // Mock function to register for push notifications
  const registerForPushNotifications = async () => {
    console.log('Mock: Registering for push notifications');
    return 'mock-push-token';
  };

  // Mock function to handle notification response
  const handleNotificationResponse = (notification: MockNotification) => {
    console.log('Mock: Handling notification response', notification);
    setNotification(notification);
  };

  // Mock function to toggle notifications
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    console.log(`Mock: Notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`);
  };

  // Mock function to schedule a notification
  const scheduleNotification = async (title: string, body: string) => {
    console.log(`Mock: Scheduling notification - ${title}: ${body}`);
    return true;
  };

  // Mock function to get notification permissions
  const getNotificationPermissions = async () => {
    return { granted: true };
  };

  // Mock function to create Android notification channels
  const createAndroidChannels = async () => {
    if (Platform.OS === 'android') {
      console.log('Mock: Creating Android notification channels');
    }
    return true;
  };

  useEffect(() => {
    // Mock setup
    console.log('Mock: Setting up notifications');
    
    // Mock notification listener
    const mockListener = () => {
      console.log('Mock: Notification listener set up');
    };
    
    return () => {
      console.log('Mock: Cleaning up notification listeners');
    };
  }, []);

  return {
    expoPushToken,
    notification,
    notificationsEnabled,
    registerForPushNotifications,
    handleNotificationResponse,
    toggleNotifications,
    scheduleNotification,
    getNotificationPermissions,
    createAndroidChannels
  };
};

export default useNotifications;
