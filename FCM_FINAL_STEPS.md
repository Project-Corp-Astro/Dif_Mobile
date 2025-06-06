# FCM Migration: Final Implementation Steps

This document outlines the final steps needed to complete the FCM migration for the Corp Astro mobile app.

## 1. Testing on Physical Devices

### Android Testing
1. Connect an Android device
2. Run the following commands:
```bash
cd /Users/apple/Apps/We\ are\ building\ New/corp-astro-mobile
./run-fcm-test.sh
# Select option 3 to build the development client
# Select option 1 to run on Android device
```

### iOS Testing
1. Connect an iOS device
2. Run the following commands:
```bash
cd /Users/apple/Apps/We\ are\ building\ New/corp-astro-mobile
./run-fcm-test.sh
# Select option 3 to build the development client
# Select option 2 to run on iOS device
```

## 2. Run Migration Script

Once testing confirms that FCM tokens are being generated and registered correctly:

```bash
cd /Users/apple/Apps/We\ are\ building\ New/corp-astro-api

# First, check migration status (view statistics only)
npm run migrate-fcm

# Then, run the full migration to clear Expo tokens
npm run migrate-fcm -- --clear-expo-tokens
```

## 3. Final Cleanup Tasks

1. **Remove any remaining Expo Notifications references**:
   - Check for any imports of `expo-notifications` in other files
   - Remove any remaining Expo notification handling code

2. **Update package-lock.json**:
   ```bash
   cd /Users/apple/Apps/We\ are\ building\ New/corp-astro-mobile
   npm install
   ```

3. **Clean up temporary test code**:
   - Consider whether to keep or remove the FCMTestScreen
   - Remove any console.log statements used for debugging

## 4. Production Deployment Preparation

1. **Ensure Firebase config files are secured**:
   - Verify that `google-services.json` and `GoogleService-Info.plist` are properly handled in CI/CD
   - Make sure Firebase service account credentials are securely stored

2. **Update CI/CD pipeline**:
   - Add steps to include Firebase configuration files in the build
   - Update environment variables for Firebase Admin SDK

3. **Final Testing**:
   - Complete all items in the FCM_TESTING_PLAN.md
   - Document any issues found and their resolutions

## 5. Post-Deployment Monitoring

1. **Monitor notification delivery rates**:
   - Set up logging for notification send attempts and successes
   - Track user engagement with notifications

2. **Optimize notification performance**:
   - Fine-tune notification delivery timing
   - Optimize payload sizes for better performance

## Completion Criteria

The FCM migration can be considered complete when:

1. All users have been migrated from Expo Push Tokens to FCM tokens
2. Notifications are reliably delivered in all app states (foreground, background, killed)
3. All legacy Expo Notifications code has been removed
4. The updated app has been deployed to production
5. No notification-related issues are reported by users
