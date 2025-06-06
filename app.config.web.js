const config = {
  name: "Corp Astro Web",
  slug: "corp-astro-web",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  web: {
    favicon: "./assets/favicon.png",
    bundler: "metro"
  },
  entryPoint: "./App.web.tsx"
};

export default config;
