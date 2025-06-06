import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useUserStore } from '@state/userStore';
import FirebaseMessagingService from '../services/firebaseMessaging';

/**
 * Hook to handle Firebase Cloud Messaging (FCM) functionality
 */
export const useFCM = () => {
  const [fcmToken, setFcmToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<any | undefined>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const user = useUserStore((state) => state.user);

  /**
   * Register for push notifications
   */
  const registerForPushNotifications = async () => {
    try {
      // Request permissions
      const permissionsGranted = await FirebaseMessagingService.requestPermissions();
      
      if (!permissionsGranted) {
        console.log('Push notification permissions denied');
        setNotificationsEnabled(false);
        return;
      }
      
      // Get FCM token
      const token = await FirebaseMessagingService.getFCMToken();
      setFcmToken(token);
      
      // If we have a user, send the token to the backend
      if (user?.id) {
        // Register the token with our backend
        await FirebaseMessagingService.registerTokenWithBackend();
      }
      
      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  };

  /**
   * Handle notification when received
   */
  const handleNotification = (message: any) => {
    console.log('Notification received:', message);
    setNotification(message);
    
    // On iOS, we need to display the notification manually when the app is in foreground
    if (Platform.OS === 'ios' && message.notification) {
      Alert.alert(
        message.notification.title || 'New Notification',
        message.notification.body || '',
        [{ text: 'OK' }]
      );
    }
  };

  /**
   * Handle notification when tapped
   */
  const handleNotificationTap = (message: any) => {
    console.log('Notification tapped:', message);
    
    // Handle deep linking or navigation based on the notification data
    if (message.data && message.data.screen) {
      // TODO: Navigate to the appropriate screen
      console.log(`Navigate to ${message.data.screen}`);
    }
  };

  /**
   * Toggle notifications on/off
   */
  const toggleNotifications = async () => {
    if (notificationsEnabled) {
      // Disable notifications
      setNotificationsEnabled(false);
      // TODO: Unsubscribe from topics or tell backend to stop sending notifications
    } else {
      // Enable notifications
      const permissionsGranted = await FirebaseMessagingService.requestPermissions();
      setNotificationsEnabled(permissionsGranted);
      
      if (permissionsGranted) {
        registerForPushNotifications();
      }
    }
  };

  // Initialize FCM when the component mounts
  useEffect(() => {
    // Register for push notifications
    registerForPushNotifications();
    
    // Set up foreground notification handler
    const unsubscribeForeground = FirebaseMessagingService.onForegroundMessage(handleNotification);
    
    // Set up notification tap handler
    const unsubscribeNotificationTap = FirebaseMessagingService.onNotificationTap(handleNotificationTap);
    
    // Check if app was opened from a notification
    FirebaseMessagingService.checkInitialNotification(handleNotificationTap);
    
    // Set up background notification handler
    FirebaseMessagingService.setBackgroundMessageHandler(handleNotification);
    
    // Clean up listeners when component unmounts
    return () => {
      unsubscribeForeground();
      unsubscribeNotificationTap();
    };
  }, [user?.id]);

  return {
    fcmToken,
    notification,
    notificationsEnabled,
    registerForPushNotifications,
    toggleNotifications
  };
};

export default useFCM;
