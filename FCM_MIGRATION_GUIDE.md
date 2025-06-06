# Firebase Cloud Messaging (FCM) Migration Guide

This guide documents the process of migrating from Expo Notifications to Firebase Cloud Messaging (FCM) in the Corp Astro mobile app.

## Completed Steps

1. ✅ **Firebase Project Setup**
   - Created Firebase project
   - Registered iOS and Android apps
   - Downloaded configuration files:
     - `google-services.json` for Android
     - `GoogleService-Info.plist` for iOS
   - Placed configuration files in `/firebase` directory

2. ✅ **App Configuration**
   - Updated `app.json` to include Firebase configuration
   - Added paths to Firebase configuration files
   - Added required plugins for Firebase

3. ✅ **Firebase Integration**
   - Installed Firebase packages:
     - `@react-native-firebase/app`
     - `@react-native-firebase/messaging`
     - `expo-build-properties`
   - Created Firebase initialization service
   - Created Firebase Messaging service

4. ✅ **FCM Hook Implementation**
   - Created `useFCM` hook to replace `useNotifications`
   - Implemented notification permission handling
   - Implemented token management
   - Added foreground and background notification handlers

5. ✅ **UI Components**
   - Created `NotificationManager` component for testing FCM

## Next Steps

1. **Generate Native Projects**
   ```bash
   npx expo prebuild
   ```
   This will create the native iOS and Android projects with Firebase configuration.

2. **Test FCM Implementation**
   - Run the app on a physical device
   - Test permission requests
   - Verify FCM token generation
   - Test receiving notifications in foreground and background

3. **Update Backend API**
   - Update your backend to use Firebase Admin SDK for sending notifications
   - Update user token storage to use FCM tokens instead of Expo tokens

4. **Test End-to-End**
   - Send test notifications from your backend
   - Verify notification delivery and handling

## Firebase Admin SDK (Backend) Implementation

To send notifications from your backend, you'll need to use the Firebase Admin SDK. Here's a sample implementation in Node.js:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Function to send a notification to a specific device
async function sendNotification(fcmToken, title, body, data = {}) {
  const message = {
    notification: {
      title,
      body
    },
    data,
    token: fcmToken
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Function to send a notification to multiple devices
async function sendMulticastNotification(fcmTokens, title, body, data = {}) {
  const message = {
    notification: {
      title,
      body
    },
    data,
    tokens: fcmTokens
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log(
      `${response.successCount} messages were sent successfully, ${response.failureCount} failed`
    );
    return response;
  } catch (error) {
    console.error('Error sending multicast message:', error);
    throw error;
  }
}

// Function to send a notification to a topic
async function sendTopicNotification(topic, title, body, data = {}) {
  const message = {
    notification: {
      title,
      body
    },
    data,
    topic
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message to topic:', response);
    return response;
  } catch (error) {
    console.error('Error sending message to topic:', error);
    throw error;
  }
}
```

## Troubleshooting

### Common Issues

1. **Missing Google Services Files**
   - Ensure `google-services.json` and `GoogleService-Info.plist` are in the correct locations
   - Check paths in `app.json`

2. **iOS Build Issues**
   - Make sure CocoaPods is installed and up to date
   - Try running `cd ios && pod install` after prebuild

3. **Android Build Issues**
   - Check that the package name in `app.json` matches the one in Firebase console
   - Ensure Google Play services are up to date on test devices

4. **Notification Permissions**
   - iOS requires explicit permission requests
   - Android permissions are granted by default but can be revoked

5. **Notification Not Showing**
   - Check if the app is in foreground (foreground notifications need manual handling)
   - Verify the FCM token is correctly sent to the backend
   - Check notification channel settings on Android

## Backend Integration

The following backend components have been created to support FCM:

### 1. Notification Service

A new `notificationService.ts` has been created in the backend to handle sending FCM notifications:

```typescript
// src/services/notificationService.ts
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Try to use service account file first
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './firebase-service-account.json';
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath)
    });
  } catch (error) {
    // Fall back to application default credentials
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  }
}

