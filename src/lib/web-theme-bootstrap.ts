import { Platform } from 'react-native';

/**
 * Must load before global.css on web so NativeWind (darkMode: class) can sync
 * with app.config userInterfaceStyle: 'dark' without throwing.
 */
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  document.documentElement.classList.add('dark');
  document.documentElement.style.colorScheme = 'dark';
}
