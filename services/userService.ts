import { supabase } from './supabaseClient';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { getPublicUrl, uploadFile } from './supabaseClient';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  zodiacSign: string;
  birthDate?: string;
  preferences?: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  notifications: boolean;
  darkMode: boolean;
  biometrics: boolean;
  language: string;
}

/**
 * Fetch user profile
 * @param userId - User ID
 */
export const fetchUserProfile = async (userId: string): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      throw new Error('Failed to fetch user profile');
    }
    
    return {
      id: data.id,
      email: data.email,
      name: data.full_name,
      avatarUrl: data.avatar_url,
      zodiacSign: data.zodiac_sign || 'Aries',
      birthDate: data.birth_date,
      preferences: data.preferences || {
        notifications: true,
        darkMode: false,
        biometrics: true,
        language: 'en',
      },
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param userId - User ID
 * @param updates - Profile updates
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<User>
): Promise<User> => {
  try {
    // Transform updates to match database schema
    const dbUpdates: any = {};
    
    if (updates.name) dbUpdates.full_name = updates.name;
    if (updates.zodiacSign) dbUpdates.zodiac_sign = updates.zodiacSign;
    if (updates.birthDate) dbUpdates.birth_date = updates.birthDate;
    if (updates.avatarUrl) dbUpdates.avatar_url = updates.avatarUrl;
    
    const { data, error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      throw new Error('Failed to update user profile');
    }
    
    return {
      id: data.id,
      email: data.email,
      name: data.full_name,
      avatarUrl: data.avatar_url,
      zodiacSign: data.zodiac_sign,
      birthDate: data.birth_date,
      preferences: data.preferences,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Update user settings
 * @param params - Parameters containing userId and settings to update
 */
export const updateUserSettings = async (params: {
  userId: string;
  settings: Partial<UserPreferences>;
}): Promise<UserPreferences> => {
  try {
    const { userId, settings } = params;
    
    // First get current preferences
    const { data: userData, error: fetchError } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', userId)
      .single();
    
    if (fetchError) {
      throw new Error('Failed to fetch user preferences');
    }
    
    // Merge current preferences with updates
    const updatedPreferences = {
      ...(userData.preferences || {
        notifications: true,
        darkMode: false,
        biometrics: true,
        language: 'en',
      }),
      ...settings,
    };
    
    // Update preferences in database
    const { data, error } = await supabase
      .from('profiles')
      .update({ preferences: updatedPreferences })
      .eq('id', userId)
      .select('preferences')
      .single();
    
    if (error) {
      throw new Error('Failed to update user preferences');
    }
    
    return data.preferences;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

/**
 * Update user's zodiac sign
 * @param userId - User ID
 * @param zodiacSign - New zodiac sign
 */
export const updateZodiacSign = async (
  userId: string,
  zodiacSign: string
): Promise<User> => {
  return updateUserProfile(userId, { zodiacSign });
};

/**
 * Upload user avatar
 * @param userId - User ID
 */
export const uploadUserAvatar = async (userId: string): Promise<string> => {
  try {
    // Request permission to access the photo library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      throw new Error('Permission to access photos was denied');
    }
    
    // Launch the image picker
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (pickerResult.canceled) {
      throw new Error('Image selection was cancelled');
    }
    
    // Get the selected image
    const image = pickerResult.assets[0];
    
    // Convert image to blob
    const fileExtension = image.uri.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExtension}`;
    
    // For web, we can use fetch to get the blob
    if (Platform.OS === 'web') {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob);
      
      if (error) {
        throw new Error('Failed to upload avatar');
      }
      
      // Get public URL
      const avatarUrl = getPublicUrl('avatars', data.path);
      
      // Update user profile with new avatar URL
      await updateUserProfile(userId, { avatarUrl });
      
      return avatarUrl;
    } 
    // For native platforms, we need to read the file first
    else {
      const base64 = await FileSystem.readAsStringAsync(image.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Convert base64 to blob
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function() {
          reject(new Error('Failed to convert base64 to blob'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', `data:image/jpeg;base64,${base64}`, true);
        xhr.send(null);
      });
      
      // Upload to Supabase Storage
      const result = await uploadFile('avatars', fileName, blob as any);
      
      // Get public URL
      const avatarUrl = getPublicUrl('avatars', result.path);
      
      // Update user profile with new avatar URL
      await updateUserProfile(userId, { avatarUrl });
      
      return avatarUrl;
    }
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

/**
 * Delete user account
 * @param userId - User ID
 */
export const deleteUserAccount = async (userId: string): Promise<void> => {
  try {
    // In a real app, this would involve multiple steps:
    // 1. Delete user data from various tables
    // 2. Delete user authentication record
    // For now, we'll just simulate the process
    
    // Delete user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    
    if (profileError) {
      throw new Error('Failed to delete user profile');
    }
    
    // In a real app, you would also delete the auth record
    // This requires admin privileges, so it's typically done on the server
    // await supabase.auth.admin.deleteUser(userId);
    
    // For now, we'll just sign out the user
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error deleting user account:', error);
    throw error;
  }
};
