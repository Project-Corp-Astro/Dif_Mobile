import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Platform,
  Alert
} from 'react-native';
import { NotificationManager } from '../components/NotificationManager';
import FirebaseMessagingService from '../services/firebaseMessaging';
import { useFCM } from '../hooks/useFCM';

/**
 * Screen for testing FCM integration
 */
const FCMTestScreen: React.FC = () => {
  const { fcmToken, notification, registerForPushNotifications } = useFCM();
  const [deviceInfo, setDeviceInfo] = useState<string>('');

  useEffect(() => {
    // Collect device information for debugging
    const deviceType = Platform.OS;
    const deviceVersion = Platform.Version;
    const info = `Device: ${deviceType}, Version: ${deviceVersion}`;
    setDeviceInfo(info);
  }, []);

  const handleTestTopicSubscription = async () => {
    try {
      if (!fcmToken) {
        Alert.alert('Error', 'FCM token not available. Please register for notifications first.');
        return;
      }

      await FirebaseMessagingService.subscribeToTopic('test-topic');
      Alert.alert('Success', 'Subscribed to test-topic successfully');
    } catch (error) {
      console.error('Failed to subscribe to topic:', error);
      Alert.alert('Error', 'Failed to subscribe to topic');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerText}>FCM Integration Test</Text>
          <Text style={styles.subHeaderText}>{deviceInfo}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Actions</Text>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleTestTopicSubscription}
          >
            <Text style={styles.buttonText}>Subscribe to Test Topic</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => {
              Alert.alert(
                'FCM Token', 
                fcmToken || 'No token available', 
                [{ text: 'Copy', onPress: () => {/* Copy to clipboard */} }, { text: 'OK' }]
              );
            }}
          >
            <Text style={styles.buttonText}>Show FCM Token</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.notificationContainer}>
          <NotificationManager />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  notificationContainer: {
    marginTop: 16,
  }
});

export default FCMTestScreen;
