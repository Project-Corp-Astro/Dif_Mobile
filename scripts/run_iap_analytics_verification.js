/**
 * IAP Analytics Verification Test Runner
 * 
 * This script automates the testing of IAP analytics events by simulating
 * IAP actions and verifying that the correct analytics events are fired.
 * 
 * Usage:
 * node scripts/run_iap_analytics_verification.js
 */

// Import the verification module
import IAPAnalyticsVerifier, { verifyIAPAnalytics, stopVerification, generateVerificationReport } from './verify_iap_analytics.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock IAP functions and events for testing
const mockIAP = {
  // Product data
  products: [
    { productId: 'com.corpastrp.premium.monthly', title: 'Monthly Premium', price: '9.99', currency: 'USD' },
    { productId: 'com.corpastrp.premium.yearly', title: 'Yearly Premium', price: '99.99', currency: 'USD' }
  ],
  
  // Mock analytics events
  mockAnalytics: null,
  
  // Initialize mock analytics tracking
  initMockAnalytics: function(analytics) {
    this.mockAnalytics = analytics;
  },
  
  // Simulate product fetch
  simulateProductFetch: async function() {
    console.log('Simulating product fetch...');
    
    if (this.mockAnalytics) {
      // Track start event
      this.mockAnalytics.trackEvent('iap_products_fetch_start', {});
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Track success event
      this.mockAnalytics.trackEvent('iap_products_fetch_success', {
        product_count: this.products.length,
        products: this.products.map(p => p.productId)
      });
    }
    
    return this.products;
  },
  
  // Simulate product fetch failure
  simulateProductFetchFailure: async function() {
    console.log('Simulating product fetch failure...');
    
    if (this.mockAnalytics) {
      // Track start event
      this.mockAnalytics.trackEvent('iap_products_fetch_start', {});
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Track failure event
      this.mockAnalytics.trackEvent('iap_products_fetch_failure', {
        error: 'Network error',
        error_code: 'E_NETWORK_ERROR'
      });
    }
    
    throw new Error('Failed to fetch products');
  },
  
  // Simulate purchase
  simulatePurchase: async function(productId) {
    console.log(`Simulating purchase for ${productId}...`);
    
    if (this.mockAnalytics) {
      // Track start event
      this.mockAnalytics.trackEvent('iap_purchase_start', {
        product_id: productId
      });
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Track success event
      this.mockAnalytics.trackEvent('iap_purchase_success', {
        product_id: productId,
        transaction_id: 'mock-transaction-123',
        purchase_time: Date.now(),
        price: '9.99',
        currency: 'USD'
      });
    }
    
    return {
      productId,
      transactionId: 'mock-transaction-123',
      transactionDate: new Date().toISOString(),
      transactionReceipt: 'mock-receipt-data'
    };
  },
  
  // Simulate purchase failure
  simulatePurchaseFailure: async function(productId) {
    console.log(`Simulating purchase failure for ${productId}...`);
    
    if (this.mockAnalytics) {
      // Track start event
      this.mockAnalytics.trackEvent('iap_purchase_start', {
        product_id: productId
      });
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Track failure event
      this.mockAnalytics.trackEvent('iap_purchase_failure', {
        product_id: productId,
        error: 'Payment declined',
        error_code: 'E_PAYMENT_DECLINED'
      });
    }
    
    throw new Error('Payment declined');
  },
  
  // Simulate purchase cancellation
  simulatePurchaseCancellation: async function(productId) {
    console.log(`Simulating purchase cancellation for ${productId}...`);
    
    if (this.mockAnalytics) {
      // Track start event
      this.mockAnalytics.trackEvent('iap_purchase_start', {
        product_id: productId
      });
      
      // Simulate user interaction delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Track cancellation event
      this.mockAnalytics.trackEvent('iap_purchase_cancelled', {
        product_id: productId
      });
    }
    
    throw { code: 'E_USER_CANCELLED', message: 'User cancelled the purchase' };
  },
  
  // Simulate restore purchases
  simulateRestore: async function() {
    console.log('Simulating restore purchases...');
    
    if (this.mockAnalytics) {
      // Track start event
      this.mockAnalytics.trackEvent('iap_restore_start', {});
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Track success event
      this.mockAnalytics.trackEvent('iap_restore_success', {
        restored_purchases_count: 1,
        product_ids: ['com.corpastrp.premium.monthly']
      });
    }
    
    return [{
      productId: 'com.corpastrp.premium.monthly',
      transactionId: 'mock-transaction-456',
      transactionDate: new Date().toISOString(),
      transactionReceipt: 'mock-receipt-data'
    }];
  },
  
  // Simulate restore failure
  simulateRestoreFailure: async function() {
    console.log('Simulating restore failure...');
    
    if (this.mockAnalytics) {
      // Track start event
      this.mockAnalytics.trackEvent('iap_restore_start', {});
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Track failure event
      this.mockAnalytics.trackEvent('iap_restore_failure', {
        error: 'Network error',
        error_code: 'E_NETWORK_ERROR'
      });
    }
    
    throw new Error('Failed to restore purchases');
  },
  
  // Simulate receipt verification
  simulateReceiptVerification: async function(receipt) {
    console.log('Simulating receipt verification...');
    
    if (this.mockAnalytics) {
      // Track start event
      this.mockAnalytics.trackEvent('iap_receipt_verification_start', {
        transaction_id: receipt.transactionId
      });
      
      // Simulate backend processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Track success event
      this.mockAnalytics.trackEvent('iap_receipt_verification_success', {
        transaction_id: receipt.transactionId,
        product_id: receipt.productId
      });
    }
    
    return {
      isValid: true,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  },
  
  // Simulate receipt verification failure
  simulateReceiptVerificationFailure: async function(receipt) {
    console.log('Simulating receipt verification failure...');
    
    if (this.mockAnalytics) {
      // Track start event
      this.mockAnalytics.trackEvent('iap_receipt_verification_start', {
        transaction_id: receipt.transactionId
      });
      
      // Simulate backend processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Track failure event
      this.mockAnalytics.trackEvent('iap_receipt_verification_failure', {
        transaction_id: receipt.transactionId,
        product_id: receipt.productId,
        error: 'Invalid receipt',
        error_code: 'E_INVALID_RECEIPT'
      });
    }
    
    throw new Error('Invalid receipt');
  },
  
  // Simulate subscription status change
  simulateSubscriptionStatusChange: async function(status) {
    console.log(`Simulating subscription status change to ${status}...`);
    
    if (this.mockAnalytics) {
      // Track status change event
      this.mockAnalytics.trackEvent('iap_subscription_status_changed', {
        product_id: 'com.corpastrp.premium.monthly',
        previous_status: 'ACTIVE',
        new_status: status,
        remaining_time_days: status === 'ACTIVE' ? 30 : 0
      });
    }
  }
};

// Mock analytics implementation
const mockAnalytics = {
  trackEvent: function(eventName, params) {
    console.log(`[Analytics Event] ${eventName}`, params);
  }
};

// Run all tests
async function runAllTests() {
  console.log('Starting IAP Analytics Verification Tests');
  console.log('=======================================');
  
  // Start verification
  verifyIAPAnalytics();
  
  // Initialize mock analytics with the global mockAnalytics object
  // This ensures we use the same analytics object that's being monitored
  mockIAP.initMockAnalytics(globalThis.mockAnalytics || mockAnalytics);
  
  try {
    // Test product fetch
    console.log('\n--- Testing Product Fetch ---');
    await mockIAP.simulateProductFetch();
    
    // Test purchase flow
    console.log('\n--- Testing Purchase Flow ---');
    const purchase = await mockIAP.simulatePurchase('com.corpastrp.premium.monthly');
    
    // Test receipt verification
    console.log('\n--- Testing Receipt Verification ---');
    await mockIAP.simulateReceiptVerification(purchase);
    
    // Test restore flow
    console.log('\n--- Testing Restore Flow ---');
    await mockIAP.simulateRestore();
    
    // Test subscription status change
    console.log('\n--- Testing Subscription Status Change ---');
    await mockIAP.simulateSubscriptionStatusChange('EXPIRED');
    
    // Allow time for all events to be processed
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate and save report
    const report = generateVerificationReport();
    console.log('\n\n' + report);
    
    // Save report to file
    const reportPath = path.join(__dirname, '..', 'iap_analytics_verification_report.md');
    fs.writeFileSync(reportPath, report);
    console.log(`\nReport saved to: ${reportPath}`);
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Stop verification
    stopVerification();
  }
}

// Run negative test cases
async function runNegativeTests() {
  console.log('\n\nStarting IAP Analytics Negative Tests');
  console.log('=======================================');
  
  // Start verification
  verifyIAPAnalytics();
  
  // Initialize mock analytics with the global mockAnalytics object
  // This ensures we use the same analytics object that's being monitored
  mockIAP.initMockAnalytics(globalThis.mockAnalytics || mockAnalytics);
  
  try {
    // Test product fetch failure
    console.log('\n--- Testing Product Fetch Failure ---');
    try {
      await mockIAP.simulateProductFetchFailure();
    } catch (error) {
      console.log('Expected error:', error.message);
    }
    
    // Test purchase failure
    console.log('\n--- Testing Purchase Failure ---');
    try {
      await mockIAP.simulatePurchaseFailure('com.corpastrp.premium.yearly');
    } catch (error) {
      console.log('Expected error:', error.message);
    }
    
    // Test purchase cancellation
    console.log('\n--- Testing Purchase Cancellation ---');
    try {
      await mockIAP.simulatePurchaseCancellation('com.corpastrp.premium.yearly');
    } catch (error) {
      console.log('Expected error:', error.code);
    }
    
    // Test restore failure
    console.log('\n--- Testing Restore Failure ---');
    try {
      await mockIAP.simulateRestoreFailure();
    } catch (error) {
      console.log('Expected error:', error.message);
    }
    
    // Test receipt verification failure
    console.log('\n--- Testing Receipt Verification Failure ---');
    try {
      await mockIAP.simulateReceiptVerificationFailure({
        productId: 'com.corpastrp.premium.monthly',
        transactionId: 'mock-transaction-789'
      });
    } catch (error) {
      console.log('Expected error:', error.message);
    }
    
    // Allow time for all events to be processed
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate and save report
    const report = generateVerificationReport();
    console.log('\n\n' + report);
    
    // Save report to file
    const reportPath = path.join(__dirname, '..', 'iap_analytics_negative_verification_report.md');
    fs.writeFileSync(reportPath, report);
    console.log(`\nNegative test report saved to: ${reportPath}`);
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Stop verification
    stopVerification();
  }
}

// Main function
async function main() {
  await runAllTests();
  await runNegativeTests();
  console.log('\nAll tests completed!');
}

// Run the tests
main().catch(console.error);
