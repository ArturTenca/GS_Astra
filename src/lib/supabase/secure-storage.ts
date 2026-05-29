import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { SupportedStorage } from '@supabase/supabase-js';

/** Safe margin under Expo SecureStore size limits on iOS. */
const CHUNK_SIZE = 1800;
const WEB_STORAGE_PREFIX = 'astra_secure_';

function chunkKey(key: string, index: number): string {
  return `${key}_chunk_${index}`;
}

function isWeb(): boolean {
  return Platform.OS === 'web';
}

/** Web fallback: sessionStorage (tab-scoped). Native uses SecureStore only. */
const webStorage = {
  getItem: (key: string): string | null => {
    if (typeof sessionStorage === 'undefined') return null;
    return sessionStorage.getItem(`${WEB_STORAGE_PREFIX}${key}`);
  },
  setItem: (key: string, value: string): void => {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem(`${WEB_STORAGE_PREFIX}${key}`, value);
  },
  removeItem: (key: string): void => {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.removeItem(`${WEB_STORAGE_PREFIX}${key}`);
  },
};

async function getLargeItem(key: string): Promise<string | null> {
  if (isWeb()) {
    return webStorage.getItem(key);
  }

  const metaRaw = await SecureStore.getItemAsync(`${key}_meta`);
  if (!metaRaw) {
    return SecureStore.getItemAsync(key);
  }

  const meta = JSON.parse(metaRaw) as { chunks: number };
  const parts: string[] = [];

  for (let i = 0; i < meta.chunks; i++) {
    const part = await SecureStore.getItemAsync(chunkKey(key, i));
    if (part == null) {
      return null;
    }
    parts.push(part);
  }

  return parts.join('');
}

async function setLargeItem(key: string, value: string): Promise<void> {
  if (isWeb()) {
    webStorage.setItem(key, value);
    return;
  }

  if (value.length <= CHUNK_SIZE) {
    await removeLargeItem(key);
    await SecureStore.setItemAsync(key, value);
    return;
  }

  const chunks = Math.ceil(value.length / CHUNK_SIZE);
  for (let i = 0; i < chunks; i++) {
    await SecureStore.setItemAsync(
      chunkKey(key, i),
      value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
    );
  }
  await SecureStore.setItemAsync(`${key}_meta`, JSON.stringify({ chunks }));
}

async function removeLargeItem(key: string): Promise<void> {
  if (isWeb()) {
    webStorage.removeItem(key);
    return;
  }

  const metaRaw = await SecureStore.getItemAsync(`${key}_meta`);
  if (metaRaw) {
    const meta = JSON.parse(metaRaw) as { chunks: number };
    for (let i = 0; i < meta.chunks; i++) {
      await SecureStore.deleteItemAsync(chunkKey(key, i));
    }
    await SecureStore.deleteItemAsync(`${key}_meta`);
  }
  await SecureStore.deleteItemAsync(key);
}

/**
 * Supabase auth storage: SecureStore on native, sessionStorage on web.
 * Never uses @react-native-async-storage/async-storage.
 */
export const supabaseSecureStorage: SupportedStorage = {
  getItem: (key) => getLargeItem(key),
  setItem: (key, value) => setLargeItem(key, value),
  removeItem: (key) => removeLargeItem(key),
};
