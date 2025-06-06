#!/bin/bash

# Cleanup script for IAP migration
# This script removes the old useSubscription.ts file and any other deprecated files
# after the migration to react-native-iap is complete

echo "=== IAP Migration Cleanup ==="
echo "This script will remove deprecated files after the migration to react-native-iap"
echo ""

# Check if the migration is complete
if [ ! -f "./hooks/useIAP.ts" ]; then
  echo "Error: useIAP.ts not found. Migration must be completed before cleanup."
  exit 1
fi

if [ ! -f "./hooks/index.ts" ]; then
  echo "Error: hooks/index.ts not found. Migration must be completed before cleanup."
  exit 1
fi

echo "Backing up deprecated files..."
mkdir -p ./backup/hooks
cp ./hooks/useSubscription.ts ./backup/hooks/ 2>/dev/null || echo "No useSubscription.ts file found."
cp ./hooks/useSubscription.mock.ts ./backup/hooks/ 2>/dev/null || echo "No useSubscription.mock.ts file found."
cp ./hooks/useSubscriptionMock.ts ./backup/hooks/ 2>/dev/null || echo "No useSubscriptionMock.ts file found."

echo "Removing deprecated files..."
rm -f ./hooks/useSubscription.ts
rm -f ./hooks/useSubscription.mock.ts
rm -f ./hooks/useSubscriptionMock.ts

echo ""
echo "Cleanup complete. Deprecated files have been backed up to ./backup/hooks/"
echo "If you need to restore any files, you can find them in the backup directory."
