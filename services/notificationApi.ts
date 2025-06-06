import axios from 'axios';
import { API_URL } from '../config';
import { getAuthToken } from './authService';

/**
 * API service for notification-related backend calls
 */
export const NotificationApi = {
  /**
   * Register FCM token with the backend
   * @param fcmToken The FCM token to register
   * @returns Promise that resolves when registration is complete
   */
  async registerFCMToken(fcmToken: string): Promise<void> {
    try {
      const token = await getAuthToken();
      
      await axios.post(
        `${API_URL}/notifications/fcm-token`,
        { fcmToken },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('FCM token registered with backend');
    } catch (error) {
      console.error('Error registering FCM token:', error);
      throw error;
    }
  },

  /**
   * Update notification preferences
   * @param preferences Notification preference settings
   * @returns Promise that resolves when update is complete
   */
  async updateNotificationPreferences(preferences: {
    enabled: boolean;
    dailyHoroscope?: boolean;
    weeklyHoroscope?: boolean;
    specialEvents?: boolean;
    promotions?: boolean;
  }): Promise<void> {
    try {
      const token = await getAuthToken();
      
      await axios.put(
        `${API_URL}/notifications/preferences`,
        { notificationPreferences: preferences },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Notification preferences updated');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  },

  /**
   * Request a test notification to be sent
   * @returns Promise that resolves when test notification is sent
   */
  async requestTestNotification(): Promise<void> {
    try {
      const token = await getAuthToken();
      const userId = await getUserId(); // You'll need to implement this function
      
      await axios.post(
        `${API_URL}/notifications/test/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Test notification requested');
    } catch (error) {
      console.error('Error requesting test notification:', error);
      throw error;
    }
  }
};

// Helper function to get the current user ID
// This is a placeholder - implement based on your auth system
async function getUserId(): Promise<string> {
  // Replace with your actual implementation
  return 'current-user-id';
}

export default NotificationApi;
