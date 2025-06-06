#!/bin/bash
# Script to start React Native development server without Expo login
# Kill any existing Metro processes
pkill -f "metro" || true
pkill -f "expo start" || true

# Set environment variables to bypass login
export EXPO_NO_LOGIN=1
export EXPO_DEBUG=true
export NODE_OPTIONS=--no-warnings

echo "Starting Metro bundler without Expo login..."
cd "$(dirname "$0")"
npx react-native start --reset-cache
