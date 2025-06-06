import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useIAP } from '../hooks/useIAP';
import IAPAnalyticsVerifier from '../scripts/verify_iap_analytics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product } from 'react-native-iap';

// Define the verification results type to match the structure from the verifier
type VerificationResults = {
  summary: {
    totalEvents: number;
    capturedEventTypes: number;
    missingEventTypes: string[];
  };
  details: Record<string, any>;
  funnels: {
    productFetch: boolean;
    purchase: boolean;
    restore: boolean;
    receiptVerification: boolean;
  };
};

/**
 * Test screen for verifying IAP analytics events
 */
const IAPAnalyticsTestScreen = () => {
  const [report, setReport] = useState<string>('No report generated yet');
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<Record<string, string>>({
    productFetch: 'Not tested',
    purchase: 'Not tested',
    restore: 'Not tested',
    receiptVerification: 'Not tested',
  });

  // Get IAP functionality
  const { 
    products, 
    purchaseProduct, 
    restorePurchases, 
    isLoading, 
    error 
  } = useIAP();

  // Start monitoring when component mounts
  useEffect(() => {
    startMonitoring();
    
    // Clean up when component unmounts
    return () => {
      if (isMonitoring) {
        stopMonitoring();
      }
    };
  }, []);

  const startMonitoring = () => {
    try {
      IAPAnalyticsVerifier.verifyIAPAnalytics();
      setIsMonitoring(true);
      Alert.alert('Monitoring Started', 'Now capturing IAP analytics events');
    } catch (err) {
      console.error('Failed to start monitoring:', err);
      Alert.alert('Error', 'Failed to start monitoring analytics events');
    }
  };

  const stopMonitoring = () => {
    try {
      IAPAnalyticsVerifier.stopVerification();
      setIsMonitoring(false);
      Alert.alert('Monitoring Stopped', 'No longer capturing IAP analytics events');
    } catch (err) {
      console.error('Failed to stop monitoring:', err);
    }
  };

  const generateReport = () => {
    try {
      const verificationReport = IAPAnalyticsVerifier.generateVerificationReport();
      setReport(verificationReport);
      
      // Get verification results to update test status
      const results = IAPAnalyticsVerifier.getVerificationResults() as VerificationResults | null;
      if (results && results.funnels) {
        setTestStatus({
          productFetch: results.funnels.productFetch ? '✅ Complete' : '❌ Incomplete',
          purchase: results.funnels.purchase ? '✅ Complete' : '❌ Incomplete',
          restore: results.funnels.restore ? '✅ Complete' : '❌ Incomplete',
          receiptVerification: results.funnels.receiptVerification ? '✅ Complete' : '❌ Incomplete',
        });
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
      Alert.alert('Error', 'Failed to generate analytics verification report');
    }
  };

  const testProductFetch = () => {
    // Products should already be fetched when the component mounted
    setTestStatus(prev => ({
      ...prev,
      productFetch: 'Testing...',
    }));
    
    setTimeout(() => {
      const results = IAPAnalyticsVerifier.getVerificationResults() as VerificationResults | null;
      if (results && results.funnels && results.funnels.productFetch) {
        setTestStatus(prev => ({
          ...prev,
          productFetch: '✅ Complete',
        }));
      } else {
        setTestStatus(prev => ({
          ...prev,
          productFetch: '❌ Incomplete',
        }));
      }
    }, 1000);
  };

  const testPurchase = async () => {
    if (!products || products.length === 0) {
      Alert.alert('No Products', 'No products available to purchase');
      return;
    }

    setTestStatus(prev => ({
      ...prev,
      purchase: 'Testing...',
    }));

    try {
      // Use the first product for testing
      const product = products[0];
      // Handle different property names in Product type
      const productId = typeof product === 'object' ? 
        // @ts-ignore - Different IAP libraries might use different property names
        (product.productId || product.identifier || product.sku) : 
        product;
      await purchaseProduct(productId);
      
      // Check if purchase events were captured
      setTimeout(() => {
        const results = IAPAnalyticsVerifier.getVerificationResults() as VerificationResults | null;
        if (results && results.funnels && results.funnels.purchase) {
          setTestStatus(prev => ({
            ...prev,
            purchase: '✅ Complete',
          }));
        } else {
          setTestStatus(prev => ({
            ...prev,
            purchase: '❌ Incomplete',
          }));
        }
      }, 2000);
    } catch (err) {
      console.error('Purchase test failed:', err);
      setTestStatus(prev => ({
        ...prev,
        purchase: '❌ Failed with error',
      }));
    }
  };

  const testRestore = async () => {
    setTestStatus(prev => ({
      ...prev,
      restore: 'Testing...',
    }));

    try {
      await restorePurchases();
      
      // Check if restore events were captured
      setTimeout(() => {
        const results = IAPAnalyticsVerifier.getVerificationResults() as VerificationResults | null;
        if (results && results.funnels && results.funnels.restore) {
          setTestStatus(prev => ({
            ...prev,
            restore: '✅ Complete',
          }));
        } else {
          setTestStatus(prev => ({
            ...prev,
            restore: '❌ Incomplete',
          }));
        }
      }, 2000);
    } catch (err) {
      console.error('Restore test failed:', err);
      setTestStatus(prev => ({
        ...prev,
        restore: '❌ Failed with error',
      }));
    }
  };

  // Receipt verification is typically handled internally during purchase/restore
  const checkReceiptVerification = () => {
    setTestStatus(prev => ({
      ...prev,
      receiptVerification: 'Checking...',
    }));
    
    setTimeout(() => {
      const results = IAPAnalyticsVerifier.getVerificationResults() as VerificationResults | null;
      if (results && results.funnels && results.funnels.receiptVerification) {
        setTestStatus(prev => ({
          ...prev,
          receiptVerification: '✅ Complete',
        }));
      } else {
        setTestStatus(prev => ({
          ...prev,
          receiptVerification: '❌ Incomplete',
        }));
      }
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>IAP Analytics Test</Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.sectionTitle}>Monitoring Status</Text>
          <Text style={styles.statusText}>
            {isMonitoring ? '✅ Active' : '❌ Inactive'}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, isMonitoring ? styles.disabledButton : styles.primaryButton]}
              onPress={startMonitoring}
              disabled={isMonitoring}
            >
              <Text style={styles.buttonText}>Start Monitoring</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, !isMonitoring ? styles.disabledButton : styles.secondaryButton]}
              onPress={stopMonitoring}
              disabled={!isMonitoring}
            >
              <Text style={styles.buttonText}>Stop Monitoring</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.testContainer}>
          <Text style={styles.sectionTitle}>Test IAP Functions</Text>
          
          <View style={styles.testRow}>
            <Text style={styles.testName}>Product Fetch:</Text>
            <Text style={styles.testStatus}>{testStatus.productFetch}</Text>
            <TouchableOpacity
              style={[styles.button, styles.testButton]}
              onPress={testProductFetch}
            >
              <Text style={styles.buttonText}>Test</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.testRow}>
            <Text style={styles.testName}>Purchase:</Text>
            <Text style={styles.testStatus}>{testStatus.purchase}</Text>
            <TouchableOpacity
              style={[styles.button, styles.testButton]}
              onPress={testPurchase}
            >
              <Text style={styles.buttonText}>Test</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.testRow}>
            <Text style={styles.testName}>Restore:</Text>
            <Text style={styles.testStatus}>{testStatus.restore}</Text>
            <TouchableOpacity
              style={[styles.button, styles.testButton]}
              onPress={testRestore}
            >
              <Text style={styles.buttonText}>Test</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.testRow}>
            <Text style={styles.testName}>Receipt Verification:</Text>
            <Text style={styles.testStatus}>{testStatus.receiptVerification}</Text>
            <TouchableOpacity
              style={[styles.button, styles.testButton]}
              onPress={checkReceiptVerification}
            >
              <Text style={styles.buttonText}>Check</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.reportContainer}>
          <Text style={styles.sectionTitle}>Verification Report</Text>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, styles.fullWidthButton]}
            onPress={generateReport}
          >
            <Text style={styles.buttonText}>Generate Report</Text>
          </TouchableOpacity>
          
          <View style={styles.reportContent}>
            <Text style={styles.reportText}>{report}</Text>
          </View>
        </View>
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error:</Text>
            <Text style={styles.errorText}>{error.message || JSON.stringify(error)}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#4285F4',
  },
  secondaryButton: {
    backgroundColor: '#EA4335',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  testButton: {
    backgroundColor: '#34A853',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  fullWidthButton: {
    width: '100%',
    marginBottom: 16,
  },
  testContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  testRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  testName: {
    flex: 1,
    fontSize: 16,
  },
  testStatus: {
    flex: 1,
    fontSize: 16,
  },
  reportContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  reportContent: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  reportText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c62828',
    marginBottom: 8,
  },
  errorText: {
    color: '#c62828',
  },
});

export default IAPAnalyticsTestScreen;
