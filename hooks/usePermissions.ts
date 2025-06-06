import { useState, useEffect, useCallback } from 'react';
// Import expo packages with type assertions to handle missing types
const Permissions = {} as any; // Replace with actual import when available
import * as ImagePicker from 'expo-image-picker';
const MediaLibrary = {} as any; // Replace with actual import when available
// Using Firebase Messaging instead of Expo Notifications
import messaging from '@react-native-firebase/messaging';
const Location = {} as any; // Replace with actual import when available
const Contacts = {} as any; // Replace with actual import when available
const Calendar = {} as any; // Replace with actual import when available
import { Alert, Linking, Platform } from 'react-native';
import { useHaptics } from './useHaptics';

// Permission types
export enum PermissionType {
  CAMERA = 'camera',
  PHOTO_LIBRARY = 'photoLibrary',
  NOTIFICATIONS = 'notifications',
  LOCATION = 'location',
  CONTACTS = 'contacts',
  CALENDAR = 'calendar',
  MICROPHONE = 'microphone',
}

// Permission status
export enum PermissionStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  UNDETERMINED = 'undetermined',
}

// Permission result
export interface PermissionResult {
  status: PermissionStatus;
  canAskAgain: boolean;
}

/**
 * Hook for managing app permissions
 */
export const usePermissions = () => {
  const [permissionStatuses, setPermissionStatuses] = useState<Record<PermissionType, PermissionResult>>({
    [PermissionType.CAMERA]: { status: PermissionStatus.UNDETERMINED, canAskAgain: true },
    [PermissionType.PHOTO_LIBRARY]: { status: PermissionStatus.UNDETERMINED, canAskAgain: true },
    [PermissionType.NOTIFICATIONS]: { status: PermissionStatus.UNDETERMINED, canAskAgain: true },
    [PermissionType.LOCATION]: { status: PermissionStatus.UNDETERMINED, canAskAgain: true },
    [PermissionType.CONTACTS]: { status: PermissionStatus.UNDETERMINED, canAskAgain: true },
    [PermissionType.CALENDAR]: { status: PermissionStatus.UNDETERMINED, canAskAgain: true },
    [PermissionType.MICROPHONE]: { status: PermissionStatus.UNDETERMINED, canAskAgain: true },
  });
  
  const { mediumImpact, errorNotification, successNotification } = useHaptics();
  
  // Check permission status
  const checkPermission = useCallback(async (type: PermissionType): Promise<PermissionResult> => {
    try {
      let status: PermissionStatus;
      let canAskAgain = true;
      
      switch (type) {
        case PermissionType.CAMERA:
          const cameraPermission = await ImagePicker.getCameraPermissionsAsync();
          status = cameraPermission.status as PermissionStatus;
          canAskAgain = cameraPermission.canAskAgain;
          break;
          
        case PermissionType.PHOTO_LIBRARY:
          const mediaLibraryPermission = await MediaLibrary.getPermissionsAsync();
          status = mediaLibraryPermission.status as PermissionStatus;
          canAskAgain = mediaLibraryPermission.canAskAgain;
          break;
          
        case PermissionType.NOTIFICATIONS:
          const authStatus = await messaging().hasPermission();
          // Convert Firebase permission status to our app's PermissionStatus
          if (authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
              authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
            status = PermissionStatus.GRANTED;
          } else if (authStatus === messaging.AuthorizationStatus.DENIED) {
            status = PermissionStatus.DENIED;
          } else {
            status = PermissionStatus.UNDETERMINED;
          }
          // On iOS, we can always request again via the settings app
          // On Android, it depends on the Android version
          canAskAgain = Platform.OS === 'ios' ? true : authStatus !== messaging.AuthorizationStatus.DENIED;
          break;
          
        case PermissionType.LOCATION:
          const locationPermission = await Location.getForegroundPermissionsAsync();
          status = locationPermission.status as PermissionStatus;
          canAskAgain = locationPermission.canAskAgain;
          break;
          
        case PermissionType.CONTACTS:
          const contactsPermission = await Contacts.getPermissionsAsync();
          status = contactsPermission.status as PermissionStatus;
          canAskAgain = contactsPermission.canAskAgain;
          break;
          
        case PermissionType.CALENDAR:
          const calendarPermission = await Calendar.getCalendarPermissionsAsync();
          status = calendarPermission.status as PermissionStatus;
          canAskAgain = calendarPermission.canAskAgain;
          break;
          
        case PermissionType.MICROPHONE:
          const microphonePermission = await Permissions.getAsync(Permissions.AUDIO_RECORDING);
          status = microphonePermission.status as PermissionStatus;
          canAskAgain = microphonePermission.canAskAgain;
          break;
          
        default:
          status = PermissionStatus.UNDETERMINED;
          canAskAgain = true;
      }
      
      // Update state
      setPermissionStatuses(prev => ({
        ...prev,
        [type]: { status, canAskAgain },
      }));
      
      return { status, canAskAgain };
    } catch (error) {
      console.error(`Error checking ${type} permission:`, error);
      return { status: PermissionStatus.UNDETERMINED, canAskAgain: true };
    }
  }, []);
  
  // Request permission
  const requestPermission = useCallback(async (
    type: PermissionType,
    rationale?: string
  ): Promise<PermissionResult> => {
    try {
      mediumImpact();
      
      let status: PermissionStatus;
      let canAskAgain = true;
      
      // Check current status first
      const currentStatus = await checkPermission(type);
      
      // If already granted, return current status
      if (currentStatus.status === PermissionStatus.GRANTED) {
        return currentStatus;
      }
      
      // If denied and can't ask again, show settings dialog
      if (currentStatus.status === PermissionStatus.DENIED && !currentStatus.canAskAgain) {
        if (rationale) {
          Alert.alert(
            'Permission Required',
            `${rationale} Please enable it in your device settings.`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Settings', onPress: () => Linking.openSettings() },
            ]
          );
        }
        return currentStatus;
      }
      
      // Request permission
      switch (type) {
        case PermissionType.CAMERA:
          const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
          status = cameraPermission.status as PermissionStatus;
          canAskAgain = cameraPermission.canAskAgain;
          break;
          
        case PermissionType.PHOTO_LIBRARY:
          const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
          status = mediaLibraryPermission.status as PermissionStatus;
          canAskAgain = mediaLibraryPermission.canAskAgain;
          break;
          
        case PermissionType.NOTIFICATIONS:
          const authStatus = await messaging().requestPermission();
          // Convert Firebase permission status to our app's PermissionStatus
          if (authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
              authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
            status = PermissionStatus.GRANTED;
          } else if (authStatus === messaging.AuthorizationStatus.DENIED) {
            status = PermissionStatus.DENIED;
          } else {
            status = PermissionStatus.UNDETERMINED;
          }
          // On iOS, we can always request again via the settings app
          // On Android, it depends on the Android version
          canAskAgain = Platform.OS === 'ios' ? true : authStatus !== messaging.AuthorizationStatus.DENIED;
          break;
          
        case PermissionType.LOCATION:
          const locationPermission = await Location.requestForegroundPermissionsAsync();
          status = locationPermission.status as PermissionStatus;
          canAskAgain = locationPermission.canAskAgain;
          break;
          
        case PermissionType.CONTACTS:
          const contactsPermission = await Contacts.requestPermissionsAsync();
          status = contactsPermission.status as PermissionStatus;
          canAskAgain = contactsPermission.canAskAgain;
          break;
          
        case PermissionType.CALENDAR:
          const calendarPermission = await Calendar.requestCalendarPermissionsAsync();
          status = calendarPermission.status as PermissionStatus;
          canAskAgain = calendarPermission.canAskAgain;
          break;
          
        case PermissionType.MICROPHONE:
          const microphonePermission = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
          status = microphonePermission.status as PermissionStatus;
          canAskAgain = microphonePermission.canAskAgain;
          break;
          
        default:
          status = PermissionStatus.UNDETERMINED;
          canAskAgain = true;
      }
      
      // Update state
      setPermissionStatuses(prev => ({
        ...prev,
        [type]: { status, canAskAgain },
      }));
      
      // Provide haptic feedback based on result
      if (status === PermissionStatus.GRANTED) {
        successNotification();
      } else {
        errorNotification();
      }
      
      return { status, canAskAgain };
    } catch (error) {
      console.error(`Error requesting ${type} permission:`, error);
      errorNotification();
      return { status: PermissionStatus.UNDETERMINED, canAskAgain: true };
    }
  }, [checkPermission, mediumImpact, successNotification, errorNotification]);
  
  // Check if permission is granted
  const hasPermission = useCallback((type: PermissionType): boolean => {
    return permissionStatuses[type]?.status === PermissionStatus.GRANTED;
  }, [permissionStatuses]);
  
  // Request multiple permissions
  const requestMultiplePermissions = useCallback(async (
    types: PermissionType[],
    rationale?: string
  ): Promise<Record<PermissionType, PermissionResult>> => {
    const results: Record<PermissionType, PermissionResult> = {
    [PermissionType.CAMERA]: { status: PermissionStatus.UNDETERMINED, canAskAgain: true },
    [PermissionType.PHOTO_LIBRARY]: { status: PermissionStatus.UNDETERMINED, canAskAgain: true },
    [PermissionType.NOTIFICATIONS]: { status: PermissionStatus.UNDETERMINED, canAskAgain: true },
    [PermissionType.LOCATION]: { status: PermissionStatus.UNDETERMINED, canAskAgain: true },
    [PermissionType.CONTACTS]: { status: PermissionStatus.UNDETERMINED, canAskAgain: true },
    [PermissionType.CALENDAR]: { status: PermissionStatus.UNDETERMINED, canAskAgain: true },
    [PermissionType.MICROPHONE]: { status: PermissionStatus.UNDETERMINED, canAskAgain: true }
  };
    
    for (const type of types) {
      results[type] = await requestPermission(type, rationale);
    }
    
    return results;
  }, [requestPermission]);
  
  // Initialize permission statuses
  useEffect(() => {
    const initPermissions = async () => {
      // Only check essential permissions on app start
      await checkPermission(PermissionType.NOTIFICATIONS);
      
      // On iOS, we need to check photo library permission for saving images
      if (Platform.OS === 'ios') {
        await checkPermission(PermissionType.PHOTO_LIBRARY);
      }
    };
    
    initPermissions();
  }, [checkPermission]);
  
  return {
    permissionStatuses,
    checkPermission,
    requestPermission,
    hasPermission,
    requestMultiplePermissions,
    PermissionType,
    PermissionStatus,
  };
};
