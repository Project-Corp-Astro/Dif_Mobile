import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationApi } from './notificationApi';

// Key for storing the FCM token
const FCM_TOKEN_KEY = 'fcm_token';

/**
 * Service to handle Firebase Cloud Messaging (FCM) functionality
 */
export class FirebaseMessagingService {
  /**
   * Request notification permissions from the user
   * @returns boolean indicating if permissions were granted
   */
  static async requestPermissions(): Promise<boolean> {
    // On iOS, we need to request permissions
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      
      const enabled = 
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        
      return enabled;
    }
    
    // On Android, permissions are granted by default
    return true;
  }

  /**
   * Get the FCM token for this device
   * @returns The FCM token string
   */
  static async getFCMToken(): Promise<string> {
    // First check if we have a token stored
    const storedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);
    
    if (storedToken) {
      return storedToken;
    }
    
    // If no stored token, get a new one
    const fcmToken = await messaging().getToken();
    
    // Store the token for future use
    await AsyncStorage.setItem(FCM_TOKEN_KEY, fcmToken);
    
    return fcmToken;
  }
  
  /**
   * Register FCM token with backend
   * @returns Promise that resolves when registration is complete
   */
  static async registerTokenWithBackend(): Promise<void> {
    try {
      const fcmToken = await this.getFCMToken();
      await NotificationApi.registerFCMToken(fcmToken);
      console.log('FCM token registered with backend successfully');
    } catch (error) {
      console.error('Failed to register FCM token with backend:', error);
      // Don't throw the error - we want the app to continue even if registration fails
    }
  }

  /**
   * Set up foreground notification handler
   * @param callback Function to call when a notification is received in foreground
   */
  static onForegroundMessage(callback: (message: any) => void): () => void {
    return messaging().onMessage(async remoteMessage => {
      callback(remoteMessage);
    });
  }

  /**
   * Set up background notification handler
   */
  static setBackgroundMessageHandler(callback: (message: any) => void): void {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      callback(remoteMessage);
    });
  }

  /**
   * Set up notification tap handler
   * @param callback Function to call when a notification is tapped
   */
  static onNotificationTap(callback: (message: any) => void): () => void {
    return messaging().onNotificationOpenedApp(remoteMessage => {
      callback(remoteMessage);
    });
  }

  /**
   * Check if the app was opened from a notification
   * @param callback Function to call if app was opened from notification
   */
  static async checkInitialNotification(callback: (message: any) => void): Promise<void> {
    const remoteMessage = await messaging().getInitialNotification();
    
    if (remoteMessage) {
      callback(remoteMessage);
    }
  }

  /**
   * Subscribe to a topic for topic-based messaging
   * @param topic The topic to subscribe to
   */
  static async subscribeToTopic(topic: string): Promise<void> {
    await messaging().subscribeToTopic(topic);
  }

  /**
   * Unsubscribe from a topic
   * @param topic The topic to unsubscribe from
   */
  static async unsubscribeFromTopic(topic: string): Promise<void> {
    await messaging().unsubscribeFromTopic(topic);
  }
}

export default FirebaseMessagingService;
