# Android Sandbox Testing Setup for Corp Astro IAP

This guide provides step-by-step instructions for setting up and testing the in-app purchase functionality in the Corp Astro mobile app using Google Play's sandbox environment.

## Prerequisites

- Google Play Console access with appropriate permissions
- Development build of the Corp Astro app installed on an Android device or emulator
- Android Studio installed on your development machine

## Step 1: Set Up License Testing

1. Log in to the [Google Play Console](https://play.google.com/console/)
2. Navigate to your app > "Testing" > "License Testing"
3. Add the Gmail accounts you want to use for testing (create at least 3 different accounts):
   - One for testing monthly subscriptions
   - One for testing yearly subscriptions
   - One for testing lifetime purchases
4. Save the changes

## Step 2: Configure the Test Device

1. On your Android test device, ensure you're signed in with one of the Gmail accounts added to license testing
2. Clear the Google Play Store app data:
   - Go to Settings > Apps > Google Play Store
   - Tap "Storage" > "Clear Data"
3. Restart the Google Play Store app

## Step 3: Prepare the App for Testing

1. Ensure the app is built with the correct package name that matches your Google Play Console configuration
2. Verify that the product IDs in the app match those configured in Google Play Console
3. Make sure the app is signed with a valid development or test key

## Step 4: Run the App and Access the IAP Test Screen

1. Launch the app on your Android device
2. Navigate to the IAP Test Screen by tapping "Open IAP Test Screen" on the home screen
3. Ensure the "Use Mock Implementation" toggle is set to OFF to use the real implementation

## Step 5: Test Product Fetching

1. When the IAP Test Screen loads, it should automatically fetch products from Google Play
2. Verify that all expected products appear in the "Available Products" section
3. Check that product details (title, description, price) match your Google Play Console configuration

## Step 6: Test Purchase Flow

1. Select a product to purchase by tapping its "Purchase" button
2. The Google Play purchase dialog should appear
3. Complete the purchase flow (you won't be charged real money when using a test account)
4. Verify that the app updates to reflect the purchase (subscription status should update)
5. Confirm that the purchase has a "Test:" prefix in the order ID, indicating it's a test purchase

## Step 7: Test Purchase Restoration

1. Clear the app data or reinstall it to simulate a new installation
2. Navigate to the IAP Test Screen
3. Tap the "Restore Purchases" button
4. Verify that previously purchased products are restored and reflected in the UI

## Step 8: Test Subscription Management

1. For subscription products, verify that the subscription status shows correctly:
   - Active status
   - Correct plan type
   - Correct expiration date
2. Test subscription management:
   - Go to Google Play Store > Account > Subscriptions
   - Find your test subscription
   - Test cancellation and observe how the app reflects this change

## Step 9: Test Receipt Verification

1. After making a purchase, check the app logs for purchase token verification
2. Verify that the purchase token is sent to the backend
3. Confirm that the backend successfully validates the purchase token
4. Check that the user's entitlements are updated accordingly

## Testing Subscription Renewals

For testing subscription renewals without waiting for the actual renewal period:

1. Use the Google Play Developer API to simulate renewal events
2. Alternatively, you can manually cancel and repurchase subscriptions to test the renewal flow

## Troubleshooting Common Issues

### "Item already owned" error
- Solution: Clear Google Play Store data or use a different test account
- Alternatively, cancel the subscription in Google Play Store

### "Purchase not completing"
- Solution: Ensure the test account is properly set up for license testing
- Check that the app is using the correct billing library version

### "Product not available"
- Solution: Verify that the product ID in the app matches the one in Google Play Console
- Make sure the product is active in Google Play Console

### "Receipt verification failed"
- Solution: Check the backend logs for specific error messages
- Verify that the backend is correctly handling Google Play purchase tokens

## Testing Checklist

Use the `IAP_TESTING_TRACKER.md` document to track your progress through the testing process. Mark each test case as completed and note any issues encountered.

## Reporting Issues

If you encounter any issues during testing, document them with:
1. Detailed steps to reproduce
2. Screenshots if applicable
3. Error messages from the app logs
4. Device and Android version information

Add these to the "Issues Found" section of the `IAP_TESTING_TRACKER.md` document.
