import { useState, useEffect, useCallback } from 'react';
import * as InAppPurchases from 'expo-in-app-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { supabase } from '@services/supabaseClient';
import { useUserStore } from '@state/userStore';
import { useHaptics } from './useHaptics';
import { useErrorReporting, ErrorType, ErrorSeverity } from './useErrorReporting';
import { useAnalytics } from './useAnalytics';

// Subscription plans
export enum SubscriptionPlan {
  MONTHLY = 'monthly_subscription',
  YEARLY = 'yearly_subscription',
  LIFETIME = 'lifetime_subscription',
}

// Custom types for purchase handling
type ExtendedInAppPurchase = InAppPurchases.InAppPurchase & {
  isAutoRenewing?: boolean;
  purchaseTime?: number;
  orderId?: string;
  originalOrderId?: string;
  purchaseToken?: string;
};

// Purchase type for our app
export interface Purchase {
  productId: string;
  purchaseTime: number;
  transactionId: string;
  isAcknowledged: boolean;
  orderId?: string;
  originalOrderId?: string;
  purchaseToken?: string;
  isAutoRenewing?: boolean;
}

// Product types
export enum ProductType {
  SUBSCRIPTION = 'subscription',
  ONE_TIME = 'one_time',
}

// Product interface
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

// Note: Purchase interface is already defined above

// Subscription status
export interface SubscriptionStatus {
  isActive: boolean;
  plan: SubscriptionPlan | null;
  expiryDate: Date | null;
  isLifetime: boolean;
  isTrialActive: boolean;
  trialEndDate: Date | null;
}

// Product IDs
const PRODUCT_IDS = {
  [Platform.OS === 'ios' ? 'ios' : 'android']: {
    [SubscriptionPlan.MONTHLY]: Platform.OS === 'ios' 
      ? 'com.astromobile.monthly' 
      : 'com.astromobile.monthly',
    [SubscriptionPlan.YEARLY]: Platform.OS === 'ios' 
      ? 'com.astromobile.yearly' 
      : 'com.astromobile.yearly',
    [SubscriptionPlan.LIFETIME]: Platform.OS === 'ios' 
      ? 'com.astromobile.lifetime' 
      : 'com.astromobile.lifetime',
  }
};

/**
 * Hook for managing in-app purchases and subscriptions
 */
