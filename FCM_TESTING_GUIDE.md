# FCM Integration Testing Guide

This guide outlines the steps to test the Firebase Cloud Messaging (FCM) integration in the Corp Astro mobile app.

## Prerequisites

1. Android or iOS device with the Corp Astro app installed
2. Backend server running locally or deployed
3. Firebase project configured with FCM enabled
4. Firebase Admin SDK credentials configured on the backend

## Testing Flow

### 1. Token Registration

1. Launch the app on your device
2. Navigate to the NotificationManager screen
3. Tap "Register for Notifications" to request permissions and get an FCM token
4. Verify that an FCM token is displayed on the screen
5. Tap "Register Token with Backend" to send the token to the backend
6. Verify that the success message appears

### 2. Test Notification from App

1. With the app in the foreground, tap "Request Test Notification"
2. Verify that a notification is received and displayed in the app
3. Check that the notification appears in the "Latest Notification" section

### 3. Test Notification from Backend

Run the test script on the backend:

```bash
# Send to all users
npm run test-fcm

# Send to a specific user
npm run test-fcm -- --userId=<user_id>

# Send to a topic
npm run test-fcm -- --topic=daily-horoscope
```

Verify that:
- Foreground notifications are displayed in the app
- Background notifications appear in the notification tray
- Tapping a notification opens the app correctly

### 4. Testing Different App States

Test notifications in different app states:

1. **Foreground**: App is open and visible
   - Notification should be handled by the foreground handler
   - Should be displayed in the app UI

2. **Background**: App is running but not in focus
   - Notification should appear in the system notification tray
   - Tapping should bring the app to the foreground

3. **Killed/Terminated**: App is not running
   - Notification should appear in the system notification tray
   - Tapping should launch the app
   - Initial notification should be processed

### 5. Testing Notification Preferences

1. Update notification preferences in the app
2. Verify that preferences are saved to the backend
3. Test that notifications respect user preferences

## Troubleshooting

### Common Issues

1. **No FCM Token Generated**
   - Check Firebase configuration files are correctly placed
   - Verify Firebase initialization in MainApplication.kt (Android) or AppDelegate.swift (iOS)

2. **Token Not Registering with Backend**
   - Check network connectivity
   - Verify authentication token is valid
   - Check backend logs for errors

3. **Notifications Not Received**
   - Verify permissions are granted on the device
   - Check that the FCM token is valid and registered
   - Verify the notification payload format
   - Check Firebase Console for delivery reports

### Debugging Tools

1. **Firebase Console**
   - Use the Firebase Console to send test messages
   - Check delivery reports in the Firebase Console

2. **Backend Logs**
   - Check backend logs for FCM API errors
   - Verify that tokens are being stored correctly

3. **Device Logs**
   - Use `adb logcat` on Android or Xcode console on iOS to view logs
   - Filter logs for FCM-related messages: `adb logcat -s FirebaseMessaging`

## Verification Checklist

- [ ] FCM token is generated successfully
- [ ] Token is registered with backend
- [ ] Foreground notifications are displayed in-app
- [ ] Background notifications appear in notification tray
- [ ] Killed state notifications launch the app
- [ ] Notification data is processed correctly
- [ ] Deep links in notifications work as expected
- [ ] User notification preferences are respected
