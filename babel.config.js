module.exports = function (api) {
  api.cache(true);
  return {
    /* 1️⃣  ALWAYS keep this first */
    presets: ['babel-preset-expo'],

    /* 2️⃣  OPTIONAL plugins (array, never object)  */
    plugins: [
      'expo-router/babel',          // expo-router plugin
      ['@tamagui/babel-plugin', { components: ['tamagui'], logTimings: false }],
      [
        'module-resolver',         // module-resolver with aliases
        {
          alias: {
            '@': './',
            '@app': './app',
            '@components': './components',
            '@animations': './animations',
            '@state': './state',
            '@services': './services',
            '@hooks': './hooks',
            '@lib': './lib',
            '@theme': './theme',
            '@i18n': './i18n',
            '@tours': './tours',
            '@assets': './assets'
          }
        }
      ],
      'react-native-reanimated/plugin',   // keep LAST
    ],
  };
};
