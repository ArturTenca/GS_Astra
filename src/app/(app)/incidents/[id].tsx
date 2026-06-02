import { Redirect, useLocalSearchParams } from 'expo-router';

/** Deep link → incidents list with popup open. */
export default function IncidentDeepLinkScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return <Redirect href="/(app)/incidents" />;
  }

  return <Redirect href={`/(app)/incidents?open=${id}`} />;
}
