import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { initializeFirebase } from './services/firebase';
import NotificationManager from './components/NotificationManager';
import FCMTestScreen from './screens/FCMTestScreen';
import IAPTestScreen from './screens/IAPTestScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'fcm' | 'iap'>('home');
  
  useEffect(() => {
    // Initialize Firebase when the app starts
    const setupFirebase = async () => {
      try {
        await initializeFirebase();
        console.log('Firebase successfully initialized');
      } catch (error) {
        console.error('Failed to initialize Firebase:', error);
      }
    };
    
    setupFirebase();
  }, []);

  if (currentScreen === 'fcm') {
    return (
      <>
        <FCMTestScreen />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </>
    );
  }
  
  if (currentScreen === 'iap') {
    return (
      <>
        <IAPTestScreen />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Corp Astro Mobile</Text>
        <Text style={styles.subHeaderText}>Firebase Cloud Messaging Demo</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.testButton}
        onPress={() => setCurrentScreen('fcm')}
      >
        <Text style={styles.testButtonText}>Open FCM Test Screen</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.testButton, { backgroundColor: '#2196f3' }]}
        onPress={() => setCurrentScreen('iap')}
      >
        <Text style={styles.testButtonText}>Open IAP Test Screen</Text>
      </TouchableOpacity>
      
      <ScrollView style={styles.content}>
        <NotificationManager />
      </ScrollView>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#4a90e2',
    margin: 16,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 8,
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
});
