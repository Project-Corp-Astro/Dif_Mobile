# IAP Integration Guide

## Overview

This guide provides instructions for integrating the new In-App Purchase system based on `react-native-iap` into the Corp Astro mobile application. It covers how to migrate from the previous `expo-in-app-purchases` implementation to the new system.

## Table of Contents

1. [Migration Summary](#migration-summary)
2. [API Reference](#api-reference)
3. [Integration Steps](#integration-steps)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)

## Migration Summary

We've migrated from Expo's deprecated `expo-in-app-purchases` to the more robust and well-typed `react-native-iap` library. The new implementation:

- Maintains the same public interface as the previous hook
- Provides better TypeScript support
- Includes improved error handling
- Supports all existing subscription plans and purchase types
- Maintains compatibility with the backend receipt verification system

## API Reference

### useIAP Hook

The `useIAP` hook is the main entry point for all in-app purchase functionality:

```typescript
import { useIAP } from '../hooks/useIAP';

const {
  products,          // Available products from the store
  purchases,         // User's purchase history
  subscriptionStatus, // Current subscription status
  isLoading,         // Loading state
  error,             // Error state
  purchaseProduct,   // Function to purchase a product
  restorePurchases,  // Function to restore previous purchases
} = useIAP();
```

### Types

```typescript
// Product types
enum ProductType {
  SUBSCRIPTION = 'subscription',
  ONE_TIME = 'one-time',
}

// Subscription plans
enum SubscriptionPlan {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  LIFETIME = 'lifetime',
}

// Product interface
interface Product {
  id: string;
  type: ProductType;
  title: string;
  description: string;
  price: string;
  priceValue: number;
  currency: string;
  subscriptionPeriod?: string;
  introductoryPrice?: string;
  introductoryPriceValue?: number;
  introductoryPricePeriod?: string;
}

// Purchase interface
interface Purchase {
  productId: string;
  transactionId: string;
  purchaseTime: number;
  expirationDate?: Date;
  isTrialPeriod?: boolean;
  price?: string;
}

// Subscription status interface
interface SubscriptionStatus {
  isActive: boolean;
  plan: SubscriptionPlan | null;
  expiryDate: Date | null;
  isLifetime: boolean;
  isTrialActive: boolean;
  trialEndDate: Date | null;
}
```

## Integration Steps

### 1. Replace Import Statements

Replace imports of `useSubscription` with `useIAP`:

```typescript
// Before
import { useSubscription } from '../hooks/useSubscription';

// After
import { useIAP } from '../hooks/useIAP';
```

### 2. Update Hook Usage

The hook usage remains the same, but you may need to update any references to specific properties or methods:

```typescript
// Before
const {
  products,
  subscriptionStatus,
  purchaseProduct,
  restorePurchases,
} = useSubscription();

// After - same interface
const {
  products,
  subscriptionStatus,
  purchaseProduct,
  restorePurchases,
} = useIAP();
```

### 3. Update TypeScript Types

If you're importing types from the subscription hook, update the imports:

```typescript
// Before
import { SubscriptionStatus, SubscriptionPlan } from '../hooks/useSubscription';

// After
import { SubscriptionStatus, SubscriptionPlan } from '../hooks/useIAP';
```

### 4. Test Integration

After updating imports and usage, test the integration using the provided `IAPTestScreen`:

```typescript
import { IAPTestNavigator } from '../navigation/IAPTestNavigator';

// Add to your navigation stack for testing
<Stack.Screen name="IAPTest" component={IAPTestNavigator} />
```

## Testing

### Using the Test Screen

We've created a dedicated test screen to help verify the IAP functionality:

1. Navigate to the `IAPTestScreen` in the app
2. Toggle between real and mock implementations
3. Test product fetching, purchases, and restoration
4. Verify subscription status display

### Using the Mock Implementation

For development and testing without making actual purchases:

```typescript
import { useIAPMock } from '../hooks/useIAPMock';

// Use the mock implementation directly
const {
  products,
  subscriptionStatus,
  purchaseProduct,
  restorePurchases,
} = useIAPMock();
```

### Testing in Sandbox Environments

For testing with actual store sandbox environments:

1. Set up sandbox test accounts for App Store and Google Play
2. Use the real implementation with sandbox accounts
3. Follow the [IAP Testing Plan](./IAP_TESTING_PLAN.md) for comprehensive testing

## Troubleshooting

### Common Issues

#### Products Not Loading

- Verify product IDs are correctly configured
- Check internet connectivity
- Ensure the app is properly signed for store access

```typescript
// Debug product loading
console.log('Products:', products);
```

#### Purchase Errors

- Check error messages for specific issues
- Verify receipt validation is working correctly
- Ensure backend services are accessible

```typescript
// Handle purchase errors
try {
  await purchaseProduct(productId);
} catch (err) {
  console.error('Purchase error:', err);
  // Show appropriate error message to user
}
```

#### Subscription Status Issues

- Verify purchase data is being processed correctly
- Check date handling for expiration calculations
- Ensure receipt validation is updating subscription status

```typescript
// Debug subscription status
console.log('Subscription status:', subscriptionStatus);
```

### Error Reporting

All IAP errors are reported through the application's error reporting system:

```typescript
// Error structure
{
  code: string;      // Error code
  message: string;   // Human-readable message
  technical: string; // Technical details
  severity: ErrorSeverity; // Error severity
}
```

## Additional Resources

- [IAP Testing Plan](./IAP_TESTING_PLAN.md)
- [IAP Migration Next Steps](./IAP_MIGRATION_NEXT_STEPS.md)
- [IAP Integration Test Plan](./IAP_INTEGRATION_TEST_PLAN.md)
- [React Native IAP Documentation](https://github.com/dooboolab/react-native-iap)
