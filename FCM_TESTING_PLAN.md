# FCM Integration Testing Plan

This document outlines a systematic approach to testing the Firebase Cloud Messaging (FCM) integration in the Corp Astro mobile app.

## Testing Environment Setup

### Backend Setup
1. ✅ Install Firebase Admin SDK
2. ✅ Configure Firebase service account credentials
3. ✅ Update notification service to handle FCM tokens
4. ✅ Create test scripts for sending notifications

### Frontend Setup
1. ✅ Configure Firebase in the mobile app
2. ✅ Implement FCM token registration
3. ✅ Create notification handling for foreground/background states
4. ✅ Build UI for testing FCM functionality

## Test Scenarios

### 1. Token Generation and Registration

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Generate FCM Token | 1. Launch app<br>2. Tap "Register for Notifications" | FCM token is generated and displayed | ⏳ |
| Register Token with Backend | 1. Generate FCM token<br>2. Tap "Register Token with Backend" | Success message displayed | ⏳ |
| Token Persistence | 1. Generate token<br>2. Close app<br>3. Reopen app | Same FCM token is displayed | ⏳ |

### 2. Notification Reception

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Foreground Notification | 1. Keep app in foreground<br>2. Send test notification | Notification displayed in app UI | ⏳ |
| Background Notification | 1. Put app in background<br>2. Send test notification | Notification appears in system tray | ⏳ |
| Killed State Notification | 1. Force close app<br>2. Send test notification | Notification appears in system tray<br>App processes notification when opened | ⏳ |

### 3. Topic Subscription

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Subscribe to Topic | 1. Generate FCM token<br>2. Tap "Subscribe to Test Topic" | Success message displayed | ⏳ |
| Topic Notification | 1. Subscribe to topic<br>2. Send notification to topic | Notification received on device | ⏳ |

### 4. Notification Actions

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Tap Notification (Foreground) | 1. Receive notification in foreground<br>2. Tap notification | Notification handler called<br>App navigates as specified | ⏳ |
| Tap Notification (Background) | 1. Receive notification in background<br>2. Tap notification | App brought to foreground<br>Notification data processed | ⏳ |
| Deep Link Handling | 1. Send notification with deep link<br>2. Tap notification | App navigates to specified screen | ⏳ |

### 5. Error Handling

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Invalid FCM Token | 1. Modify FCM token to be invalid<br>2. Send notification | Backend handles error gracefully | ⏳ |
| Permission Denied | 1. Deny notification permissions<br>2. Attempt to register | App handles rejection gracefully | ⏳ |
| Network Error | 1. Enable airplane mode<br>2. Attempt to register token | App shows appropriate error message | ⏳ |

## Platform-Specific Tests

### Android

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Notification Channel | 1. Send notification<br>2. Check notification settings | Notification appears in correct channel | ⏳ |
| Background Service | 1. Force stop app<br>2. Send notification | Service handles notification correctly | ⏳ |
| Custom Sound/Icon | 1. Send notification with custom sound/icon<br>2. Observe notification | Custom sound/icon displayed correctly | ⏳ |

### iOS

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Permission Dialog | 1. Fresh install<br>2. Register for notifications | iOS permission dialog appears | ⏳ |
| Silent Notifications | 1. Send silent notification<br>2. Observe behavior | App processes data without UI notification | ⏳ |
| Notification Categories | 1. Register notification categories<br>2. Send notification with category<br>3. Observe actions | Category actions displayed correctly | ⏳ |

## Execution Instructions

1. Start with token generation and registration tests
2. Proceed to basic notification reception tests
3. Test topic subscription functionality
4. Verify notification actions and deep linking
5. Test error handling scenarios
6. Complete platform-specific tests

## Test Results Documentation

For each test case, document:
- Date and time of test
- Device model and OS version
- Test result (Pass/Fail)
- Screenshots or logs if applicable
- Any unexpected behavior

## Regression Testing

After completing all tests, perform regression testing to ensure:
1. Original app functionality works correctly
2. No performance degradation
3. Battery consumption is reasonable
4. App stability is maintained

## Sign-off Criteria

The FCM integration will be considered complete when:
1. All test cases pass on both Android and iOS
2. No critical or high-priority bugs are open
3. Performance metrics meet acceptable thresholds
4. Documentation is updated to reflect the new implementation
