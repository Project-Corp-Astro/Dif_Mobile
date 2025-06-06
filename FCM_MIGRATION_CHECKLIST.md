# FCM Migration Checklist

Use this checklist to track the completion of all tasks required for the migration from Expo Notifications to Firebase Cloud Messaging (FCM).

## Android Configuration

- [x] Add Firebase SDK to `build.gradle`
- [x] Update `MainApplication.kt` to initialize Firebase
- [x] Create custom `FirebaseMessagingService` implementation
- [x] Update `AndroidManifest.xml` with required permissions and service declarations
- [x] Place `google-services.json` in the correct location (`android/app/`)
- [x] Configure default notification channel

## iOS Configuration

- [x] Add Firebase SDK to Podfile
- [x] Place `GoogleService-Info.plist` in the correct location
- [x] Update `AppDelegate.swift` to initialize Firebase (if needed)
- [x] Configure notification capabilities in Xcode
- [ ] Add notification extension for rich notifications (optional)

## Frontend Implementation

- [x] Create `FirebaseMessagingService` class
- [x] Implement `useFCM` hook
- [x] Create `NotificationManager` component
- [x] Update `App.tsx` to initialize Firebase
- [x] Create FCM test screen
- [x] Implement token registration with backend
- [ ] Implement notification handling for all app states
- [ ] Implement deep linking from notifications

## Backend Implementation

- [x] Install Firebase Admin SDK
- [x] Create notification service
- [x] Create user notification controller
- [x] Add API routes for FCM token management
- [x] Update User model with FCM token field
- [x] Create migration script for transitioning from Expo tokens
- [x] Implement scheduled notifications
- [x] Create test scripts for sending notifications

## Testing

- [x] Create testing plan
- [x] Create testing scripts
- [ ] Test token generation and registration
- [ ] Test notification reception in foreground
- [ ] Test notification reception in background
- [ ] Test notification reception in killed state
- [ ] Test topic subscriptions
- [ ] Test notification actions and deep linking
- [ ] Test on multiple Android devices
- [ ] Test on multiple iOS devices

## Documentation

- [x] Update FCM migration guide
- [x] Create FCM testing guide
- [x] Create FCM testing plan
- [x] Document backend API endpoints
- [ ] Document notification payload structure
- [ ] Create troubleshooting guide

## Cleanup

- [x] Remove Expo Notifications dependencies
- [x] Remove Expo Notifications code from usePermissions.ts
- [x] Update app.config.ts to remove Expo Notifications plugin
- [ ] Clean up any temporary testing code

## Deployment

- [ ] Update CI/CD pipeline for FCM configuration
- [ ] Deploy updated backend
- [ ] Submit updated app to app stores
- [ ] Monitor notification delivery and performance
