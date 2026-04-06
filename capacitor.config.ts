import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'TV Browser',
  webDir: 'dist',
  android: {
    buildToolsVersion: '34.0.0',
    minSdkVersion: 22,
    targetSdkVersion: 34
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
