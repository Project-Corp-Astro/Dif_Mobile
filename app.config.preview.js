const config = {
  name: "Corp Astro Preview",
  slug: "corp-astro-preview",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.corpastrogroup.preview"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.corpastrogroup.preview"
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  entryPoint: "./App.preview.tsx"
};

export default config;
