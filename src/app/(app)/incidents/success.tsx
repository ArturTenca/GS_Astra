import { router, useLocalSearchParams, type Href } from 'expo-router';
import { Text, View } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenPrimitives';

export default function IncidentSuccessScreen() {
  const { incidentId, action } = useLocalSearchParams<{
    incidentId?: string;
    action?: 'created' | 'updated';
  }>();

  const isCreated = action === 'created';
  const title = isCreated ? 'Incident Reported' : 'Status Updated';
  const subtitle = isCreated
    ? 'Your report was submitted to mission control.'
    : 'The incident status has been recorded in the timeline.';

  return (
    <AppScreenLayout centered>
      <ScreenHeader title={title} subtitle={subtitle} />

      <Card className="mb-6 w-full">
        <Text className="text-xs uppercase tracking-wider text-astra-muted">Reference</Text>
        <Text className="mt-1 text-sm text-astra-text" selectable>
          {incidentId ?? '—'}
        </Text>
        <Text className="mt-4 text-sm text-astra-muted">
          {isCreated
            ? 'Operators with access can review and update this incident.'
            : 'Changes are visible in the status timeline immediately.'}
        </Text>
      </Card>

      {incidentId ? (
        <View className="w-full gap-3">
          <Button
            title="View Incident"
            onPress={() => router.replace(`/(app)/incidents/${incidentId}` as Href)}
          />
          <Button
            title="Back to Incidents"
            variant="ghost"
            onPress={() => router.replace('/(app)/incidents' as Href)}
          />
        </View>
      ) : (
        <Button title="Back to Incidents" onPress={() => router.replace('/(app)/incidents' as Href)} />
      )}
    </AppScreenLayout>
  );
}
