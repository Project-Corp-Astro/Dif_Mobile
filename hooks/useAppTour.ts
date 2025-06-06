import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated, Dimensions, Platform } from 'react-native';
import { useHaptics } from './useHaptics';

// Tour step interface
export interface TourStep {
  id: string;
  targetId: string;
  title: string;
  text: string;
  order: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
  width?: number;
  height?: number;
}

// Tour interface
export interface Tour {
  id: string;
  name: string;
  steps: TourStep[];
  isRequired?: boolean;
  version?: string;
}

/**
 * Hook for managing app tours and feature discovery
 */
export const useAppTour = () => {
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedTours, setCompletedTours] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  
  const { lightImpact, mediumImpact } = useHaptics();
  
  // Load completed tours from storage
  useEffect(() => {
    const loadCompletedTours = async () => {
      try {
        const storedTours = await AsyncStorage.getItem('completed_tours');
        if (storedTours) {
          setCompletedTours(JSON.parse(storedTours));
        }
      } catch (error) {
        console.error('Error loading completed tours:', error);
      }
    };
    
    loadCompletedTours();
  }, []);
  
  // Save completed tours to storage
  const saveCompletedTours = useCallback(async (tours: string[]) => {
    try {
      await AsyncStorage.setItem('completed_tours', JSON.stringify(tours));
      setCompletedTours(tours);
    } catch (error) {
      console.error('Error saving completed tours:', error);
    }
  }, []);
  
  // Start a tour
  const startTour = useCallback((tour: Tour) => {
    setActiveTour(tour);
    setCurrentStep(0);
    setIsVisible(true);
    
    // Animate in
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    
    mediumImpact();
  }, [opacity, scale, mediumImpact]);
  
  // End the current tour
  const endTour = useCallback((markAsCompleted: boolean = true) => {
    // Animate out
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      
      // Mark tour as completed if requested
      if (markAsCompleted && activeTour) {
        const newCompletedTours = [...completedTours, activeTour.id];
        saveCompletedTours(newCompletedTours);
      }
      
      setActiveTour(null);
      setCurrentStep(0);
    });
    
    lightImpact();
  }, [activeTour, completedTours, opacity, scale, saveCompletedTours, lightImpact]);
  
  // Go to the next step in the tour
  const nextStep = useCallback(() => {
    if (!activeTour) return;
    
    const nextStepIndex = currentStep + 1;
    
    if (nextStepIndex < activeTour.steps.length) {
      // Animate out current step
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Move to next step
        setCurrentStep(nextStepIndex);
        
        // Animate in next step
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 7,
            tension: 40,
            useNativeDriver: true,
          }),
        ]).start();
      });
      
      lightImpact();
    } else {
      // End tour if no more steps
      endTour(true);
    }
  }, [activeTour, currentStep, opacity, scale, endTour, lightImpact]);
  
  // Go to the previous step in the tour
  const prevStep = useCallback(() => {
    if (!activeTour) return;
    
    const prevStepIndex = currentStep - 1;
    
    if (prevStepIndex >= 0) {
      // Animate out current step
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Move to previous step
        setCurrentStep(prevStepIndex);
        
        // Animate in previous step
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 7,
            tension: 40,
            useNativeDriver: true,
          }),
        ]).start();
      });
      
      lightImpact();
    }
  }, [activeTour, currentStep, opacity, scale, lightImpact]);
  
  // Skip to a specific step in the tour
  const skipToStep = useCallback((stepIndex: number) => {
    if (!activeTour || stepIndex < 0 || stepIndex >= activeTour.steps.length) return;
    
    // Animate out current step
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Move to specified step
      setCurrentStep(stepIndex);
      
      // Animate in specified step
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    });
    
    lightImpact();
  }, [activeTour, opacity, scale, lightImpact]);
  
  // Check if a tour has been completed
  const isTourCompleted = useCallback((tourId: string) => {
    return completedTours.includes(tourId);
  }, [completedTours]);
  
  // Reset a tour (mark as not completed)
  const resetTour = useCallback((tourId: string) => {
    const newCompletedTours = completedTours.filter(id => id !== tourId);
    saveCompletedTours(newCompletedTours);
  }, [completedTours, saveCompletedTours]);
  
  // Reset all tours
  const resetAllTours = useCallback(() => {
    saveCompletedTours([]);
  }, [saveCompletedTours]);
  
  // Get current step data
  const getCurrentStepData = useCallback(() => {
    if (!activeTour || !activeTour.steps[currentStep]) return null;
    
    return {
      ...activeTour.steps[currentStep],
      isFirstStep: currentStep === 0,
      isLastStep: currentStep === activeTour.steps.length - 1,
      stepNumber: currentStep + 1,
      totalSteps: activeTour.steps.length,
    };
  }, [activeTour, currentStep]);
  
  // Animation values for the tooltip
  const animationValues = {
    opacity,
    scale,
  };
  
  return {
    activeTour,
    currentStep,
    isVisible,
    completedTours,
    startTour,
    endTour,
    nextStep,
    prevStep,
    skipToStep,
    isTourCompleted,
    resetTour,
    resetAllTours,
    getCurrentStepData,
    animationValues,
  };
};
