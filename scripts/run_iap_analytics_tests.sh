#!/bin/bash

# IAP Analytics Verification Test Runner
# This script helps run the IAP analytics verification tests and generates reports

echo "====================================================="
echo "IAP Analytics Verification Test Runner"
echo "====================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "Error: This script must be run from the project root directory."
  echo "Please cd to the project root and try again."
  exit 1
fi

# Function to run the verification tests
run_verification_tests() {
  echo "Running IAP analytics verification tests..."
  node scripts/run_iap_analytics_verification.js
  
  if [ $? -eq 0 ]; then
    echo "✅ Verification tests completed successfully."
    echo "Reports saved to:"
    echo "  - iap_analytics_verification_report.md"
    echo "  - iap_analytics_negative_verification_report.md"
  else
    echo "❌ Verification tests failed."
    exit 1
  fi
}

# Function to launch the app with the test screen
launch_test_app() {
  echo "Launching app with IAP Analytics Test Screen..."
  echo "This will start the development server and open the app."
  echo "Navigate to the IAP Analytics Test Screen to perform manual testing."
  
  # Start the app in development mode
  npm run start
}

# Function to update the testing tracker
update_testing_tracker() {
  echo "Updating IAP Testing Tracker..."
  
  # Check if the updated tracker exists
  if [ -f "IAP_TESTING_TRACKER_UPDATED.md" ]; then
    # Replace the original tracker with the updated one
    mv IAP_TESTING_TRACKER_UPDATED.md IAP_TESTING_TRACKER.md
    echo "✅ IAP Testing Tracker updated successfully."
  else
    echo "❌ IAP_TESTING_TRACKER_UPDATED.md not found."
    exit 1
  fi
}

# Main menu
show_menu() {
  echo ""
  echo "Please select an option:"
  echo "1) Run automated analytics verification tests"
  echo "2) Launch app with IAP Analytics Test Screen"
  echo "3) Update IAP Testing Tracker"
  echo "4) Exit"
  echo ""
  read -p "Enter your choice (1-4): " choice
  
  case $choice in
    1) run_verification_tests; show_menu ;;
    2) launch_test_app ;;
    3) update_testing_tracker; show_menu ;;
    4) echo "Exiting..."; exit 0 ;;
    *) echo "Invalid option. Please try again."; show_menu ;;
  esac
}

# Show the menu
show_menu