export class NotificationService {
  static async sendNotification(fcmToken, title, body, data = {}) { ... }
  static async sendMulticastNotification(fcmTokens, title, body, data = {}) { ... }
  static async sendTopicNotification(topic, title, body, data = {}) { ... }
  static async subscribeToTopic(fcmToken, topic) { ... }
  static async unsubscribeFromTopic(fcmToken, topic) { ... }
}
```

### 2. User Notification Controller

A controller for managing user FCM tokens and notification preferences:

```typescript
// src/controllers/userNotificationController.ts
export class UserNotificationController {
  static async saveFCMToken(req, res) { ... }
  static async updateNotificationPreferences(req, res) { ... }
  static async sendTestNotification(req, res) { ... }
}
```

### 3. API Routes

API routes for FCM token management:

```typescript
// src/routes/notificationRoutes.ts
import express from 'express';
import { UserNotificationController } from '../controllers/userNotificationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/fcm-token', authMiddleware, UserNotificationController.saveFCMToken);
router.put('/preferences', authMiddleware, UserNotificationController.updateNotificationPreferences);
router.post('/test/:userId', authMiddleware, UserNotificationController.sendTestNotification);

export default router;
```

### 4. Frontend Integration

The frontend has been updated to register FCM tokens with the backend:

```typescript
// services/notificationApi.ts
export const NotificationApi = {
  async registerFCMToken(fcmToken) { ... },
  async updateNotificationPreferences(preferences) { ... },
  async requestTestNotification() { ... }
}
```

## Testing FCM Integration

A `NotificationManager` component has been created to test the FCM integration:

1. Register for notifications to get an FCM token
2. Register the token with the backend
3. Request a test notification from the backend
4. Observe the notification being received in the app

## Migration Scripts

### FCM Token Migration Script

A migration script has been created to help transition users from Expo Push Tokens to FCM tokens:

```typescript
// src/scripts/migrateFCMTokens.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, IUser } from '../models/User';
import logger from '../utils/logger';

// Main migration function
const migrateFCMTokens = async (clearExpoTokens: boolean = false): Promise<void> => {
  try {
    // Find users with expoPushToken but no fcmToken
    const usersWithExpoToken = await User.find({
      expoPushToken: { $exists: true, $ne: null },
      fcmToken: { $exists: false }
    });

    // Find users with fcmToken
    const usersWithFCMToken = await User.find({
      fcmToken: { $exists: true, $ne: null }
    });

    // Log statistics
    logger.info(`Total users with Expo Push Token only: ${usersWithExpoToken.length}`);
    logger.info(`Total users with FCM Token: ${usersWithFCMToken.length}`);

    // If clearExpoTokens flag is set, clear expoPushTokens for users with fcmToken
    if (clearExpoTokens) {
      const updateResult = await User.updateMany(
        { fcmToken: { $exists: true, $ne: null } },
        { $unset: { expoPushToken: "" } }
      );
      
      logger.info(`Updated ${updateResult.modifiedCount} users. Removed Expo Push Tokens.`);
    }
  } catch (error) {
    logger.error('Error during FCM token migration:', error);
  }
};
```

Run the migration script using:

```bash
# View statistics only
npm run migrate-fcm

# Clear Expo tokens for users with FCM tokens
npm run migrate-fcm -- --clear-expo-tokens
```

### FCM Testing Script

A testing script has been created to send test notifications:

```bash
# Send to all users
npm run test-fcm

# Send to a specific user
npm run test-fcm -- --userId=<user_id>

# Send to a topic
npm run test-fcm -- --topic=test-topic
```

## Final Migration Steps

1. **Test on Physical Devices**:
   - Use the `run-fcm-test.sh` script in the mobile app directory
   - Test on both Android and iOS devices
   - Verify notifications in foreground, background, and killed states
   - Test topic subscriptions and notification actions

2. **Run Migration Script**:
   - Start by running `npm run migrate-fcm` to see statistics
   - Once confident, run `npm run migrate-fcm -- --clear-expo-tokens`
   - Monitor logs for any errors during migration

3. **Remove Legacy Code**:
   - Remove Expo Notifications dependencies from package.json
   - Remove any Expo Notifications imports and hooks
   - Update documentation to reflect FCM usage

4. **Production Deployment**:
   - Update CI/CD pipeline for FCM configuration
   - Ensure Firebase config files are securely managed
   - Deploy updated app to app stores

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase](https://rnfirebase.io/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Expo Firebase Documentation](https://docs.expo.dev/guides/using-firebase/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
