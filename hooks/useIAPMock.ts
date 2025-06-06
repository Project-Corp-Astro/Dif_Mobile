import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { SubscriptionPlan, ProductType, Product, Purchase, SubscriptionStatus } from './useIAP';

/**
 * Mock implementation of the useIAP hook for testing purposes
 * This allows testing the UI and integration without making actual purchases
 */
export const useIAPMock = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);

  // Mock product data
  const mockProducts: Product[] = [
    {
      id: Platform.OS === 'ios' 
        ? 'com.corpastro.app.subscription.monthly' 
        : 'com.corpastro.app.subscription.monthly.android',
      type: ProductType.SUBSCRIPTION,
      title: 'Monthly Premium',
      description: 'Access all premium features for one month',
      price: '$9.99',
      priceValue: 9.99,
      currency: 'USD',
      subscriptionPeriod: '1 month',
    },
    {
      id: Platform.OS === 'ios' 
        ? 'com.corpastro.app.subscription.yearly' 
        : 'com.corpastro.app.subscription.yearly.android',
      type: ProductType.SUBSCRIPTION,
      title: 'Yearly Premium',
      description: 'Access all premium features for one year (save 20%)',
      price: '$79.99',
      priceValue: 79.99,
      currency: 'USD',
      subscriptionPeriod: '1 year',
      introductoryPrice: '$59.99',
      introductoryPriceValue: 59.99,
      introductoryPricePeriod: '1 year',
    },
    {
      id: Platform.OS === 'ios' 
        ? 'com.corpastro.app.lifetime' 
        : 'com.corpastro.app.lifetime.android',
      type: ProductType.ONE_TIME,
      title: 'Lifetime Access',
      description: 'One-time purchase for lifetime access to all premium features',
      price: '$199.99',
      priceValue: 199.99,
      currency: 'USD',
    },
  ];

  // Initialize IAP
  const initializeIAP = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set mock products
      setProducts(mockProducts);
      
      // Check for existing purchases in mock data
      const now = new Date();
      const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      // For testing, we'll assume no active purchases by default
      setPurchases([]);
      setSubscriptionStatus({
        isActive: false,
        plan: null,
        expiryDate: null,
        isLifetime: false,
        isTrialActive: false,
        trialEndDate: null,
      });
      
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  };

  // Purchase a product
  const purchaseProduct = async (productId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Find the product
      const product = products.find(p => p.id === productId);
      if (!product) {
        throw new Error(`Product not found: ${productId}`);
      }
      
      // Create a mock purchase
      const now = new Date();
      const purchase: Purchase = {
        productId,
        purchaseTime: now.getTime(),
        transactionId: `mock-transaction-${Date.now()}`,
        price: product.price,
      };
      
      // Add expiration date for subscriptions
      if (product.type === ProductType.SUBSCRIPTION) {
        if (product.subscriptionPeriod?.includes('month')) {
          const expirationDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          purchase.expirationDate = expirationDate;
        } else if (product.subscriptionPeriod?.includes('year')) {
          const expirationDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
          purchase.expirationDate = expirationDate;
        }
      }
      
      // Add to purchases
      setPurchases(prev => [...prev, purchase]);
      
      // Update subscription status
      updateSubscriptionStatus([...purchases, purchase]);
      
      setIsLoading(false);
      return purchase;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  // Restore purchases
  const restorePurchases = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For mock purposes, we'll create a sample restored purchase
      const now = new Date();
      const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      const restoredPurchase: Purchase = {
        productId: mockProducts[0].id,
        purchaseTime: now.getTime() - 7 * 24 * 60 * 60 * 1000, // 1 week ago
        transactionId: `mock-restored-${Date.now()}`,
        expirationDate: oneMonthFromNow,
        price: mockProducts[0].price,
      };
      
      // Add to purchases
      setPurchases([restoredPurchase]);
      
      // Update subscription status
      updateSubscriptionStatus([restoredPurchase]);
      
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  };

  // Update subscription status based on purchases
  const updateSubscriptionStatus = (currentPurchases: Purchase[]) => {
    if (!currentPurchases || currentPurchases.length === 0) {
      setSubscriptionStatus({
        isActive: false,
        plan: null,
        expiryDate: null,
        isLifetime: false,
        isTrialActive: false,
        trialEndDate: null,
      });
      return;
    }
    
    const now = new Date();
    
    // Check for active subscriptions
    const activeSubscriptions = currentPurchases.filter((purchase) => {
      // Check if it's a subscription
      const isSubscription = 
        purchase.productId.includes('subscription.monthly') ||
        purchase.productId.includes('subscription.yearly');
      
      // Check if it's still active
      const isActive = purchase.expirationDate && purchase.expirationDate instanceof Date 
        ? purchase.expirationDate > now 
        : false;
      
      return isSubscription && isActive;
    });
    
    // Check for lifetime purchases
    const lifetimePurchases = currentPurchases.filter((purchase) => {
      return purchase.productId.includes('lifetime');
    });
    
    // If we have a lifetime purchase, that takes precedence
    if (lifetimePurchases.length > 0) {
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
    
    // If we have active subscriptions, use the latest one
    if (activeSubscriptions.length > 0) {
      // Sort by expiration date (latest first)
      const sortedSubscriptions = [...activeSubscriptions].sort((a, b) => {
        const aDate = a.expirationDate instanceof Date ? a.expirationDate.getTime() : 0;
        const bDate = b.expirationDate instanceof Date ? b.expirationDate.getTime() : 0;
        return bDate - aDate;
      });
      
      const latestSubscription = sortedSubscriptions[0];
      
      // Determine the plan
      let plan = SubscriptionPlan.MONTHLY;
      if (latestSubscription.productId.includes('yearly')) {
        plan = SubscriptionPlan.YEARLY;
      }
      
      setSubscriptionStatus({
        isActive: true,
        plan,
        expiryDate: latestSubscription.expirationDate instanceof Date ? latestSubscription.expirationDate : null,
        isLifetime: false,
        isTrialActive: latestSubscription.isTrialPeriod || false,
        trialEndDate: latestSubscription.isTrialPeriod && latestSubscription.expirationDate instanceof Date 
          ? latestSubscription.expirationDate 
          : null,
      });
      return;
    }
    
    // No active subscriptions
    setSubscriptionStatus({
      isActive: false,
      plan: null,
      expiryDate: null,
      isLifetime: false,
      isTrialActive: false,
      trialEndDate: null,
    });
  };

  // Initialize on mount
  useEffect(() => {
    initializeIAP();
  }, []);

  return {
    products,
    purchases,
    subscriptionStatus,
    isLoading,
    error,
    initializeIAP,
    purchaseProduct,
    restorePurchases,
  };
};

// For backward compatibility, export as useSubscription as well
export const useSubscriptionMock = useIAPMock;

export default useIAPMock;
