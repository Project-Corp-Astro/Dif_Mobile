/**
 * IAP Analytics Verification Script
 * 
 * This script helps verify that all expected IAP analytics events are being properly tracked.
 * It can be run in development mode to check that analytics events are firing correctly.
 * 
 * Usage:
 * 1. Import this script in your test environment
 * 2. Call verifyIAPAnalytics() to start monitoring
 * 3. Perform IAP actions (fetch products, purchase, restore, etc.)
 * 4. Call getVerificationResults() to see which events were captured
 */

// List of all expected IAP analytics events
const EXPECTED_IAP_EVENTS = [
  // Product fetch events
  'iap_products_fetch_start',
  'iap_products_fetch_success',
  'iap_products_fetch_failure',
  
  // Purchase events
  'iap_purchase_start',
  'iap_purchase_success',
  'iap_purchase_failure',
  'iap_purchase_cancelled',
  
  // Restore events
  'iap_restore_start',
  'iap_restore_success',
  'iap_restore_failure',
  
  // Receipt verification events
  'iap_receipt_verification_start',
  'iap_receipt_verification_success',
  'iap_receipt_verification_failure',
  
  // Subscription status events
  'iap_subscription_status_changed'
];

// Store captured events
let capturedEvents = {};
let originalTrackEvent = null;
let isMonitoring = false;

/**
 * Start monitoring IAP analytics events
 * @returns {void}
 */
export function verifyIAPAnalytics() {
  if (isMonitoring) {
    console.log('Already monitoring IAP analytics events');
    return;
  }
  
  // Reset captured events
  capturedEvents = {};
  EXPECTED_IAP_EVENTS.forEach(event => {
    capturedEvents[event] = {
      count: 0,
      lastParams: null,
      timestamps: [],
      params: []
    };
  });
  
  // Get reference to the original analytics tracking function
  try {
    // In a real app, we would import the useAnalytics hook
    // For testing purposes, we'll create a mock analytics object
    const mockAnalytics = {
      trackEvent: (eventName, params) => {
        console.log(`[Analytics Event] ${eventName}`, params);
      }
    };
    
    // Store the original trackEvent function
    originalTrackEvent = mockAnalytics.trackEvent;
    
    // Override the trackEvent function to capture events
    mockAnalytics.trackEvent = (eventName, params) => {
      // Call the original function for logging
      if (originalTrackEvent) {
        originalTrackEvent(eventName, params);
      }
      
      // Only track IAP events
      if (EXPECTED_IAP_EVENTS.includes(eventName)) {
        console.log(`[IAP Analytics] Captured event: ${eventName}`, params);
        
        // Store the event
        capturedEvents[eventName].count++;
        capturedEvents[eventName].lastParams = params || {};
        capturedEvents[eventName].timestamps.push(Date.now());
        capturedEvents[eventName].params.push(params || {});
      }
    };
    
    // Make the mock analytics available globally for testing
    globalThis.mockAnalytics = mockAnalytics;
    
    isMonitoring = true;
    console.log('[IAP Analytics] Started monitoring IAP analytics events.');
  } catch (error) {
    console.error('[IAP Analytics] Failed to start monitoring:', error);
  }
}

/**
 * Stop monitoring IAP analytics events
 * @returns {void}
 */
export function stopVerification() {
  if (!isMonitoring || !originalTrackEvent) {
    console.log('Not currently monitoring IAP analytics events');
    return;
  }
  
  try {
    // In a real app, we would import the useAnalytics hook
    // Since this is a test script, we'll just reset the tracking function
    if (originalTrackEvent) {
      // Reset the original track event function
      isMonitoring = false;
      console.log('[IAP Analytics] Monitoring stopped.');
    }
  } catch (error) {
    console.error('[IAP Analytics] Failed to stop monitoring:', error);
  }
}

/**
 * Get verification results
 * @returns {Object} Results of the verification
 */
export function getVerificationResults() {
  if (!isMonitoring) {
    console.log('Not currently monitoring IAP analytics events');
    return null;
  }
  
  const results = {
    summary: {
      totalEvents: 0,
      capturedEventTypes: 0,
      missingEventTypes: []
    },
    details: capturedEvents
  };
  
  // Calculate summary
  Object.keys(capturedEvents).forEach(eventName => {
    results.summary.totalEvents += capturedEvents[eventName].count;
    if (capturedEvents[eventName].count > 0) {
      results.summary.capturedEventTypes++;
    } else {
      results.summary.missingEventTypes.push(eventName);
    }
  });
  
  // Check for complete funnels
  results.funnels = {
    productFetch: checkFunnel(['iap_products_fetch_start', 'iap_products_fetch_success']),
    purchase: checkFunnel(['iap_purchase_start', 'iap_purchase_success']),
    restore: checkFunnel(['iap_restore_start', 'iap_restore_success']),
    receiptVerification: checkFunnel(['iap_receipt_verification_start', 'iap_receipt_verification_success'])
  };
  
  return results;
}

/**
 * Check if a funnel is complete
 * @param {Array<string>} eventNames - The events that form a funnel
 * @returns {boolean} Whether the funnel is complete
 */
export function checkFunnel(eventNames) {
  return eventNames.every(event => capturedEvents[event].count > 0);
}

/**
 * Generate a verification report
 * @returns {string} Formatted report
 */
export function generateVerificationReport() {
  const results = getVerificationResults();
  if (!results) return 'No verification results available';
  
  let report = '## IAP Analytics Verification Report\n\n';
  
  // Summary
  report += '### Summary\n\n';
  report += `- Total events captured: ${results.summary.totalEvents}\n`;
  report += `- Event types captured: ${results.summary.capturedEventTypes}/${EXPECTED_IAP_EVENTS.length}\n`;
  
  if (results.summary.missingEventTypes.length > 0) {
    report += '\n### Missing Events\n\n';
    results.summary.missingEventTypes.forEach(event => {
      report += `- ${event}\n`;
    });
  }
  
  // Funnel completeness
  report += '\n### Funnel Completeness\n\n';
  report += `- Product Fetch Funnel: ${results.funnels.productFetch ? '✅ Complete' : '❌ Incomplete'}\n`;
  report += `- Purchase Funnel: ${results.funnels.purchase ? '✅ Complete' : '❌ Incomplete'}\n`;
  report += `- Restore Funnel: ${results.funnels.restore ? '✅ Complete' : '❌ Incomplete'}\n`;
  report += `- Receipt Verification Funnel: ${results.funnels.receiptVerification ? '✅ Complete' : '❌ Incomplete'}\n`;
  
  // Event details
  report += '\n### Event Details\n\n';
  Object.keys(results.details).forEach(eventName => {
    const event = results.details[eventName];
    if (event.count > 0) {
      report += `#### ${eventName}\n\n`;
      report += `- Count: ${event.count}\n`;
      report += `- Last triggered: ${event.timestamps[event.timestamps.length - 1]}\n`;
      if (event.lastParams) {
        report += `- Parameters: \`${JSON.stringify(event.lastParams)}\`\n`;
      }
      report += '\n';
    }
  });
  
  return report;
}

// Export as default for easier importing
const IAPAnalyticsVerifier = {
  verifyIAPAnalytics,
  stopVerification,
  getVerificationResults,
  checkFunnel,
  generateVerificationReport
};

export default IAPAnalyticsVerifier;
