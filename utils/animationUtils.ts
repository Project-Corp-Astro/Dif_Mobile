import { Animated, Easing } from 'react-native';
import { MotiTransition } from 'moti';

/**
 * Utility functions for animations in React Native
 */

/**
 * Create a fade-in animation
 * @param animatedValue - Animated.Value to animate
 * @param duration - Animation duration in ms
 * @param callback - Optional callback function on completion
 */
export const fadeIn = (
  animatedValue: Animated.Value,
  duration: number = 300,
  callback?: () => void
): void => {
  Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    useNativeDriver: true,
    easing: Easing.ease,
  }).start(callback);
};

/**
 * Create a fade-out animation
 * @param animatedValue - Animated.Value to animate
 * @param duration - Animation duration in ms
 * @param callback - Optional callback function on completion
 */
export const fadeOut = (
  animatedValue: Animated.Value,
  duration: number = 300,
  callback?: () => void
): void => {
  Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    useNativeDriver: true,
    easing: Easing.ease,
  }).start(callback);
};

/**
 * Create a slide-in animation from the bottom
 * @param animatedValue - Animated.Value to animate
 * @param fromValue - Starting position value
 * @param toValue - Ending position value
 * @param duration - Animation duration in ms
 * @param callback - Optional callback function on completion
 */
export const slideInFromBottom = (
  animatedValue: Animated.Value,
  fromValue: number = 100,
  toValue: number = 0,
  duration: number = 300,
  callback?: () => void
): void => {
  animatedValue.setValue(fromValue);
  Animated.timing(animatedValue, {
    toValue,
    duration,
    useNativeDriver: true,
    easing: Easing.out(Easing.ease),
  }).start(callback);
};

/**
 * Create a slide-out animation to the bottom
 * @param animatedValue - Animated.Value to animate
 * @param toValue - Ending position value
 * @param duration - Animation duration in ms
 * @param callback - Optional callback function on completion
 */
export const slideOutToBottom = (
  animatedValue: Animated.Value,
  toValue: number = 100,
  duration: number = 300,
  callback?: () => void
): void => {
  Animated.timing(animatedValue, {
    toValue,
    duration,
    useNativeDriver: true,
    easing: Easing.in(Easing.ease),
  }).start(callback);
};

/**
 * Create a pulse animation
 * @param animatedValue - Animated.Value to animate
 * @param minScale - Minimum scale value
 * @param maxScale - Maximum scale value
 * @param duration - Animation duration in ms
 * @param repeat - Whether to repeat the animation
 */
export const pulse = (
  animatedValue: Animated.Value,
  minScale: number = 0.95,
  maxScale: number = 1.05,
  duration: number = 1000,
  repeat: boolean = true
): void => {
  animatedValue.setValue(minScale);
  Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: maxScale,
      duration: duration / 2,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }),
    Animated.timing(animatedValue, {
      toValue: minScale,
      duration: duration / 2,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }),
  ]).start(({ finished }) => {
    if (finished && repeat) {
      pulse(animatedValue, minScale, maxScale, duration, repeat);
    }
  });
};

/**
 * Create a shake animation
 * @param animatedValue - Animated.Value to animate
 * @param intensity - Shake intensity
 * @param duration - Animation duration in ms
 * @param callback - Optional callback function on completion
 */
export const shake = (
  animatedValue: Animated.Value,
  intensity: number = 10,
  duration: number = 500,
  callback?: () => void
): void => {
  Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: intensity,
      duration: duration / 5,
      useNativeDriver: true,
      easing: Easing.bounce,
    }),
    Animated.timing(animatedValue, {
      toValue: -intensity,
      duration: duration / 5,
      useNativeDriver: true,
      easing: Easing.bounce,
    }),
    Animated.timing(animatedValue, {
      toValue: intensity / 2,
      duration: duration / 5,
      useNativeDriver: true,
      easing: Easing.bounce,
    }),
    Animated.timing(animatedValue, {
      toValue: -intensity / 2,
      duration: duration / 5,
      useNativeDriver: true,
      easing: Easing.bounce,
    }),
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: duration / 5,
      useNativeDriver: true,
      easing: Easing.bounce,
    }),
  ]).start(callback);
};

/**
 * Create a spring animation
 * @param animatedValue - Animated.Value to animate
 * @param toValue - Target value
 * @param friction - Spring friction
 * @param tension - Spring tension
 * @param callback - Optional callback function on completion
 */
export const spring = (
  animatedValue: Animated.Value,
  toValue: number = 1,
  friction: number = 7,
  tension: number = 40,
  callback?: () => void
): void => {
  Animated.spring(animatedValue, {
    toValue,
    friction,
    tension,
    useNativeDriver: true,
  }).start(callback);
};

/**
 * Moti transition presets for common animations
 */
export const motiTransitions = {
  // Fade transition
  fade: {
    type: 'timing',
    duration: 300,
  } as MotiTransition,
  
  // Slide transition
  slide: {
    type: 'timing',
    duration: 300,
    delay: 50,
  } as MotiTransition,
  
  // Bounce transition
  bounce: {
    type: 'spring',
    delay: 0,
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  } as MotiTransition,
  
  // Scale transition
  scale: {
    type: 'spring',
    damping: 15,
    mass: 1,
    stiffness: 120,
  } as MotiTransition,
};

/**
 * Animation states for Moti animations
 */
export const motiStates = {
  // Fade states
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  
  // Slide states
  slideInRight: {
    from: { opacity: 0, translateX: 50 },
    to: { opacity: 1, translateX: 0 },
  },
  
  slideInLeft: {
    from: { opacity: 0, translateX: -50 },
    to: { opacity: 1, translateX: 0 },
  },
  
  slideInUp: {
    from: { opacity: 0, translateY: 50 },
    to: { opacity: 1, translateY: 0 },
  },
  
  slideInDown: {
    from: { opacity: 0, translateY: -50 },
    to: { opacity: 1, translateY: 0 },
  },
  
  // Scale states
  scaleIn: {
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
  },
};
