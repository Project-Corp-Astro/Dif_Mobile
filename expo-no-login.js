// Custom script to start Expo without login requirement
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create a temporary expo-settings.json file to bypass login
const settingsPath = path.join(__dirname, 'expo-settings.json');
const settings = {
  "sendTo": "lan",
  "developer": {
    "tool": "expo-cli"
  },
  "scheme": "exp",
  "hostType": "lan",
  "lanType": "ip",
  "dev": true,
  "minify": false,
  "https": false
};

fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
console.log('Created temporary settings file to bypass login');

// Set environment variables
process.env.EXPO_NO_LOGIN = '1';
process.env.EXPO_USE_DEV_SERVER = 'true';
process.env.EXPO_OFFLINE = '1';

// Start the Expo process
console.log('Starting Expo without login requirement...');
const expo = spawn('npx', ['expo', 'start', '--dev-client', '--no-login', '--port', '8083'], {
  stdio: 'inherit',
  env: process.env
});

// Clean up on exit
process.on('SIGINT', () => {
  console.log('Cleaning up...');
  try {
    fs.unlinkSync(settingsPath);
  } catch (e) {
    // Ignore errors
  }
  expo.kill();
  process.exit();
});

expo.on('close', (code) => {
  console.log(`Expo process exited with code ${code}`);
  try {
    fs.unlinkSync(settingsPath);
  } catch (e) {
    // Ignore errors
  }
  process.exit(code);
});
