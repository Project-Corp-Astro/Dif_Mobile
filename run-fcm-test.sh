#!/bin/bash

# FCM Testing Script for Corp Astro Mobile
# This script helps build and run the app for FCM testing

echo "===== Corp Astro Mobile FCM Testing ====="
echo ""

# Function to display the menu
show_menu() {
  echo "Select an option:"
  echo "1. Run on Android device"
  echo "2. Run on iOS device"
  echo "3. Build development client"
  echo "4. Check connected devices"
  echo "5. Exit"
  echo ""
  echo -n "Enter your choice [1-5]: "
}

# Function to check for connected Android devices
check_devices() {
  echo "Checking for connected devices..."
  export PATH=$PATH:~/Library/Android/sdk/platform-tools
  adb devices
}

# Function to run on Android
run_android() {
  echo "Building and running on Android..."
  npx expo run:android --device
}

# Function to run on iOS
run_ios() {
  echo "Building and running on iOS..."
  npx expo run:ios --device
}

# Function to build development client
build_dev_client() {
  echo "Building development client..."
  npx expo prebuild --clean
  echo "Development client built successfully"
  echo "You can now run the app on a physical device using option 1 or 2"
}

# Main loop
while true; do
  show_menu
  read choice
  
  case $choice in
    1)
      run_android
      ;;
    2)
      run_ios
      ;;
    3)
      build_dev_client
      ;;
    4)
      check_devices
      ;;
    5)
      echo "Exiting..."
      exit 0
      ;;
    *)
      echo "Invalid option. Please try again."
      ;;
  esac
  
  echo ""
  echo "Press Enter to continue..."
  read
  clear
done