export const useSubscription = () => {
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
  const { trackEvent, AnalyticsEvent } = useAnalytics();
  
  // Initialize in-app purchases
  useEffect(() => {
    const initializeIAP = async () => {
      try {
        setIsLoading(true);
        
        // Connect to the store
        await InAppPurchases.connectAsync();
        
        // Get product IDs for the current platform
        const platformProductIds = Object.values(PRODUCT_IDS[Platform.OS === 'ios' ? 'ios' : 'android']);
        
        // Get products
        const { responseCode, results = [] } = await InAppPurchases.getProductsAsync(platformProductIds);
        
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
          // Transform products to our format
          const formattedProducts: Product[] = results.map((product: any) => ({
            id: product.productId,
            type: product.productType === 'subscription' ? ProductType.SUBSCRIPTION : ProductType.ONE_TIME,
            title: product.title,
            description: product.description,
            price: product.price,
            priceValue: product.priceAmountMicros / 1000000,
            currency: product.priceCurrencyCode,
            subscriptionPeriod: product.subscriptionPeriodAndroid || undefined,
            introductoryPrice: product.introductoryPrice || undefined,
            introductoryPriceValue: product.introductoryPriceAmountMicros 
              ? product.introductoryPriceAmountMicros / 1000000 
              : undefined,
            introductoryPricePeriod: product.introductoryPricePeriodAndroid || undefined,
          }));
          
          setProducts(formattedProducts);
        }
        
        // Get purchase history
        await getPurchaseHistory();
        
        // Set up purchase listener
        InAppPurchases.setPurchaseListener((result) => {
          const { responseCode, results = [], errorCode } = result;
          if (responseCode === InAppPurchases.IAPResponseCode.OK) {
            results.forEach((purchase: any) => {
              // Handle the purchase
              handlePurchase(purchase);
            });
          } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
            console.log('User canceled the purchase');
          } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
            console.log('Purchase deferred');
          } else {
            const errorMessage = `Purchase failed with code: ${errorCode}`;
            setError(new Error(errorMessage));
            reportError(errorMessage, ErrorType.API, ErrorSeverity.MEDIUM);
          }
        });
        
      } catch (err) {
        const error = err as Error;
        setError(error);
        reportError(error, ErrorType.API, ErrorSeverity.HIGH);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeIAP();
    
    // Cleanup
    return () => {
      InAppPurchases.disconnectAsync();
    };
  }, [reportError]);
  
  // Check subscription status when user or purchases change
  useEffect(() => {
    if (user?.id) {
      checkSubscriptionStatus();
    }
  }, [user, purchases]);
  
  /**
   * Get purchase history
   */
  const getPurchaseHistory = useCallback(async () => {
    try {
      // Get purchase history from the store
      const { responseCode, results = [] } = await InAppPurchases.getPurchaseHistoryAsync();
      
      if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
        setPurchases(results.map((p: ExtendedInAppPurchase) => ({
          productId: p.productId,
          purchaseTime: p.purchaseTime || Date.now(),
          transactionId: p.transactionReceipt || `trans-${Date.now()}`,
          isAcknowledged: true,
          orderId: p.orderId,
          originalOrderId: p.originalOrderId,
          purchaseToken: p.purchaseToken,
          isAutoRenewing: p.isAutoRenewing
        })));
      }
      
      // Also check with our backend
      if (user?.id) {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching subscription from Supabase:', error);
        } else if (data) {
          // Validate the subscription with the store purchase data
          validateSubscription(data);
        }
      }
    } catch (error) {
      console.error('Error getting purchase history:', error);
    }
  }, [user]);
  
  /**
   * Validate a subscription from our backend with store data
   */
  const validateSubscription = useCallback((subscriptionData: any) => {
    // This would typically involve verifying the receipt with Apple/Google
    // For now, we'll just check if the expiry date is in the future
    
    if (subscriptionData.expiry_date) {
      const expiryDate = new Date(subscriptionData.expiry_date);
      const now = new Date();
      
      if (expiryDate > now || subscriptionData.is_lifetime) {
        setSubscriptionStatus({
          isActive: true,
          plan: subscriptionData.plan,
          expiryDate: expiryDate,
          isLifetime: subscriptionData.is_lifetime,
          isTrialActive: subscriptionData.is_trial_active,
          trialEndDate: subscriptionData.trial_end_date ? new Date(subscriptionData.trial_end_date) : null,
        });
      }
    }
  }, []);
  
  /**
   * Check subscription status
   */
  const checkSubscriptionStatus = useCallback(async () => {
    try {
      if (!user?.id) return;
      
      // First check local storage for cached status
      const cachedStatusJson = await AsyncStorage.getItem(`subscription_status_${user.id}`);
      
      if (cachedStatusJson) {
        const cachedStatus = JSON.parse(cachedStatusJson);
        const expiryDate = cachedStatus.expiryDate ? new Date(cachedStatus.expiryDate) : null;
        const trialEndDate = cachedStatus.trialEndDate ? new Date(cachedStatus.trialEndDate) : null;
        
        // Check if the cached status is still valid
        if (
          cachedStatus.isLifetime || 
          (expiryDate && expiryDate > new Date())
        ) {
          setSubscriptionStatus({
            ...cachedStatus,
            expiryDate,
            trialEndDate,
          });
          return;
        }
      }
      
      // If no valid cached status, check with our backend
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching subscription status:', error);
        return;
      }
      
      if (data) {
        const status: SubscriptionStatus = {
          isActive: data.is_active,
          plan: data.plan,
          expiryDate: data.expiry_date ? new Date(data.expiry_date) : null,
          isLifetime: data.is_lifetime,
          isTrialActive: data.is_trial_active,
          trialEndDate: data.trial_end_date ? new Date(data.trial_end_date) : null,
        };
        
        setSubscriptionStatus(status);
        
        // Cache the status
        await AsyncStorage.setItem(`subscription_status_${user.id}`, JSON.stringify(status));
      } else {
        // No subscription found
        setSubscriptionStatus({
          isActive: false,
          plan: null,
          expiryDate: null,
          isLifetime: false,
          isTrialActive: false,
          trialEndDate: null,
        });
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error checking subscription status:', error);
      reportError(error, ErrorType.DATABASE, ErrorSeverity.MEDIUM);
    }
  }, [user, reportError]);
  
  /**
   * Handle a purchase
   */
  const handlePurchase = useCallback(async (purchase: any) => {
    try {
      // Acknowledge the purchase
      await InAppPurchases.finishTransactionAsync(purchase, true);
      
      // Add to purchases
      setPurchases(prev => [...prev, purchase]);
      
      // Determine the plan from the product ID
      let plan: SubscriptionPlan | null = null;
      let isLifetime = false;
      
      if (purchase.productId === PRODUCT_IDS[Platform.OS === 'ios' ? 'ios' : 'android'][SubscriptionPlan.MONTHLY]) {
        plan = SubscriptionPlan.MONTHLY;
      } else if (purchase.productId === PRODUCT_IDS[Platform.OS === 'ios' ? 'ios' : 'android'][SubscriptionPlan.YEARLY]) {
        plan = SubscriptionPlan.YEARLY;
      } else if (purchase.productId === PRODUCT_IDS[Platform.OS === 'ios' ? 'ios' : 'android'][SubscriptionPlan.LIFETIME]) {
        plan = SubscriptionPlan.LIFETIME;
        isLifetime = true;
      }
      
      if (user?.id && plan) {
        // Calculate expiry date
        let expiryDate: Date | null = null;
        
        if (plan === SubscriptionPlan.MONTHLY) {
          expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + 1);
        } else if (plan === SubscriptionPlan.YEARLY) {
          expiryDate = new Date();
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        }
        
        // Save to our backend
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: user.id,
            plan,
            is_active: true,
            expiry_date: expiryDate?.toISOString(),
            is_lifetime: isLifetime,
            transaction_id: purchase.transactionId,
            purchase_date: new Date().toISOString(),
          });
        
        if (error) {
          console.error('Error saving subscription to Supabase:', error);
          reportError(error, ErrorType.DATABASE, ErrorSeverity.HIGH);
        } else {
          // Update subscription status
          setSubscriptionStatus({
            isActive: true,
            plan,
            expiryDate,
            isLifetime,
            isTrialActive: false,
            trialEndDate: null,
          });
          
          // Cache the status
          await AsyncStorage.setItem(`subscription_status_${user.id}`, JSON.stringify({
            isActive: true,
            plan,
            expiryDate,
            isLifetime,
            isTrialActive: false,
            trialEndDate: null,
          }));
          
          // Track the purchase
          trackEvent(AnalyticsEvent.START_SUBSCRIPTION, {
            plan,
            isLifetime,
            price: getProductPrice(purchase.productId),
          });
          
          // Show success notification
          successNotification();
        }
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error handling purchase:', error);
      reportError(error, ErrorType.API, ErrorSeverity.HIGH);
      errorNotification();
    }
  }, [user, reportError, trackEvent, successNotification, errorNotification]);
  
  /**
   * Purchase a product
   */
  const purchaseProduct = useCallback(async (productId: string) => {
    try {
      setIsLoading(true);
      
      // Make the purchase
      await InAppPurchases.purchaseItemAsync(productId);
      
      // The purchase will be handled by the purchase listener
      
    } catch (err) {
      const error = err as Error;
      setError(error);
      reportError(error, ErrorType.API, ErrorSeverity.MEDIUM);
      errorNotification();
    } finally {
      setIsLoading(false);
    }
  }, [reportError, errorNotification]);
  
  /**
   * Restore purchases
   */
  const restorePurchases = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Restore purchases
      const { responseCode, results = [] } = await InAppPurchases.getPurchaseHistoryAsync();
      
      if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
        setPurchases(results.map((p: ExtendedInAppPurchase) => ({
          productId: p.productId,
          purchaseTime: p.purchaseTime || Date.now(),
          transactionId: p.transactionReceipt || `trans-${Date.now()}`,
          isAcknowledged: true,
          orderId: p.orderId,
          originalOrderId: p.originalOrderId,
          purchaseToken: p.purchaseToken,
          isAutoRenewing: p.isAutoRenewing
        })));
        
        // Process the restored purchases
        for (const purchase of results) {
          await handlePurchase(purchase);
        }
        
        successNotification();
        return true;
      }
      
      return false;
    } catch (err) {
      const error = err as Error;
      setError(error);
      reportError(error, ErrorType.API, ErrorSeverity.MEDIUM);
      errorNotification();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [handlePurchase, reportError, successNotification, errorNotification]);
  
  /**
   * Get a product by ID
   */
  const getProduct = useCallback((productId: string): Product | undefined => {
    return products.find(product => product.id === productId);
  }, [products]);
  
  /**
   * Get a product price by ID
   */
  const getProductPrice = useCallback((productId: string): string => {
    const product = getProduct(productId);
    return product ? product.price : '';
  }, [getProduct]);
  
  /**
   * Get products by type
   */
  const getProductsByType = useCallback((type: ProductType): Product[] => {
    return products.filter(product => product.type === type);
  }, [products]);
  
  /**
   * Check if a product is purchased
   */
  const isProductPurchased = useCallback((productId: string): boolean => {
    return purchases.some(purchase => purchase.productId === productId);
  }, [purchases]);
  
  return {
    products,
    purchases,
    subscriptionStatus,
    isLoading,
    error,
    purchaseProduct,
    restorePurchases,
    getProduct,
    getProductPrice,
    getProductsByType,
    isProductPurchased,
    checkSubscriptionStatus,
    ProductType,
    SubscriptionPlan,
  };
};
