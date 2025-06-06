import { useState } from 'react';

// This is a mock version of useSubscription that doesn't use native modules
export const useSubscription = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Mock subscription plans to match the real ones
  const subscriptionPlans = {
    MONTHLY: 'monthly_subscription',
    YEARLY: 'yearly_subscription',
    LIFETIME: 'lifetime_subscription',
  };
  
  // Mock purchase function
  const purchaseSubscription = async (planType) => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubscribed(true);
    setLoading(false);
    return { success: true };
  };
  
  // Mock restore function
  const restorePurchases = async () => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    return { success: true, restored: false };
  };

  return {
    isSubscribed,
    loading,
    subscriptionPlans,
    purchaseSubscription,
    restorePurchases
  };
};

export default useSubscription;
