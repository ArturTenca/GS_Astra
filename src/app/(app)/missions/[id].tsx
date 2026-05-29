import { router, useLocalSearchParams, type Href } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { Card } from '@/components/ui/Card';
import { EmptyState, LoadingState, StatusBadge } from '@/components/ui/ScreenPrimitives';
import { useColonies, useMission } from '@/features/dashboard/hooks/useDashboard';
import { getUserFacingMessage } from '@/lib/errors';
import { colonyStatusVariant, missionStatusVariant } from '@/lib/formatters/status';

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const missionQuery = useMission(id ?? '');
  const coloniesQuery = useColonies(id);

  if (missionQuery.isLoading) {
    return (
      <AppScreenLayout>
        <LoadingState />
      </AppScreenLayout>
    );
  }

  if (missionQuery.isError || !missionQuery.data) {
    return (
      <AppScreenLayout>
        <EmptyState
          title="Mission not found"
          message={getUserFacingMessage(missionQuery.error)}
        />
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-center text-astra-primary">Go back</Text>
        </Pressable>
      </AppScreenLayout>
    );
  }

  const mission = missionQuery.data;

  return (
    <AppScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-sm text-astra-primary">← Back to missions</Text>
        </Pressable>

        <View className="mb-2 flex-row items-center gap-2">
          <Text className="flex-1 text-2xl font-bold text-astra-text">{mission.name}</Text>
          <StatusBadge label={mission.status} variant={missionStatusVariant(mission.status)} />
        </View>
        <Text className="mb-4 text-sm text-astra-accent">{mission.code}</Text>

        <Card className="mb-4">
          <Text className="text-sm text-astra-muted">Description</Text>
          <Text className="mt-2 text-astra-text">
            {mission.description ?? 'No description available.'}
          </Text>
        </Card>

        <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-astra-muted">
          Colonies in this mission
        </Text>

        {coloniesQuery.isLoading ? <LoadingState /> : null}

        {coloniesQuery.data?.length === 0 ? (
          <EmptyState title="No colonies" message="No habitats linked to this mission yet." />
        ) : (
          <View className="gap-3">
            {coloniesQuery.data?.map((colony) => (
              <Pressable
                key={colony.id}
                className="rounded-xl border border-astra-border bg-astra-surface/80 p-4"
                onPress={() => router.push(`/(app)/colonies/${colony.id}` as Href)}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="font-semibold text-astra-text">{colony.name}</Text>
                    <Text className="text-sm text-astra-muted">{colony.code}</Text>
                  </View>
                  <StatusBadge
                    label={colony.status}
                    variant={colonyStatusVariant(colony.status)}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </AppScreenLayout>
  );
}
