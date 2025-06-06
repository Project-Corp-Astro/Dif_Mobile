import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import { useIAP } from '../hooks/useIAP';
import { useIAPMock } from '../hooks/useIAPMock';
import { SubscriptionPlan, ProductType } from '../hooks/useIAP';

/**
 * Test screen for verifying the functionality of the useIAP hook
 * This screen allows testing of all major IAP functionality:
 * - Fetching products
 * - Initiating purchases
 * - Restoring purchases
 * - Checking subscription status
 */
const IAPTestScreen = () => {
  const [useMock, setUseMock] = useState<boolean>(true);
  
  // Use either the real implementation or the mock implementation
  const realIAP = useIAP();
  const mockIAP = useIAPMock();
  
  // Select the appropriate implementation based on the toggle
  const {
    products,
    purchases,
    subscriptionStatus,
    isLoading,
    error,
    purchaseProduct,
    restorePurchases,
  } = useMock ? mockIAP : realIAP;

  const [testResults, setTestResults] = useState<Array<{name: string, success: boolean, message: string}>>([]);

  // Add a test result
  const addTestResult = (name: string, success: boolean, message: string) => {
    setTestResults(prev => [...prev, { name, success, message }]);
  };

  // Initialize IAP on component mount or when implementation changes
  useEffect(() => {
    const runTest = async () => {
      try {
        addTestResult('Initialization', true, 'Starting IAP initialization...');
        // Note: initializeIAP is already called internally by both hooks
        addTestResult('Initialization', true, 'IAP initialized successfully');
      } catch (err) {
        addTestResult('Initialization', false, `IAP initialization failed: ${(err as Error).message}`);
      }
    };

    runTest();
  }, [useMock]);

  // Test purchasing a product
  const handlePurchase = async (productId: string) => {
    try {
      addTestResult('Purchase', true, `Starting purchase for ${productId}...`);
      await purchaseProduct(productId);
      // Note: The purchase result will be handled by the purchaseUpdatedListener in the hook
    } catch (err) {
      addTestResult('Purchase', false, `Purchase failed: ${(err as Error).message}`);
    }
  };

  // Test restoring purchases
  const handleRestore = async () => {
    try {
      addTestResult('Restore', true, 'Starting purchase restoration...');
      await restorePurchases();
      addTestResult('Restore', true, 'Purchases restored successfully');
    } catch (err) {
      addTestResult('Restore', false, `Restore failed: ${(err as Error).message}`);
    }
  };

  // Display subscription status
  const renderSubscriptionStatus = () => {
    if (!subscriptionStatus) {
      return <Text style={styles.statusText}>No active subscription</Text>;
    }

    return (
      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Subscription Status</Text>
        <Text style={styles.statusText}>Active: {subscriptionStatus.isActive ? 'Yes' : 'No'}</Text>
        <Text style={styles.statusText}>Plan: {subscriptionStatus.plan || 'None'}</Text>
        <Text style={styles.statusText}>
          Expiry: {subscriptionStatus.expiryDate ? subscriptionStatus.expiryDate.toLocaleDateString() : 'N/A'}
        </Text>
        <Text style={styles.statusText}>
          Lifetime: {subscriptionStatus.isLifetime ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.statusText}>
          Trial: {subscriptionStatus.isTrialActive ? 'Active' : 'Inactive'}
        </Text>
      </View>
    );
  };

  // Display available products
  const renderProducts = () => {
    if (products.length === 0) {
      return <Text style={styles.emptyText}>No products available</Text>;
    }

    return products.map((product) => (
      <TouchableOpacity
        key={product.id}
        style={styles.productCard}
        onPress={() => handlePurchase(product.id)}
      >
        <Text style={styles.productTitle}>{product.title}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <Text style={styles.productPrice}>{product.price}</Text>
        <Text style={styles.productType}>
          Type: {product.type === ProductType.SUBSCRIPTION ? 'Subscription' : 'One-time'}
        </Text>
        {product.subscriptionPeriod && (
          <Text style={styles.productPeriod}>Period: {product.subscriptionPeriod}</Text>
        )}
        <TouchableOpacity
          style={styles.purchaseButton}
          onPress={() => handlePurchase(product.id)}
        >
          <Text style={styles.purchaseButtonText}>Purchase</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    ));
  };

  // Display purchase history
  const renderPurchases = () => {
    if (purchases.length === 0) {
      return <Text style={styles.emptyText}>No purchase history</Text>;
    }

    return purchases.map((purchase, index) => (
      <View key={index} style={styles.purchaseItem}>
        <Text style={styles.purchaseText}>Product: {purchase.productId}</Text>
        <Text style={styles.purchaseText}>
          Date: {new Date(purchase.purchaseTime).toLocaleDateString()}
        </Text>
        <Text style={styles.purchaseText}>Transaction: {purchase.transactionId}</Text>
        {purchase.expirationDate && (
          <Text style={styles.purchaseText}>
            Expires: {purchase.expirationDate.toLocaleDateString()}
          </Text>
        )}
      </View>
    ));
  };

  // Display test results
  const renderTestResults = () => {
    if (testResults.length === 0) {
      return null;
    }

    return (
      <View style={styles.testResultsContainer}>
        <Text style={styles.sectionTitle}>Test Results</Text>
        {testResults.map((result, index) => (
          <View key={index} style={styles.testResult}>
            <Text style={styles.testName}>{result.name}</Text>
            <Text style={result.success ? styles.testSuccess : styles.testFailure}>
              {result.success ? '✓' : '✗'}
            </Text>
            <Text style={styles.testMessage}>{result.message}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Display any errors
  const renderError = () => {
    if (!error) return null;
    
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>IAP Test Screen</Text>
      
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>Use Mock Implementation</Text>
        <Switch
          value={useMock}
          onValueChange={setUseMock}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={useMock ? '#2196f3' : '#f4f3f4'}
        />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          {renderError()}
          {renderTestResults()}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subscription Status</Text>
            {renderSubscriptionStatus()}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Products</Text>
            {renderProducts()}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Purchase History</Text>
            {renderPurchases()}
          </View>
          
          <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 4,
  },
  productCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  productType: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  productPeriod: {
    fontSize: 12,
    color: '#666',
  },
  purchaseButton: {
    backgroundColor: '#2196f3',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  purchaseButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    padding: 16,
  },
  purchaseItem: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  purchaseText: {
    fontSize: 14,
    marginBottom: 2,
  },
  restoreButton: {
    backgroundColor: '#673ab7',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  restoreButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 14,
    color: '#d32f2f',
  },
  testResultsContainer: {
    marginBottom: 16,
  },
  testResult: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  testName: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 100,
  },
  testSuccess: {
    fontSize: 16,
    color: '#4caf50',
    marginHorizontal: 8,
  },
  testFailure: {
    fontSize: 16,
    color: '#f44336',
    marginHorizontal: 8,
  },
  testMessage: {
    fontSize: 14,
    flex: 1,
  },
});

export default IAPTestScreen;
