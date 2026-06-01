import { Image, Pressable, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import type { LocationCaptureStatus, LocationCoords } from '@/hooks/useLocationCapture';

type LocationCaptureProps = {
  coords: LocationCoords | null;
  status: LocationCaptureStatus;
  message: string | null;
  isCapturing: boolean;
  onCapture: () => void;
  onClear: () => void;
};

export function LocationCaptureSection({
  coords,
  status,
  message,
  isCapturing,
  onCapture,
  onClear,
}: LocationCaptureProps) {
  return (
    <View className="mb-4 rounded-xl border border-astra-border bg-astra-surface/60 p-4">
      <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-astra-muted">
        GPS Location (optional)
      </Text>

      {coords ? (
        <View className="mb-3">
          <Text className="text-sm text-astra-text">
            {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
          </Text>
          <Text className="mt-1 text-xs text-astra-success">Coordinates ready</Text>
        </View>
      ) : (
        <Text className="mb-3 text-sm text-astra-muted">
          Attach your current position to the incident report.
        </Text>
      )}

      {message ? (
        <Text
          className={`mb-3 text-xs ${
            status === 'denied' || status === 'error' || status === 'unavailable'
              ? 'text-astra-warning'
              : 'text-astra-muted'
          }`}
        >
          {message}
        </Text>
      ) : null}

      <View className="flex-row gap-2">
        <View className="flex-1">
          <Button
            title={coords ? 'Update GPS' : 'Capture GPS'}
            onPress={onCapture}
            loading={isCapturing}
            variant="ghost"
          />
        </View>
        {coords ? (
          <View className="flex-1">
            <Button title="Clear" onPress={onClear} variant="ghost" />
          </View>
        ) : null}
      </View>
    </View>
  );
}

type AttachmentSectionProps = {
  attachments: { uri: string; fileName: string }[];
  error: string | null;
  onTakePhoto: () => void;
  onPickGallery: () => void;
  onRemove: (index: number) => void;
};

export function AttachmentSection({
  attachments,
  error,
  onTakePhoto,
  onPickGallery,
  onRemove,
}: AttachmentSectionProps) {
  return (
    <View className="mb-4 rounded-xl border border-astra-border bg-astra-surface/60 p-4">
      <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-astra-muted">
        Photo Evidence (optional)
      </Text>
      <Text className="mb-3 text-sm text-astra-muted">
        Up to 3 images · JPEG/PNG/WebP · max 5 MB each
      </Text>

      {error ? <Text className="mb-3 text-xs text-astra-warning">{error}</Text> : null}

      <View className="mb-3 flex-row gap-2">
        <View className="flex-1">
          <Button title="Camera" onPress={onTakePhoto} variant="ghost" />
        </View>
        <View className="flex-1">
          <Button title="Gallery" onPress={onPickGallery} variant="ghost" />
        </View>
      </View>

      {attachments.length > 0 ? (
        <View className="flex-row flex-wrap gap-2">
          {attachments.map((item, index) => (
            <View key={`${item.uri}-${index}`} className="relative">
              <Image
                source={{ uri: item.uri }}
                className="h-20 w-20 rounded-lg border border-astra-border"
                accessibilityLabel={item.fileName}
              />
              <Pressable
                onPress={() => onRemove(index)}
                className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-astra-danger"
              >
                <Text className="text-xs font-bold text-white">×</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
