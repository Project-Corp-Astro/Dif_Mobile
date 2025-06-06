/**
 * Hooks index file
 * 
 * This file exports all hooks from the hooks directory to provide a unified entry point.
 * For the IAP hooks, we export both useIAP and useSubscription (which is now an alias to useIAP)
 * to maintain backward compatibility during the migration.
 */

// Export the new IAP hook and all its types
export { 
  useIAP,
  ProductType,
  SubscriptionPlan,
  type Product,
  type Purchase,
  type SubscriptionStatus
} from './useIAP';

// Export useSubscription as an alias to useIAP for backward compatibility
export { useIAP as useSubscription } from './useIAP';

// For testing purposes, export the mock implementations
export { useIAPMock, useIAPMock as useSubscriptionMock } from './useIAPMock';
