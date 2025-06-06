# In-App Purchase Developer Guide

This guide provides comprehensive documentation for developers working with the in-app purchase system in the Corp Astro mobile app. It covers the implementation details, usage patterns, and best practices.

## Architecture Overview

The in-app purchase system is built on `react-native-iap` and follows a hook-based architecture. The main components are:

1. **useIAP Hook**: Core implementation that handles all IAP functionality
2. **useIAPMock**: Mock implementation for testing without real purchases
3. **Backward Compatibility Layer**: Aliases for the previous implementation

## Core Components

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

#### Initialization

The hook automatically initializes the IAP connection when mounted and cleans up when unmounted. No manual initialization is required.

#### Product Fetching

Products are automatically fetched during initialization. The products array contains formatted product information from the store:

```typescript
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
```

#### Making Purchases

To initiate a purchase:

```typescript
// Example: Purchase a monthly subscription
const handlePurchase = async () => {
  try {
    await purchaseProduct('com.corpastro.subscription.monthly');
    // Purchase success is handled by listeners in the hook
    // No need to manually update subscription status
  } catch (error) {
    console.error('Purchase failed:', error);
  }
};
```

#### Restoring Purchases

To restore previous purchases:

```typescript
const handleRestore = async () => {
  try {
    await restorePurchases();
    // Restoration success is handled by the hook
    // Subscription status will update automatically
  } catch (error) {
    console.error('Restore failed:', error);
  }
};
```

#### Subscription Status

The `subscriptionStatus` object contains the current subscription state:

```typescript
interface SubscriptionStatus {
  isActive: boolean;
  plan: SubscriptionPlan | null;
  expiryDate: Date | null;
  isLifetime: boolean;
  isTrialActive: boolean;
  trialEndDate: Date | null;
}
```

Use this to conditionally render UI elements based on subscription state:

```typescript
// Example: Conditional rendering based on subscription status
{subscriptionStatus.isActive ? (
  <PremiumContent plan={subscriptionStatus.plan} />
) : (
  <SubscriptionOfferScreen />
)}
```

### Error Handling

The hook integrates with the app's error reporting system. Errors are categorized by severity and type:

```typescript
// Example: Custom error handling
try {
  await purchaseProduct('com.corpastro.subscription.monthly');
} catch (error) {
  // The hook already reports errors internally
  // Additional custom handling if needed
  if (error.code === 'E_USER_CANCELLED') {
    // User cancelled, no need to show error
    return;
  }
  
  // Show user-friendly error message
  showErrorMessage('Unable to complete purchase. Please try again later.');
}
```

## Testing

### Using the Test Screen

The app includes a dedicated test screen for IAP functionality:

1. Navigate to the test screen from the app's debug menu
2. Toggle between real and mock implementations
3. Test product fetching, purchases, and restoration

### Using the Mock Implementation

For development without real purchases:

```typescript
import { useIAPMock } from '../hooks/useIAPMock';

// Use the mock hook instead of the real one
const {
  products,
  purchaseProduct,
  // ... other properties
} = useIAPMock();
```

## Backend Integration

### Receipt Verification

The IAP system sends purchase receipts to the backend for verification:

1. After a purchase completes, the receipt/token is extracted
2. The receipt is sent to the Supabase function `verify-purchase`
3. The backend verifies with Apple/Google servers
4. The backend updates the user's entitlements

Developers should not need to modify this flow, but should be aware of it for debugging purposes.

## Best Practices

1. **Always check subscription status before showing premium content**
2. **Handle loading and error states in the UI**
3. **Don't store subscription status in local state outside the hook**
4. **Use the provided analytics events for monitoring**
5. **Test thoroughly with sandbox accounts before deployment**

## Troubleshooting

### Common Issues

1. **Products not loading**
   - Check product IDs in the app match those in App Store Connect/Google Play Console
   - Verify the app is properly signed

2. **Purchases not completing**
   - Check receipt verification in the backend logs
   - Verify sandbox test accounts are properly configured

3. **Subscription status not updating**
   - Check the purchase listener is working correctly
   - Verify the receipt verification response is being processed

### Debugging Tools

1. **IAPTestScreen**: Use the built-in test screen to debug IAP functionality
2. **Backend Logs**: Check Supabase logs for receipt verification issues
3. **Analytics**: Review IAP analytics events for funnel drop-offs

## Migration from Previous Implementation

If you encounter code still using the old implementation:

1. Replace imports:
   ```typescript
   // Before
   import { useSubscription } from '../hooks/useSubscription';
   
   // After
   import { useIAP } from '../hooks/useIAP';
   ```

2. Update hook usage (interface is the same):
   ```typescript
   // Before
   const { products, subscriptionStatus } = useSubscription();
   
   // After
   const { products, subscriptionStatus } = useIAP();
   ```

3. Update type imports:
   ```typescript
   // Before
   import { SubscriptionStatus } from '../hooks/useSubscription';
   
   // After
   import { SubscriptionStatus } from '../hooks/useIAP';
   ```
