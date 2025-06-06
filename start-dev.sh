#!/bin/bash
# Script to start Expo development server with fixed Babel configuration

# Set environment variables to bypass login
export EXPO_NO_LOGIN=1
export EXPO_USE_DEV_SERVER=true

# Clear caches to prevent Babel configuration issues
echo "Clearing Metro and Babel caches..."
rm -rf node_modules/.cache
watchman watch-del-all 2>/dev/null || echo "Watchman not installed, skipping..."

# Kill any existing Expo processes
echo "Killing any existing Expo processes..."
pkill -f "expo start" || true

# Start on port 8087 with clean cache
echo "Starting Expo server with clean configuration..."
npx expo start --clear --port 8087
