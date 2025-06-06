import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Switch, ActivityIndicator, Alert } from 'react-native';
import { useFCM } from '../hooks/useFCM';
import { NotificationApi } from '../services/notificationApi';

/**
 * Component to manage notifications and display notification status
 */
export const NotificationManager: React.FC = () => {
  const { 
    fcmToken, 
    notification, 
    notificationsEnabled, 
    registerForPushNotifications, 
    toggleNotifications 
  } = useFCM();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [isTestingSend, setIsTestingSend] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Display the most recent notification
  const renderNotification = () => {
    if (!notification) {
      return <Text style={styles.noNotification}>No notifications received</Text>;
    }

    return (
      <View style={styles.notificationCard}>
        <Text style={styles.notificationTitle}>
          {notification.notification?.title || 'New Notification'}
        </Text>
        <Text style={styles.notificationBody}>
          {notification.notification?.body || 'No content'}
        </Text>
        {notification.data && (
          <View style={styles.notificationData}>
            <Text style={styles.dataTitle}>Additional Data:</Text>
            {Object.entries(notification.data).map(([key, value]) => (
              <Text key={key} style={styles.dataItem}>
                {key}: {String(value)}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notification Settings</Text>
      </View>

      <View style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
          />
        </View>

        <Button
          title="Register for Notifications"
          onPress={registerForPushNotifications}
          disabled={!notificationsEnabled}
        />
        
        <View style={styles.buttonSpacer} />
        
        <Button
          title="Register Token with Backend"
          onPress={async () => {
            try {
              setIsRegistering(true);
              setBackendStatus('idle');
              await NotificationApi.registerFCMToken(fcmToken || '');
              setBackendStatus('success');
            } catch (error) {
              console.error('Error registering with backend:', error);
              setBackendStatus('error');
            } finally {
              setIsRegistering(false);
            }
          }}
          disabled={!fcmToken || isRegistering}
          color="#4CAF50"
        />
        
        <View style={styles.buttonSpacer} />
        
        <Button
          title="Request Test Notification"
          onPress={async () => {
            try {
              setIsTestingSend(true);
              await NotificationApi.requestTestNotification();
              Alert.alert('Success', 'Test notification requested!');
            } catch (error) {
              console.error('Error requesting test notification:', error);
              Alert.alert('Error', 'Failed to request test notification');
            } finally {
              setIsTestingSend(false);
            }
          }}
          disabled={!fcmToken || isTestingSend}
          color="#2196F3"
        />
        
        {isRegistering && <ActivityIndicator style={styles.loader} />}
        {isTestingSend && <ActivityIndicator style={styles.loader} />}
        
        {backendStatus === 'success' && (
          <Text style={styles.successText}>✓ Token registered with backend</Text>
        )}
        
        {backendStatus === 'error' && (
          <Text style={styles.errorText}>✗ Failed to register with backend</Text>
        )}

        {fcmToken && (
          <View style={styles.tokenContainer}>
            <Text style={styles.tokenLabel}>FCM Token:</Text>
            <Text style={styles.tokenValue}>{fcmToken}</Text>
          </View>
        )}
      </View>

      <View style={styles.notificationSection}>
        <Text style={styles.sectionTitle}>Latest Notification</Text>
        {renderNotification()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonSpacer: {
    height: 10,
  },
  loader: {
    marginTop: 10,
  },
  successText: {
    color: '#4CAF50',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#F44336',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
  },
  tokenContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  tokenLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tokenValue: {
    fontSize: 12,
    color: '#666',
  },
  notificationSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  noNotification: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    marginTop: 24,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notificationBody: {
    fontSize: 14,
    marginBottom: 12,
  },
  notificationData: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
  },
  dataTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dataItem: {
    fontSize: 12,
    color: '#666',
  },
});

export default NotificationManager;
