#!/bin/bash

# Script to find all components using subscription functionality
# This helps identify components that need to be updated during the IAP migration

echo "=== Finding components importing useSubscription ==="
grep -r "import.*useSubscription" --include="*.tsx" --include="*.ts" ./

echo ""
echo "=== Finding components using subscriptionStatus ==="
grep -r "subscriptionStatus" --include="*.tsx" --include="*.ts" ./

echo ""
echo "=== Finding components using purchaseProduct ==="
grep -r "purchaseProduct" --include="*.tsx" --include="*.ts" ./

echo ""
echo "=== Finding components using restorePurchases ==="
grep -r "restorePurchases" --include="*.tsx" --include="*.ts" ./

echo ""
echo "=== Finding components using isSubscriptionActive ==="
grep -r "isSubscriptionActive" --include="*.tsx" --include="*.ts" ./

echo ""
echo "=== Finding components using expo-in-app-purchases ==="
grep -r "expo-in-app-purchases" --include="*.tsx" --include="*.ts" --include="*.json" ./

echo ""
echo "=== Finding components with subscription-related UI elements ==="
grep -r -E "(subscribe|subscription|purchase|premium|pro)" --include="*.tsx" ./
