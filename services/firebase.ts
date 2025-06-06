import { Platform } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';

/**
 * Initialize Firebase when the app starts
 */
export const initializeFirebase = async () => {
  // Firebase is automatically initialized by the @react-native-firebase/app package
  // when the native Firebase SDKs are included in the project
  
  console.log('Firebase initialized with app:', firebase.app().name);
  
  // Set up background message handler for Android
  if (Platform.OS === 'android') {
    // This needs to be called early in the app lifecycle, before any other Firebase services
    await firebase.messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background message received:', remoteMessage);
      // You can process the message here if needed
      return Promise.resolve();
    });
  }
  
  return firebase;
};

export default initializeFirebase;
