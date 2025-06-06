import { useAnalytics, AnalyticsEvent } from './useAnalytics';
import { Product, Purchase, SubscriptionStatus } from './useIAP';

/**
 * Hook for tracking IAP-related analytics events
 * This hook provides a set of functions to track IAP events
 * and should be used within the useIAP hook
 */
export const useIAPAnalytics = () => {
  const { trackEvent } = useAnalytics();

  /**
   * Track product fetch start
   */
  const trackProductFetchStart = () => {
    trackEvent(AnalyticsEvent.IAP_PRODUCTS_FETCH_START);
  };

  /**
   * Track product fetch success
   * @param products - The products that were fetched
   */
  const trackProductFetchSuccess = (products: Product[]) => {
    trackEvent(AnalyticsEvent.IAP_PRODUCTS_FETCH_SUCCESS, {
      product_count: products.length,
      product_ids: products.map(p => p.id),
    });
  };

  /**
   * Track product fetch failure
   * @param error - The error that occurred
   */
  const trackProductFetchFailure = (error: any) => {
    trackEvent(AnalyticsEvent.IAP_PRODUCTS_FETCH_FAILURE, {
      error_message: error?.message || 'Unknown error',
      error_code: error?.code || 'UNKNOWN',
    });
  };

  /**
   * Track purchase start
   * @param productId - The ID of the product being purchased
   */
  const trackPurchaseStart = (productId: string) => {
    trackEvent(AnalyticsEvent.IAP_PURCHASE_START, {
      product_id: productId,
    });
  };

  /**
   * Track purchase success
   * @param purchase - The purchase that was completed
   */
  const trackPurchaseSuccess = (purchase: Purchase) => {
    trackEvent(AnalyticsEvent.IAP_PURCHASE_SUCCESS, {
      product_id: purchase.productId,
      transaction_id: purchase.transactionId,
      purchase_time: purchase.purchaseTime,
      price: purchase.price,
      // Currency is optional in the Purchase type
      currency: 'USD', // Default to USD since currency is not in the Purchase type
    });
  };

  /**
   * Track purchase failure
   * @param productId - The ID of the product that failed to purchase
   * @param error - The error that occurred
   */
  const trackPurchaseFailure = (productId: string, error: any) => {
    trackEvent(AnalyticsEvent.IAP_PURCHASE_FAILURE, {
      product_id: productId,
      error_message: error?.message || 'Unknown error',
      error_code: error?.code || 'UNKNOWN',
    });
  };

  /**
   * Track purchase cancellation
   * @param productId - The ID of the product that was cancelled
   */
  const trackPurchaseCancelled = (productId: string) => {
    trackEvent(AnalyticsEvent.IAP_PURCHASE_CANCELLED, {
      product_id: productId,
    });
  };

  /**
   * Track restore start
   */
  const trackRestoreStart = () => {
    trackEvent(AnalyticsEvent.IAP_RESTORE_START);
  };

  /**
   * Track restore success
   * @param purchases - The purchases that were restored
   */
  const trackRestoreSuccess = (purchases: Purchase[]) => {
    trackEvent(AnalyticsEvent.IAP_RESTORE_SUCCESS, {
      purchase_count: purchases.length,
      product_ids: purchases.map(p => p.productId),
    });
  };

  /**
   * Track restore failure
   * @param error - The error that occurred
   */
  const trackRestoreFailure = (error: any) => {
    trackEvent(AnalyticsEvent.IAP_RESTORE_FAILURE, {
      error_message: error?.message || 'Unknown error',
      error_code: error?.code || 'UNKNOWN',
    });
  };

  /**
   * Track receipt verification start
   * @param transactionId - The transaction ID being verified
   */
  const trackReceiptVerificationStart = (transactionId: string) => {
    trackEvent(AnalyticsEvent.IAP_RECEIPT_VERIFICATION_START, {
      transaction_id: transactionId,
    });
  };

  /**
   * Track receipt verification success
   * @param transactionId - The transaction ID that was verified
   */
  const trackReceiptVerificationSuccess = (transactionId: string) => {
    trackEvent(AnalyticsEvent.IAP_RECEIPT_VERIFICATION_SUCCESS, {
      transaction_id: transactionId,
    });
  };

  /**
   * Track receipt verification failure
   * @param transactionId - The transaction ID that failed verification
   * @param error - The error that occurred
   */
  const trackReceiptVerificationFailure = (transactionId: string, error: any) => {
    trackEvent(AnalyticsEvent.IAP_RECEIPT_VERIFICATION_FAILURE, {
      transaction_id: transactionId,
      error_message: error?.message || 'Unknown error',
      error_code: error?.code || 'UNKNOWN',
    });
  };

  /**
   * Track subscription status change
   * @param status - The new subscription status
   */
  const trackSubscriptionStatusChanged = (status: SubscriptionStatus) => {
    trackEvent(AnalyticsEvent.IAP_SUBSCRIPTION_STATUS_CHANGED, {
      is_active: status.isActive,
      plan: status.plan,
      expiry_date: status.expiryDate?.toISOString(),
      is_lifetime: status.isLifetime,
      is_trial_active: status.isTrialActive,
      trial_end_date: status.trialEndDate?.toISOString(),
    });
  };

  return {
    trackProductFetchStart,
    trackProductFetchSuccess,
    trackProductFetchFailure,
    trackPurchaseStart,
    trackPurchaseSuccess,
    trackPurchaseFailure,
    trackPurchaseCancelled,
    trackRestoreStart,
    trackRestoreSuccess,
    trackRestoreFailure,
    trackReceiptVerificationStart,
    trackReceiptVerificationSuccess,
    trackReceiptVerificationFailure,
    trackSubscriptionStatusChanged,
  };
};
