# IAP Analytics Tracking Plan

This document outlines the analytics events that should be tracked for monitoring the in-app purchase system after deployment.

## Key Metrics to Monitor

### 1. Purchase Funnel

| Event Name | Description | Parameters | When to Trigger |
|------------|-------------|------------|----------------|
| `iap_product_view` | User viewed product details | `product_id`, `product_type`, `price` | When product details are displayed |
| `iap_purchase_initiated` | User started purchase flow | `product_id`, `product_type`, `price` | When user taps purchase button |
| `iap_purchase_successful` | Purchase completed successfully | `product_id`, `product_type`, `price`, `transaction_id` | After purchase is verified |
| `iap_purchase_failed` | Purchase failed | `product_id`, `error_code`, `error_message` | When purchase process fails |
| `iap_purchase_cancelled` | User cancelled purchase | `product_id`, `product_type`, `step_cancelled` | When user cancels during purchase flow |

### 2. Subscription Lifecycle

| Event Name | Description | Parameters | When to Trigger |
|------------|-------------|------------|----------------|
| `subscription_started` | New subscription started | `plan_type`, `is_trial`, `price` | After subscription purchase verified |
| `subscription_renewed` | Subscription renewed | `plan_type`, `price`, `renewal_count` | After renewal verification |
| `subscription_cancelled` | Subscription cancelled | `plan_type`, `time_remaining_days`, `reason` (if available) | When cancellation detected |
| `subscription_expired` | Subscription expired | `plan_type`, `was_cancelled` | When expiration detected |

### 3. Receipt Verification

| Event Name | Description | Parameters | When to Trigger |
|------------|-------------|------------|----------------|
| `receipt_verification_started` | Started verifying receipt | `platform`, `product_id` | When sending receipt to backend |
| `receipt_verification_success` | Receipt verified successfully | `platform`, `product_id`, `verification_time_ms` | When backend confirms valid receipt |
| `receipt_verification_failed` | Receipt verification failed | `platform`, `product_id`, `error_code`, `error_message` | When backend rejects receipt |

### 4. Restoration

| Event Name | Description | Parameters | When to Trigger |
|------------|-------------|------------|----------------|
| `restore_purchases_initiated` | User initiated restore | `platform` | When restore button tapped |
| `restore_purchases_success` | Purchases restored successfully | `platform`, `products_restored_count` | After restoration completes |
| `restore_purchases_empty` | No purchases to restore | `platform` | When restore returns no purchases |
| `restore_purchases_failed` | Restore process failed | `platform`, `error_code`, `error_message` | When restore process fails |

## Implementation in useIAP Hook

The `useIAP` hook should be updated to include these analytics events at the appropriate points in the purchase flow. Example implementation:

```typescript
// In purchaseProduct function
const purchaseProduct = async (productId: string) => {
  try {
    // Track purchase initiation
    analytics.trackEvent('iap_purchase_initiated', {
      product_id: productId,
      product_type: getProductType(productId),
      price: getProductPrice(productId)
    });
    
    // Existing purchase logic...
    
    // Track successful purchase
    analytics.trackEvent('iap_purchase_successful', {
      product_id: productId,
      product_type: getProductType(productId),
      price: getProductPrice(productId),
      transaction_id: purchase.transactionId
    });
  } catch (err) {
    // Track failed purchase
    analytics.trackEvent('iap_purchase_failed', {
      product_id: productId,
      error_code: err.code || 'unknown',
      error_message: err.message || 'Unknown error'
    });
    throw err;
  }
};
```

## Dashboard Setup

Create a dedicated IAP monitoring dashboard with the following visualizations:

1. **Purchase Funnel Conversion Rate**
   - Visualize drop-off at each step of the purchase process
   - Filter by product type, platform, and time period

2. **Purchase Success Rate**
   - Track percentage of successful purchases vs. failures
   - Break down by product type and platform

3. **Receipt Verification Success Rate**
   - Monitor backend verification success rate
   - Alert if drops below 95%

4. **Subscription Retention**
   - Track renewal rates for subscriptions
   - Identify churn patterns

5. **Error Distribution**
   - Visualize most common error types
   - Filter by platform and product type

## Alerting Rules

Set up alerts for the following conditions:

1. Purchase success rate drops below 90% in a 1-hour window
2. Receipt verification failure rate exceeds 10% in a 1-hour window
3. Restore purchases failure rate exceeds 20% in a 1-hour window
4. Any sudden spike (>200% of baseline) in purchase cancellations

## Regular Reporting

Generate weekly reports with the following metrics:

1. Overall purchase conversion rate
2. Subscription renewal rate
3. Most common purchase failure reasons
4. Average receipt verification time
5. Platform comparison (iOS vs Android success rates)
