# Corp Astro Mobile Application

A React Native mobile application for the Corp Astro platform, providing horoscope readings, personalized reports, and subscription services.

## Repository Structure

This repository contains the mobile frontend application built with React Native and Expo. For the backend API, please see the [Corp Astro API Repository](https://github.com/Project-Corp-Astro/Dif_API).

## Features

- **User Authentication**: Login, registration, and password recovery
- **Subscription Management**: In-app purchases with react-native-iap
- **Push Notifications**: FCM integration for real-time updates
- **Analytics Tracking**: Comprehensive event tracking for user actions
- **Personalized Content**: Horoscope readings and personalized reports
- **Chat Interface**: Real-time chat with astrological advisors

## Frontend-Backend Interaction

The mobile app interacts with the backend API in the following ways:

1. **Authentication**: JWT-based authentication with refresh token mechanism
2. **Data Fetching**: REST API calls to retrieve user data, horoscopes, and reports
3. **Real-time Updates**: WebSocket connections for chat and live notifications
4. **Push Notifications**: FCM token registration and notification handling
5. **In-App Purchases**: Receipt verification through backend API endpoints

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm
- iOS development environment (for iOS builds)
- Android development environment (for Android builds)

### Installation

```bash
# Clone the repository
git clone https://github.com/Project-Corp-Astro/Dif_Mobile.git
cd Dif_Mobile

# Install dependencies
yarn install

# Start the development server
yarn start
```

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
API_URL=https://api.example.com
ANALYTICS_KEY=your-analytics-key
```

## Development

### Running on iOS

```bash
yarn ios
```

### Running on Android

```bash
yarn android
```

### Testing

```bash
# Run tests
yarn test

# Run IAP analytics verification
cd scripts
node run_iap_analytics_verification.js
```

## Deployment

See the [IAP_DEPLOYMENT_PLAN.md](./IAP_DEPLOYMENT_PLAN.md) for detailed deployment instructions.

## Related Repositories

- [Corp Astro API](https://github.com/Project-Corp-Astro/Dif_API) - Backend API services
