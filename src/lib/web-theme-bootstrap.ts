import { Platform } from 'react-native';

/**
 * Default dark until ThemeProvider hydrates preference from SecureStore.
 */
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  document.documentElement.classList.add('dark');
  document.documentElement.style.colorScheme = 'dark';
}
