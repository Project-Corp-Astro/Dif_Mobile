import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// A simplified version of the app that just shows a basic UI
export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Corp Astro</Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Daily Horoscope</Text>
            <Text style={styles.horoscopeText}>
              Today is a great day for new beginnings. The stars are aligned in your favor,
              and you'll find that projects you start today have a good chance of success.
              Take some time for self-reflection and consider your long-term goals.
            </Text>
          </View>
          
          <View style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>Features</Text>
            
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Personalized Readings</Text>
              <Text style={styles.featureDescription}>
                Get detailed astrological readings customized to your birth chart.
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Daily Notifications</Text>
              <Text style={styles.featureDescription}>
                Receive daily horoscope updates and important celestial events.
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Compatibility Analysis</Text>
              <Text style={styles.featureDescription}>
                Discover how compatible you are with friends, family, and romantic partners.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

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
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  horoscopeText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  featuresContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
});
