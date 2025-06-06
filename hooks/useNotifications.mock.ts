import { useState } from 'react';

// This is a mock version of useNotifications that doesn't use native modules
export const useNotifications = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Mock functions that don't actually use native code
  const registerForPushNotifications = async () => {
    console.log('Mock: Registering for push notifications');
    return 'mock-push-token';
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    console.log(`Mock: Notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`);
  };

  return {
    expoPushToken: 'mock-push-token',
    notification: null,
    notificationsEnabled,
    registerForPushNotifications,
    toggleNotifications
  };
};

export default useNotifications;
