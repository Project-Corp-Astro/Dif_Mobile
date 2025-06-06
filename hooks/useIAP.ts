import { useState, useEffect, useCallback } from 'react';
import * as RNIap from 'react-native-iap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { supabase } from '@services/supabaseClient';
import { useUserStore } from '@state/userStore';
import { useHaptics } from './useHaptics';
import { useErrorReporting, ErrorType, ErrorSeverity } from './useErrorReporting';
import { useAnalytics } from './useAnalytics';
import { useIAPAnalytics } from './useIAPAnalytics';

// Subscription plans - keeping the same enum as before
export enum SubscriptionPlan {
  MONTHLY = 'monthly_subscription',
  YEARLY = 'yearly_subscription',
  LIFETIME = 'lifetime_subscription',
}

// Custom types for purchase handling - adapted for react-native-iap
type ExtendedPurchase = RNIap.Purchase & {
  isAutoRenewing?: boolean;
  purchaseTime?: number;
  orderId?: string;
  originalOrderId?: string;
  purchaseToken?: string;
};

// Define custom error types for IAP - we'll use the existing ErrorType.UNKNOWN for now
// In a real implementation, we would extend the ErrorType enum in the useErrorReporting module

// Purchase type for our app - keeping the same interface
export interface Purchase {
  productId: string;
  purchaseTime: number;
  transactionId: string;
  originalTransactionId?: string;
  isTrialPeriod?: boolean;
  expirationDate?: Date;
  price?: string;
}

// Product types
export enum ProductType {
  SUBSCRIPTION = 'subscription',
  ONE_TIME = 'one_time',
}

// Map RNIap product types to our product types
const mapProductType = (productType: string): ProductType => {
  if (productType === 'subs') return ProductType.SUBSCRIPTION;
  return ProductType.ONE_TIME;
};

// Product interface - keeping the same interface
export interface Product {
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

// Subscription status - keeping the same interface
export interface SubscriptionStatus {
  isActive: boolean;
  plan: SubscriptionPlan | null;
  expiryDate: Date | null;
  isLifetime: boolean;
  isTrialActive: boolean;
  trialEndDate: Date | null;
}

// Product IDs - keeping the same configuration
const PRODUCT_IDS = {
  [Platform.OS === 'ios' ? 'ios' : 'android']: {
    [SubscriptionPlan.MONTHLY]: Platform.OS === 'ios' 
      ? 'com.corpastro.app.monthly' 
      : 'com.corpastro.app.monthly',
    [SubscriptionPlan.YEARLY]: Platform.OS === 'ios' 
      ? 'com.corpastro.app.yearly' 
      : 'com.corpastro.app.yearly',
    [SubscriptionPlan.LIFETIME]: Platform.OS === 'ios' 
      ? 'com.corpastro.app.lifetime' 
      : 'com.corpastro.app.lifetime',
  }
};

/**
 * Hook for managing in-app purchases and subscriptions using react-native-iap
 * This replaces the previous useSubscription hook that used expo-in-app-purchases
 */
export const useIAP = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    isActive: false,
    plan: null,
    expiryDate: null,
    isLifetime: false,
    isTrialActive: false,
    trialEndDate: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const user = useUserStore((state) => state.user);
  const { successNotification, errorNotification } = useHaptics();
  const { reportError } = useErrorReporting();
  const { trackEvent } = useAnalytics();
  const analytics = useIAPAnalytics();
  
