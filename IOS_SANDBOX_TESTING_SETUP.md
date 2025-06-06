# iOS Sandbox Testing Setup for Corp Astro IAP

This guide provides step-by-step instructions for setting up and testing the in-app purchase functionality in the Corp Astro mobile app using Apple's sandbox environment.

## Prerequisites

- Apple Developer account with access to App Store Connect
- Development build of the Corp Astro app installed on an iOS device or simulator
- Xcode installed on your development machine

## Step 1: Create Sandbox Tester Accounts

1. Log in to [App Store Connect](https://appstoreconnect.apple.com/)
2. Navigate to "Users and Access" > "Sandbox" > "Testers"
3. Click the "+" button to add a new sandbox tester
4. Fill in the required information:
   - First Name: `TestUser`
   - Last Name: `CorpAstro`
   - Email Address: Use an email that is not associated with an Apple ID
   - Password: Create a secure password (at least 8 characters with uppercase, lowercase, and numbers)
   - Secret Question/Answer: Set up security questions
   - Territory: Select the appropriate App Store territory (e.g., United States)
5. Click "Save"

**Important**: Create at least 3 different sandbox tester accounts to test different scenarios:
- One for testing monthly subscriptions
- One for testing yearly subscriptions
- One for testing lifetime purchases

## Step 2: Configure the Test Device

1. On your iOS test device, go to Settings > App Store
2. Sign out of your current Apple ID
3. Do not sign in with any account yet (you'll be prompted during testing)

## Step 3: Prepare the App for Testing

1. Ensure the app is built with the correct bundle identifier that matches your App Store Connect configuration
2. Verify that the product IDs in the app match those configured in App Store Connect
3. Make sure the app is signed with a valid development certificate

## Step 4: Run the App and Access the IAP Test Screen

1. Launch the app on your iOS device
2. Navigate to the IAP Test Screen by tapping "Open IAP Test Screen" on the home screen
3. Ensure the "Use Mock Implementation" toggle is set to OFF to use the real implementation

## Step 5: Test Product Fetching

1. When the IAP Test Screen loads, it should automatically fetch products from the App Store
2. Verify that all expected products appear in the "Available Products" section
3. Check that product details (title, description, price) match your App Store Connect configuration

## Step 6: Test Purchase Flow

1. Select a product to purchase by tapping its "Purchase" button
2. When prompted to sign in, use one of your sandbox tester accounts
3. Follow the on-screen instructions to complete the purchase
4. The purchase should complete without charging real money
5. Verify that the app updates to reflect the purchase (subscription status should update)

## Step 7: Test Purchase Restoration

1. Sign out of the app or reinstall it to simulate a new installation
2. Navigate to the IAP Test Screen
3. Tap the "Restore Purchases" button
4. When prompted, sign in with the same sandbox account used for purchases
5. Verify that previously purchased products are restored and reflected in the UI

## Step 8: Test Subscription Management

1. For subscription products, verify that the subscription status shows correctly:
   - Active status
   - Correct plan type
   - Correct expiration date
2. Note that in the sandbox environment, subscription periods are shortened:
   - 1 month → 5 minutes
   - 1 year → 1 hour

## Step 9: Test Receipt Verification

1. After making a purchase, check the app logs for receipt verification
2. Verify that the receipt is sent to the backend
3. Confirm that the backend successfully validates the receipt
4. Check that the user's entitlements are updated accordingly

## Troubleshooting Common Issues

### "This Apple ID has not yet been used with the App Store"
- Solution: Open the App Store app with the sandbox account and accept the terms and conditions

### "Cannot connect to iTunes Store"
- Solution: Ensure you're using a valid sandbox tester account and not a regular Apple ID

### "Product not available"
- Solution: Verify that the product ID in the app matches the one in App Store Connect
- Make sure the product is approved and active in App Store Connect

### "Receipt verification failed"
- Solution: Check the backend logs for specific error messages
- Verify that the backend is configured to use the sandbox verification URL

## Testing Checklist

Use the `IAP_TESTING_TRACKER.md` document to track your progress through the testing process. Mark each test case as completed and note any issues encountered.

## Reporting Issues

If you encounter any issues during testing, document them with:
1. Detailed steps to reproduce
2. Screenshots if applicable
3. Error messages from the app logs
4. Device and iOS version information

Add these to the "Issues Found" section of the `IAP_TESTING_TRACKER.md` document.
