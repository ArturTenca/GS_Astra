import 'dotenv/config';
import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'ASTRA',
  slug: 'astra',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'astra',
  userInterfaceStyle: 'dark',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0a0e17',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.astra.mobile',
    infoPlist: {
      NSCameraUsageDescription:
        'ASTRA needs camera access to attach photo evidence to incident reports.',
      NSPhotoLibraryUsageDescription:
        'ASTRA needs gallery access to attach photo evidence to incident reports.',
      NSLocationWhenInUseUsageDescription:
        'ASTRA uses your location to geotag incident reports for mission operations.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0a0e17',
    },
    package: 'com.astra.mobile',
    permissions: [
      'ACCESS_COARSE_LOCATION',
      'ACCESS_FINE_LOCATION',
      'CAMERA',
      'READ_MEDIA_IMAGES',
    ],
  },
  web: {
    bundler: 'metro',
    output: 'single',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-font',
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'ASTRA uses your location to geotag incident reports for mission operations.',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          'ASTRA needs gallery access to attach photo evidence to incident reports.',
        cameraPermission:
          'ASTRA needs camera access to attach photo evidence to incident reports.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
});