  // Initialize in-app purchases
  useEffect(() => {
    const initializeIAP = async () => {
      try {
        setIsLoading(true);
        
        // Track product fetch start
        analytics.trackProductFetchStart();
        
        // Connect to the store
        await RNIap.initConnection();
        
        // Get product IDs for the current platform
        const platformProductIds = Object.values(PRODUCT_IDS[Platform.OS === 'ios' ? 'ios' : 'android']);
        
        // Get products
        let storeProducts: RNIap.Product[] = [];
        let storeSubscriptions: RNIap.Subscription[] = [];
        
        if (Platform.OS === 'ios') {
          // For iOS, we need to get subscriptions separately
          storeProducts = await RNIap.getProducts({ skus: platformProductIds });
          storeSubscriptions = await RNIap.getSubscriptions({ skus: platformProductIds });
        } else {
          // For Android, we can get subscriptions
          storeSubscriptions = await RNIap.getSubscriptions({ skus: platformProductIds });
        }
        
        // Combine products and subscriptions
        const allProducts = [...storeProducts, ...storeSubscriptions];
        
        if (allProducts.length > 0) {
          // Transform products to our format
          const formattedProducts: Product[] = allProducts.map((product) => {
            // Extract common properties safely
            const productId = product.productId;
            const title = product.title || '';
            const description = product.description || '';
            
            // Handle iOS vs Android differences
            let price = '';
            let priceValue = 0;
            let currency = '';
            let subscriptionPeriod: string | undefined = undefined;
            let introductoryPrice: string | undefined = undefined;
            let introductoryPriceValue: number | undefined = undefined;
            let introductoryPricePeriod: string | undefined = undefined;
            
            // iOS Product
            if ('localizedPrice' in product && typeof product.localizedPrice === 'string') {
              price = product.localizedPrice;
              priceValue = parseFloat(product.price || '0');
              currency = typeof product.currency === 'string' ? product.currency : '';
            }
            
            // Android Subscription
            if ('subscriptionPeriodAndroid' in product && typeof product.subscriptionPeriodAndroid === 'string') {
              subscriptionPeriod = product.subscriptionPeriodAndroid;
            }
            
            if ('introductoryPrice' in product && typeof product.introductoryPrice === 'string') {
              introductoryPrice = product.introductoryPrice;
              introductoryPriceValue = parseFloat(product.introductoryPrice);
            }
            
            if ('introductoryPricePeriodAndroid' in product && typeof product.introductoryPricePeriodAndroid === 'string') {
              introductoryPricePeriod = product.introductoryPricePeriodAndroid;
            }
            
            // Determine product type
            const type = ('productType' in product && product.productType === 'subs') ? 
              ProductType.SUBSCRIPTION : ProductType.ONE_TIME;
            
            return {
              id: productId,
              type,
              title,
              description,
              price,
              priceValue,
              currency,
              subscriptionPeriod,
              introductoryPrice,
              introductoryPriceValue,
              introductoryPricePeriod,
            };
          });
          
          setProducts(formattedProducts);
          
          // Track product fetch success
          analytics.trackProductFetchSuccess(formattedProducts);
        }
        
        // Get purchase history
        await getPurchaseHistory();
        
        // Set up purchase listener
        const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
          async (purchase: RNIap.Purchase) => {
            try {
              // Track purchase start
              analytics.trackPurchaseStart(purchase.productId);
              
              // Process the purchase
              await processPurchase(purchase);
              
              // Finish the transaction
              if (Platform.OS === 'android' && purchase.purchaseToken) {
                await RNIap.acknowledgePurchaseAndroid({ token: purchase.purchaseToken });
              } else {
                await RNIap.finishTransaction({ 
                  purchase, 
                  isConsumable: false 
                });
              }
              
              successNotification();
            } catch (err) {
              // Track purchase processing failure
              analytics.trackPurchaseFailure(purchase.productId, err);
              reportError(new Error(`Purchase update error: ${(err as Error).message}`));
              errorNotification();
            }
          }
        );
        
        // Set up error listener
        const purchaseErrorSubscription = RNIap.purchaseErrorListener(
          (error: RNIap.PurchaseError) => {
            if (error.code !== 'E_USER_CANCELLED') {
              reportError(new Error(`Purchase error (${error.code}): ${error.message}`));
              errorNotification();
            }
          }
        );
        
        setIsLoading(false);
        
        // Clean up listeners when component unmounts
        return () => {
          if (purchaseUpdateSubscription) {
            purchaseUpdateSubscription.remove();
          }
          if (purchaseErrorSubscription) {
            purchaseErrorSubscription.remove();
          }
          RNIap.endConnection();
        };
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
        reportError(new Error(`IAP initialization error: ${(err as Error).message}`));
        
        // Track product fetch failure
        analytics.trackProductFetchFailure(err);
      }
    };
    
    initializeIAP();
  }, []);
  
  // Get purchase history
  const getPurchaseHistory = async () => {
    try {
      let purchases: RNIap.Purchase[] = [];
      
      if (Platform.OS === 'ios') {
        // For iOS, we use getAvailablePurchases
        purchases = await RNIap.getAvailablePurchases();
      } else {
        // For Android, we use getPurchaseHistory
        purchases = await RNIap.getPurchaseHistory();
      }
      
      if (purchases.length > 0) {
        // Process purchases
        const formattedPurchases: Purchase[] = purchases.map((purchase) => {
          const purchaseObj: Purchase = {
            productId: purchase.productId,
            purchaseTime: purchase.transactionDate || Date.now(),
            transactionId: purchase.transactionId || '',
            originalTransactionId: purchase.originalTransactionIdentifierIOS || purchase.transactionId || ''
          };
          
          // Handle optional fields safely
          if ('isTrialPeriod' in purchase && typeof purchase.isTrialPeriod === 'boolean') {
            purchaseObj.isTrialPeriod = purchase.isTrialPeriod;
          }
          
          if ('expirationDate' in purchase && purchase.expirationDate && 
          (typeof purchase.expirationDate === 'number' || typeof purchase.expirationDate === 'string')) {
            purchaseObj.expirationDate = new Date(purchase.expirationDate);
          }
          
          return purchaseObj;
        });
        
        setPurchases(formattedPurchases);
        
        // Update subscription status
        updateSubscriptionStatus(formattedPurchases);
      }
    } catch (err) {
      reportError(new Error(`Purchase history error: ${(err as Error).message}`));
    }
  };
  
  // Process a purchase
  const processPurchase = async (purchase: RNIap.Purchase) => {
    try {
      // Format the purchase
      const formattedPurchase: Purchase = {
        productId: purchase.productId,
        purchaseTime: purchase.transactionDate || Date.now(),
        transactionId: purchase.transactionId || '',
        originalTransactionId: purchase.originalTransactionIdentifierIOS || purchase.transactionId || ''
      };
      
      // Handle optional fields safely
      if ('isTrialPeriod' in purchase && typeof purchase.isTrialPeriod === 'boolean') {
        formattedPurchase.isTrialPeriod = purchase.isTrialPeriod;
      }
      
      if ('expirationDate' in purchase && purchase.expirationDate && 
          (typeof purchase.expirationDate === 'number' || typeof purchase.expirationDate === 'string')) {
        formattedPurchase.expirationDate = new Date(purchase.expirationDate);
      }
      
      if ('price' in purchase && purchase.price) {
        formattedPurchase.price = String(purchase.price);
      }
      
      // Add to purchases
      setPurchases((prev) => [...prev, formattedPurchase]);
      
      // Update subscription status
      updateSubscriptionStatus([...purchases, formattedPurchase]);
      
      // Verify purchase with backend
      await verifyPurchaseWithBackend(formattedPurchase);
      
      // Track purchase event with the new analytics hook
      analytics.trackPurchaseSuccess(formattedPurchase);
    } catch (err) {
      throw err;
    }
  };
  
  // Update subscription status based on purchases
  const updateSubscriptionStatus = (currentPurchases: Purchase[]) => {
    // Check if user has any active subscriptions
    const now = new Date();
    
    // Check for lifetime subscription
    const hasLifetime = currentPurchases.some(
      (purchase) => purchase.productId === PRODUCT_IDS[Platform.OS === 'ios' ? 'ios' : 'android'][SubscriptionPlan.LIFETIME]
    );
    
    if (hasLifetime) {
      setSubscriptionStatus({
        isActive: true,
        plan: SubscriptionPlan.LIFETIME,
        expiryDate: null,
        isLifetime: true,
        isTrialActive: false,
        trialEndDate: null,
      });
      return;
    }
    
    // Check for active subscriptions
    const activeSubscriptions = currentPurchases.filter((purchase) => {
      // Check if it's a subscription
      const platform = Platform.OS === 'ios' ? 'ios' : 'android';
      const isSubscription = 
        purchase.productId === PRODUCT_IDS[platform][SubscriptionPlan.MONTHLY] ||
        purchase.productId === PRODUCT_IDS[platform][SubscriptionPlan.YEARLY];
      
      // Check if it's still active
      const isActive = purchase.expirationDate && purchase.expirationDate instanceof Date ? purchase.expirationDate > now : false;
      
      return isSubscription && isActive;
    });
    
    if (activeSubscriptions.length > 0) {
      // Sort by expiration date (latest first)
      activeSubscriptions.sort((a, b) => {
        if (!a.expirationDate) return 1;
        if (!b.expirationDate) return -1;
        return b.expirationDate.getTime() - a.expirationDate.getTime();
      });
      
      const latestSubscription = activeSubscriptions[0];
      
      // Determine subscription plan
      let plan: SubscriptionPlan | null = null;
      if (latestSubscription.productId === PRODUCT_IDS[Platform.OS === 'ios' ? 'ios' : 'android'][SubscriptionPlan.MONTHLY]) {
        plan = SubscriptionPlan.MONTHLY;
      } else if (latestSubscription.productId === PRODUCT_IDS[Platform.OS === 'ios' ? 'ios' : 'android'][SubscriptionPlan.YEARLY]) {
        plan = SubscriptionPlan.YEARLY;
      }
      
      const newStatus = {
        isActive: true,
        plan,
        expiryDate: latestSubscription.expirationDate && latestSubscription.expirationDate instanceof Date ? latestSubscription.expirationDate : null,
        isLifetime: false,
        isTrialActive: latestSubscription.isTrialPeriod || false,
        trialEndDate: latestSubscription.isTrialPeriod && latestSubscription.expirationDate instanceof Date ? latestSubscription.expirationDate : null,
      };
      
      setSubscriptionStatus(newStatus);
      
      // Track subscription status change
      analytics.trackSubscriptionStatusChanged(newStatus);
    } else {
      // No active subscriptions
      const newStatus = {
        isActive: false,
        plan: null,
        expiryDate: null,
        isLifetime: false,
        isTrialActive: false,
        trialEndDate: null,
      };
      
      setSubscriptionStatus(newStatus);
      
      // Track subscription status change
      analytics.trackSubscriptionStatusChanged(newStatus);
    }
  };
  
  // Verify purchase with backend
  const verifyPurchaseWithBackend = async (purchase: Purchase) => {
    try {
      if (!user) return;
      
      // Track receipt verification start
      analytics.trackReceiptVerificationStart(purchase.transactionId);
      
      // Get receipt
      let receipt = '';
      let receiptType = '';
      
      if (Platform.OS === 'ios') {
        try {
          const iosReceipt = await RNIap.getReceiptIOS({ forceRefresh: true });
          receipt = typeof iosReceipt === 'string' ? iosReceipt : '';
          receiptType = 'ios';
        } catch (receiptError) {
          console.warn('Failed to get iOS receipt:', receiptError);
          receipt = '';
          receiptType = 'ios';
        }
      } else {
        // For Android, we use the purchase token
        receipt = purchase.transactionId || '';
        receiptType = 'android';
      }
      
      // Get user ID safely
      const userId = user?.id || '';
      
      // Verify with backend
      const response = await supabase.functions.invoke('verify-purchase', {
        body: {
          receipt,
          receiptType,
          productId: purchase.productId,
          userId: userId,
          transactionId: purchase.transactionId || '',
        },
      });
      
      if (response.error) {
        // Track receipt verification failure
        analytics.trackReceiptVerificationFailure(purchase.transactionId, response.error);
        throw new Error(response.error.message);
      }
      
      // Track receipt verification success
      analytics.trackReceiptVerificationSuccess(purchase.transactionId);
      
      return response.data;
    } catch (err) {
      // Track receipt verification failure
      analytics.trackReceiptVerificationFailure(purchase.transactionId, err);
      reportError(new Error(`Purchase verification error for ${purchase.productId}: ${(err as Error).message}`));
      throw err;
    }
  };
  
  // Purchase a product
  const purchaseProduct = async (productId: string) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Track purchase start
      analytics.trackPurchaseStart(productId);
      
      // Request purchase
      await RNIap.requestPurchase({
        sku: productId,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });
      
      // Note: The purchase will be processed in the purchaseUpdatedListener
    } catch (err) {
      if ((err as RNIap.PurchaseError).code === 'E_USER_CANCELLED') {
        // Track purchase cancellation
        analytics.trackPurchaseCancelled(productId);
      } else {
        // Track purchase failure
        analytics.trackPurchaseFailure(productId, err);
        reportError(new Error(`Purchase request error for ${productId}: ${(err as Error).message}`));
        errorNotification();
        throw err;
      }
    }
  };
  
  // Restore purchases
  const restorePurchases = async () => {
    try {
      setIsLoading(true);
      
      // Track restore start
      analytics.trackRestoreStart();
      
      // Get available purchases
      const restoredPurchases = await RNIap.getAvailablePurchases();
      await getPurchaseHistory();
      
      // Track restore success
      analytics.trackRestoreSuccess(purchases);
      
      successNotification();
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      reportError(new Error(`Purchase restore error: ${(err as Error).message}`));
      errorNotification();
      
      // Track restore failure
      analytics.trackRestoreFailure(err);
    }
  };
  
  return {
    products,
    purchases,
    subscriptionStatus,
    isLoading,
    error,
    purchaseProduct,
    restorePurchases,
    getPurchaseHistory,
  };
};

// For backward compatibility, export as useSubscription as well
export const useSubscription = useIAP;
