import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const WEB_PREFIX = 'astra_pref_';

function isWeb(): boolean {
  return Platform.OS === 'web';
}

/**
 * Small preferences (theme, UI state). Web uses sessionStorage; native uses SecureStore.
 * Avoids calling SecureStore on web where setItemAsync is unavailable.
 */
export async function getPreference(key: string): Promise<string | null> {
  if (isWeb()) {
    if (typeof sessionStorage === 'undefined') return null;
    return sessionStorage.getItem(`${WEB_PREFIX}${key}`);
  }
  return SecureStore.getItemAsync(key);
}

export async function setPreference(key: string, value: string): Promise<void> {
  if (isWeb()) {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem(`${WEB_PREFIX}${key}`, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}
