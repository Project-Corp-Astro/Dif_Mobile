# In-App Purchase Migration Guide

## Overview

This document outlines the migration process from Expo's in-app purchase system (`expo-in-app-purchases`) to React Native IAP (`react-native-iap`). This migration is necessary to provide more reliable in-app purchase functionality, better typings, and improved maintenance.

## Table of Contents

1. [Current Implementation](#current-implementation)
2. [Migration Goals](#migration-goals)
3. [Migration Steps](#migration-steps)
4. [Testing Plan](#testing-plan)
5. [Rollback Plan](#rollback-plan)
6. [Timeline](#timeline)

## Current Implementation

The Corp Astro mobile app currently uses `expo-in-app-purchases` (v14.5.0) for handling subscriptions and purchases. The implementation is contained primarily in:

- `hooks/useSubscription.ts`: A custom hook that manages the entire purchase flow
- Product types defined as enums: `SubscriptionPlan` and `ProductType`
- Platform-specific product IDs in a configuration object

The current implementation handles:
- Connecting to the store
- Fetching available products
- Processing purchases
- Tracking subscription status
- Handling purchase history
- Restoring purchases

## Migration Goals

1. Replace `expo-in-app-purchases` with `react-native-iap`
2. Maintain the same API surface for the rest of the application
3. Preserve all existing functionality
4. Improve type safety and error handling
5. Ensure backward compatibility with existing purchases

## Migration Steps

### 1. Install Dependencies

```bash
# Remove expo-in-app-purchases
npm uninstall expo-in-app-purchases

# Install react-native-iap
npm install react-native-iap
```

### 2. Create New Implementation

Create a new hook (`useIAP.ts`) that will replace the existing `useSubscription.ts`. The new hook should:

- Maintain the same interface as the existing hook
- Use `react-native-iap` for all purchase-related functionality
- Preserve the existing business logic

### 3. Update Types and Constants

Update the following to work with `react-native-iap`:
- Product types
- Subscription plans
- Platform-specific product IDs

### 4. Implement Core Functionality

Implement the following core functionality:
- Initialize IAP connection
- Fetch products
- Purchase products
- Restore purchases
- Verify receipts
- Handle subscription status

### 5. Replace Old Implementation

Once the new implementation is tested:
- Replace imports of `useSubscription` with `useIAP`
- Remove the old implementation

## Testing Plan

### Manual Testing

Test the following scenarios on both iOS and Android:
- Fetching available products
- Purchasing each subscription type
- Restoring purchases
- Handling subscription expiration
- Handling subscription renewal
- Error scenarios (network issues, cancellation)

### Automated Testing

Create unit tests for:
- Product formatting
- Subscription status calculation
- Receipt validation logic

## Rollback Plan

If issues are encountered:
1. Revert the changes to use `expo-in-app-purchases`
2. Ensure all purchases made during the migration period are properly recorded
3. Sync purchase data with the backend

## Timeline

1. **Setup and Planning**: 1 day
   - Install dependencies
   - Create migration plan

2. **Implementation**: 2-3 days
   - Create new hook
   - Implement core functionality
   - Update types and constants

3. **Testing**: 2 days
   - Manual testing on iOS and Android
   - Fix any issues

4. **Deployment**: 1 day
   - Final testing
   - Release to app stores

## Notes

- This migration should be transparent to end users
- All existing subscriptions should continue to work
- Purchase history should be preserved
- The backend API for verifying purchases remains unchanged
