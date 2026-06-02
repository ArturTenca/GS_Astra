import { Redirect, useLocalSearchParams } from 'expo-router';

/** Deep link → missions list with popup open. */
export default function MissionDeepLinkScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return <Redirect href="/(app)/missions" />;
  }

  return <Redirect href={`/(app)/missions?open=${id}`} />;
}
