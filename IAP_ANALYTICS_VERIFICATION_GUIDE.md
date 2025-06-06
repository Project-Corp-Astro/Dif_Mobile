# IAP Analytics Verification Guide

## Overview

This guide explains how to verify that all IAP analytics events are being properly tracked in the Corp Astro mobile app after migrating from `expo-in-app-purchases` to `react-native-iap`. The verification process uses the `verify_iap_analytics.js` script to monitor and report on analytics events during testing.

## Prerequisites

- Development environment set up
- Access to the Corp Astro mobile app codebase
- Ability to run the app in development mode

## Verification Process

### Step 1: Import the Verification Script

Add the following import to your test screen or component:

```javascript
import IAPAnalyticsVerifier from '../scripts/verify_iap_analytics';
```

### Step 2: Start Monitoring

Before performing any IAP actions, start the monitoring process:

```javascript
// In your test component
useEffect(() => {
  // Start monitoring IAP analytics events
  IAPAnalyticsVerifier.verifyIAPAnalytics();
  
  // Clean up when component unmounts
  return () => {
    IAPAnalyticsVerifier.stopVerification();
  };
}, []);
```

### Step 3: Perform IAP Actions

Systematically test all IAP functionality:

1. **Product Fetching**
   - Initialize the IAP system
   - Fetch available products

2. **Purchase Flow**
   - Select a product to purchase
   - Complete the purchase flow (using sandbox mode)
   - Handle success/failure cases

3. **Restore Flow**
   - Test the restore purchases functionality

4. **Receipt Verification**
   - Ensure receipt verification with the backend is triggered

### Step 4: Generate Verification Report

After testing, generate a report to see which events were captured:

```javascript
// Add a button to your test screen
const generateReport = () => {
  const report = IAPAnalyticsVerifier.generateVerificationReport();
  console.log(report);
  
  // You can also save this to a file or display it in the UI
  Alert.alert('Analytics Verification Report', 'Report generated. Check console for details.');
};
```

### Step 5: Analyze Results

The verification report will show:

- Total events captured
- Which event types were captured vs. missing
- Completeness of each funnel (product fetch, purchase, restore, receipt verification)
- Details of each captured event including parameters

### Expected Events

The following events should be captured during verification:

| Event Category | Events |
|---------------|--------|
| Product Fetch | `iap_products_fetch_start`, `iap_products_fetch_success`, `iap_products_fetch_failure` |
| Purchase | `iap_purchase_start`, `iap_purchase_success`, `iap_purchase_failure`, `iap_purchase_cancelled` |
| Restore | `iap_restore_start`, `iap_restore_success`, `iap_restore_failure` |
| Receipt Verification | `iap_receipt_verification_start`, `iap_receipt_verification_success`, `iap_receipt_verification_failure` |
| Subscription Status | `iap_subscription_status_changed` |

## Troubleshooting

### Missing Events

If events are missing from your verification report:

1. Check that the `useIAPAnalytics` hook is properly integrated in the `useIAP` hook
2. Verify that the event is being triggered at the correct point in the code
3. Ensure the analytics provider is properly configured

### Incorrect Parameters

If events are captured but with incorrect parameters:

1. Check the parameter mapping in the `useIAPAnalytics` hook
2. Verify that the data being passed to the analytics function is correct

## Integration with Testing Workflow

Add analytics verification to your IAP testing workflow:

1. Complete the functional testing steps in the IAP Testing Tracker
2. Run the analytics verification for each test case
3. Update the IAP Testing Tracker with analytics verification results

## Next Steps

After successful verification:

1. Update the IAP Testing Tracker to mark analytics events as verified
2. Proceed with the pre-cleanup verification checklist
3. Follow the deployment plan for production rollout
