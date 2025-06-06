# IAP Sandbox Testing Checklist

## Setup Requirements

### iOS Testing
- [ ] Apple Developer account with sandbox testing capabilities
- [ ] Sandbox test user accounts created in App Store Connect
- [ ] Test device with iOS installed
- [ ] Development build of the app installed on the test device

### Android Testing
- [ ] Google Play Console access with testing capabilities
- [ ] Test accounts added to the license testing program
- [ ] Test device with Android installed
- [ ] Development build of the app installed on the test device

## Testing Procedure

### Product Fetching
- [ ] **iOS**: Verify all products are fetched correctly
- [ ] **Android**: Verify all products are fetched correctly
- [ ] Verify product details (title, description, price) match store configuration

### Purchase Flow
- [ ] **iOS**: Complete purchase flow for monthly subscription
- [ ] **iOS**: Complete purchase flow for yearly subscription
- [ ] **iOS**: Complete purchase flow for lifetime purchase (if applicable)
- [ ] **Android**: Complete purchase flow for monthly subscription
- [ ] **Android**: Complete purchase flow for yearly subscription
- [ ] **Android**: Complete purchase flow for lifetime purchase (if applicable)
- [ ] Verify purchase UI updates correctly after successful purchase
- [ ] Verify subscription status updates correctly

### Receipt Verification
- [ ] **iOS**: Verify receipt is sent to backend
- [ ] **iOS**: Verify backend successfully validates receipt
- [ ] **Android**: Verify purchase token is sent to backend
- [ ] **Android**: Verify backend successfully validates purchase token
- [ ] Check logs for any verification errors

### Purchase Restoration
- [ ] **iOS**: Test restoring purchases on a new device/installation
- [ ] **Android**: Test restoring purchases on a new device/installation
- [ ] Verify restored purchases are correctly reflected in the UI
- [ ] Verify subscription status updates after restoration

### Error Handling
- [ ] Test cancellation during purchase flow
- [ ] Test network disconnection during purchase
- [ ] Test invalid product ID scenarios
- [ ] Verify appropriate error messages are displayed
- [ ] Check error reporting system captures IAP errors correctly

### Edge Cases
- [ ] Test subscription upgrade flow (e.g., monthly to yearly)
- [ ] Test subscription with trial period (if applicable)
- [ ] Test purchase with promo code (if applicable)
- [ ] Test behavior when store is unavailable

## Results Documentation

For each test case, document:
1. Test date and time
2. Test device and OS version
3. Test account used
4. Expected result
5. Actual result
6. Screenshots (if applicable)
7. Any errors or unexpected behavior

## Issues Tracking

| Issue | Platform | Description | Severity | Status |
|-------|----------|-------------|----------|--------|
|       |          |             |          |        |
