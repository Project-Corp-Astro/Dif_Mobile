// Learn more https://docs.expo.io/guides/customizing-metro
const { withTamagui } = require('@tamagui/metro-plugin');
const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

/** @type {import('@react-native/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable require.context feature
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true
};

// Apply Tamagui configuration
const tamaguiConfig = withTamagui(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts',
  CSS: { generate: true } // optional if you target web
});

// Additional configuration to improve connection stability
tamaguiConfig.server = {
  ...tamaguiConfig.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Add CORS headers to allow connections from any device on the network
      res.setHeader('Access-Control-Allow-Origin', '*');
      return middleware(req, res, next);
    };
  },
};

module.exports = tamaguiConfig;
