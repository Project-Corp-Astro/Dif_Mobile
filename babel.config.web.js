module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            // Use mock hooks instead of real ones
            '@hooks/useNotifications': './hooks/useNotificationsMock',
            '@hooks/useSubscription': './hooks/useSubscriptionMock',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
