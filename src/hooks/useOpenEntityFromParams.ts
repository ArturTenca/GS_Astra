import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

/**
 * Opens a detail modal when the route includes `?open=<uuid>` (deep link from legacy [id] routes).
 */
export function useOpenEntityFromParams(
  onOpen: (id: string) => void,
  paramKey = 'open',
): void {
  const params = useLocalSearchParams();
  const raw = params[paramKey] as string | string[] | undefined;
  const id = Array.isArray(raw) ? raw[0] : raw;

  useEffect(() => {
    if (typeof id === 'string' && id.length > 0) {
      onOpen(id);
    }
  }, [id, onOpen]);
}
