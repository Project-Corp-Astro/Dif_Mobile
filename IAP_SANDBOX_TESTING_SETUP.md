# IAP Sandbox Testing Setup Guide

This guide provides instructions for setting up sandbox testing environments for both iOS and Android platforms to test the in-app purchase functionality.

## iOS Sandbox Testing Setup

### 1. Create Sandbox Test Users

1. Log in to [App Store Connect](https://appstoreconnect.apple.com/)
2. Navigate to "Users and Access" > "Sandbox" > "Testers"
3. Click the "+" button to add a new sandbox tester
4. Fill in the required information:
   - First Name
   - Last Name
   - Email Address (use an email that is not associated with an Apple ID)
   - Password
   - Secret Question/Answer
   - Territory (select the appropriate App Store territory)
5. Click "Save"

### 2. Configure Test Device

1. On the test iOS device, sign out of the current Apple ID in the App Store
2. Install the development build of the app on the device
3. When making a purchase in the app, you will be prompted to sign in
4. Use the sandbox tester account credentials created in step 1
5. Complete the purchase flow using the sandbox account

### 3. Testing Notes

- Sandbox purchases do not charge real money
- Subscription time periods are shortened for testing:
  - 1 week → 3 minutes
  - 1 month → 5 minutes
  - 2 months → 10 minutes
  - 3 months → 15 minutes
  - 6 months → 30 minutes
  - 1 year → 1 hour
- Receipt validation works the same as in production but uses the sandbox environment

## Android Sandbox Testing Setup

### 1. Set Up License Testing

1. Log in to the [Google Play Console](https://play.google.com/console/)
2. Navigate to your app > "Testing" > "License Testing"
3. Add the Gmail accounts you want to use for testing
4. Save the changes

### 2. Configure Test Device

1. On the test Android device, ensure you're signed in with a Gmail account added to license testing
2. Install the development build of the app on the device
3. Make purchases normally within the app
4. The purchases will be processed as test purchases (no real money charged)

### 3. Testing Notes

- Test purchases are marked with "Test:" in the order ID
- Subscriptions can be canceled from the Google Play Store app
- For testing subscription renewals, you can use the Google Play Developer API to simulate renewal events

## Backend Testing Configuration

Ensure the backend is configured to accept sandbox receipts:

1. For iOS, use the sandbox verification endpoint:
   - Production: `https://buy.itunes.apple.com/verifyReceipt`
   - Sandbox: `https://sandbox.itunes.apple.com/verifyReceipt`

2. For Android, use the test access token when verifying purchases with Google Play Developer API

## Common Testing Issues and Solutions

### iOS Issues

- **"This Apple ID has not yet been used with the App Store" error**: 
  - Solution: Sign in to the App Store with the sandbox account first, accept terms and conditions

- **Sandbox account locked**: 
  - Solution: Create a new sandbox account, they cannot be unlocked

### Android Issues

- **"Item already owned" error**: 
  - Solution: Clear Google Play Store data or use a different test account

- **Purchase not completing**: 
  - Solution: Ensure the test account is properly set up for license testing

## Testing Resources

- [Apple's Documentation on Testing In-App Purchases](https://developer.apple.com/documentation/storekit/in-app_purchase/testing_in-app_purchases)
- [Google's Documentation on Testing In-App Purchases](https://developer.android.com/google/play/billing/test)
