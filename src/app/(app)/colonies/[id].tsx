import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { Card } from '@/components/ui/Card';
import { EmptyState, LoadingState, StatusBadge } from '@/components/ui/ScreenPrimitives';
import { useColony } from '@/features/dashboard/hooks/useDashboard';
import { getUserFacingMessage } from '@/lib/errors';
import { colonyStatusVariant } from '@/lib/formatters/status';

export default function ColonyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, error } = useColony(id ?? '');

  if (isLoading) {
    return (
      <AppScreenLayout>
        <LoadingState />
      </AppScreenLayout>
    );
  }

  if (isError || !data) {
    return (
      <AppScreenLayout>
        <EmptyState title="Colony not found" message={getUserFacingMessage(error)} />
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-center text-astra-primary">Go back</Text>
        </Pressable>
      </AppScreenLayout>
    );
  }

  return (
    <AppScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-sm text-astra-primary">← Back</Text>
        </Pressable>

        <Text className="text-2xl font-bold text-astra-text">{data.name}</Text>
        <Text className="mb-3 text-sm text-astra-accent">{data.code}</Text>
        <StatusBadge label={data.status} variant={colonyStatusVariant(data.status)} />

        <Card className="mt-4">
          <Text className="text-sm text-astra-muted">Location</Text>
          <Text className="mt-1 text-astra-text">
            {data.locationLabel ?? 'Coordinates classified'}
          </Text>
        </Card>

        <Card className="mt-3">
          <Text className="text-sm text-astra-muted">Environment</Text>
          <Text className="mt-1 text-astra-text">
            {data.environmentSummary ?? 'Telemetry pending sync.'}
          </Text>
        </Card>
      </ScrollView>
    </AppScreenLayout>
  );
}
