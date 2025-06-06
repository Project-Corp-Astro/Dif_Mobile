#!/bin/bash
# Script to start Expo for Android/iOS without login requirement

# Kill any existing Expo processes
pkill -f "expo start" || true

# Create necessary asset directories if they don't exist
mkdir -p ./assets/images

# Create placeholder icon if it doesn't exist
if [ ! -f ./assets/icon.png ]; then
  echo "Creating placeholder icon.png"
  # Create a simple 1024x1024 black square as icon
  convert -size 1024x1024 xc:black ./assets/icon.png 2>/dev/null || 
  echo "Warning: ImageMagick not installed, cannot create placeholder icon"
fi

# Set environment variables to bypass login
export EXPO_NO_LOGIN=1
export EXPO_OFFLINE=1
export NODE_OPTIONS=--no-warnings

echo "Starting Expo for Android/iOS without login requirement..."
# Use --offline flag to prevent login requirement
npx expo start --offline
