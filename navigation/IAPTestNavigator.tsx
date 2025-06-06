import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import IAPTestScreen from '../screens/IAPTestScreen';
import IAPAnalyticsTestScreen from '../components/IAPAnalyticsTestScreen';

const Stack = createStackNavigator();

/**
 * Navigation stack for testing in-app purchase functionality
 * This allows easy access to the IAP test screen during development
 */
const IAPTestNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="IAPTest" 
        component={IAPTestScreen} 
        options={{ 
          title: 'IAP Testing',
          headerStyle: {
            backgroundColor: '#2196f3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen 
        name="IAPAnalyticsTest" 
        component={IAPAnalyticsTestScreen} 
        options={{ 
          title: 'IAP Analytics Testing',
          headerStyle: {
            backgroundColor: '#2196f3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
    </Stack.Navigator>
  );
};

export default IAPTestNavigator;
