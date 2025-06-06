// Temporarily mocking expo-haptics to fix startup issues
import { Platform } from 'react-native';

// Mock Haptics enum types
const MockHaptics = {
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy'
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error'
  }
};

/**
 * Hook to provide haptic feedback throughout the app
 */
export const useHaptics = () => {
  // Check if device supports haptics
  const isHapticsSupported = Platform.OS !== 'web';

  /**
   * Trigger light impact feedback
   * Use for subtle interactions like button presses
   */
  const lightImpact = () => {
    // Mock implementation - no actual haptic feedback
    console.log('Light haptic impact');
  };

  /**
   * Trigger medium impact feedback
   * Use for more significant interactions like toggling settings
   */
  const mediumImpact = () => {
    // Mock implementation - no actual haptic feedback
    console.log('Medium haptic impact');
  };

  /**
   * Trigger heavy impact feedback
   * Use for major interactions like completing actions
   */
  const heavyImpact = () => {
    // Mock implementation - no actual haptic feedback
    console.log('Heavy haptic impact');
  };

  /**
   * Trigger success notification feedback
   * Use for successful operations
   */
  const successNotification = () => {
    // Mock implementation - no actual haptic feedback
    console.log('Success haptic notification');
  };

  /**
   * Trigger warning notification feedback
   * Use for warnings or important alerts
   */
  const warningNotification = () => {
    // Mock implementation - no actual haptic feedback
    console.log('Warning haptic notification');
  };

  /**
   * Trigger error notification feedback
   * Use for errors or failed operations
   */
  const errorNotification = () => {
    // Mock implementation - no actual haptic feedback
    console.log('Error haptic notification');
  };

  /**
   * Trigger selection feedback
   * Use for selection changes
   */
  const selection = () => {
    // Mock implementation - no actual haptic feedback
    console.log('Selection haptic feedback');
  };

  return {
    isHapticsSupported,
    lightImpact,
    mediumImpact,
    heavyImpact,
    successNotification,
    warningNotification,
    errorNotification,
    selection,
  };
};
