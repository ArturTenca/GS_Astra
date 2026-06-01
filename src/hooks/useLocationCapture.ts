import * as Location from 'expo-location';
import { useCallback, useState } from 'react';

export type LocationCoords = {
  latitude: number;
  longitude: number;
};

export type LocationCaptureStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'denied'
  | 'unavailable'
  | 'error';

export function useLocationCapture() {
  const [coords, setCoords] = useState<LocationCoords | null>(null);
  const [status, setStatus] = useState<LocationCaptureStatus>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const captureLocation = useCallback(async () => {
    setStatus('loading');
    setMessage(null);

    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setStatus('unavailable');
        setMessage('Location services are disabled on this device.');
        return;
      }

      const { status: permissionStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (permissionStatus !== Location.PermissionStatus.GRANTED) {
        setStatus('denied');
        setMessage('Location permission denied. You can still submit without GPS.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setStatus('ready');
      setMessage('Location captured successfully.');
    } catch {
      setStatus('error');
      setMessage('Unable to read GPS coordinates. Try again or submit without location.');
    }
  }, []);

  const clearLocation = useCallback(() => {
    setCoords(null);
    setStatus('idle');
    setMessage(null);
  }, []);

  return {
    coords,
    status,
    message,
    captureLocation,
    clearLocation,
    isCapturing: status === 'loading',
  };
}
