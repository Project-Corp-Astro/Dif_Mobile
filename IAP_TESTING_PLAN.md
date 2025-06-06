# In-App Purchase Migration Testing Plan

## Overview

This document outlines the testing strategy for verifying the successful migration from `expo-in-app-purchases` to `react-native-iap` in the Corp Astro mobile app.

## Testing Environment Setup

### iOS Testing
- Device: iPhone simulator or physical device
- Environment: Development environment with sandbox IAP enabled
- Test account: Use Apple sandbox test account

### Android Testing
- Device: Android emulator or physical device
- Environment: Development environment with test IAP enabled
- Test account: Use Google Play test account

## Test Cases

### 1. Product Fetching

| Test ID | Description | Expected Result | iOS | Android |
|---------|-------------|-----------------|-----|---------|
| PF-01   | Fetch all available products | Products are successfully fetched and formatted correctly | - | - |
| PF-02   | Fetch with network error | Error is handled gracefully and reported | - | - |
| PF-03   | Fetch with invalid product IDs | Error is handled gracefully and reported | - | - |

### 2. Purchase Flow

| Test ID | Description | Expected Result | iOS | Android |
|---------|-------------|-----------------|-----|---------|
| PU-01   | Purchase monthly subscription | Purchase completes successfully and subscription status updates | - | - |
| PU-02   | Purchase yearly subscription | Purchase completes successfully and subscription status updates | - | - |
| PU-03   | Purchase lifetime subscription | Purchase completes successfully and subscription status updates | - | - |
| PU-04   | Cancel purchase during flow | Purchase is cancelled without errors | - | - |
| PU-05   | Purchase with network error | Error is handled gracefully and reported | - | - |

### 3. Receipt Verification

| Test ID | Description | Expected Result | iOS | Android |
|---------|-------------|-----------------|-----|---------|
| RV-01   | Verify valid receipt | Receipt is verified successfully | - | - |
| RV-02   | Verify with backend error | Error is handled gracefully and reported | - | - |
| RV-03   | Verify with invalid receipt | Error is handled gracefully and reported | - | - |

### 4. Purchase Restoration

| Test ID | Description | Expected Result | iOS | Android |
|---------|-------------|-----------------|-----|---------|
| PR-01   | Restore purchases with active subscription | Subscription is restored successfully | - | - |
| PR-02   | Restore purchases with expired subscription | Expiration is handled correctly | - | - |
| PR-03   | Restore purchases with no history | Handled gracefully with appropriate message | - | - |

### 5. Subscription Status

| Test ID | Description | Expected Result | iOS | Android |
|---------|-------------|-----------------|-----|---------|
| SS-01   | Check active subscription | Status shows as active with correct plan and expiry date | - | - |
| SS-02   | Check expired subscription | Status shows as inactive | - | - |
| SS-03   | Check after renewal | Status updates with new expiry date | - | - |

## Integration Testing

| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| IT-01   | Replace useSubscription with useIAP | All components function correctly | - |
| IT-02   | Verify analytics events | All purchase events are tracked correctly | - |
| IT-03   | Verify error reporting | All errors are reported correctly | - |

## Regression Testing

| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| RT-01   | Verify existing purchases | Previously purchased subscriptions are recognized | - |
| RT-02   | Verify UI components | All subscription-related UI components display correctly | - |

## Test Execution

1. Run through all test cases on iOS
2. Run through all test cases on Android
3. Document any issues found
4. Fix issues and retest

## Success Criteria

- All test cases pass on both iOS and Android
- No regression in existing functionality
- Error handling is robust and user-friendly
- Analytics and error reporting work correctly

## Notes

- Use test accounts only, never real payment methods
- Test in sandbox/test environments only
- Document any platform-specific behaviors or issues
