import { Redirect, useLocalSearchParams } from 'expo-router';

/** Deep link → colonies list with popup open. */
export default function ColonyDeepLinkScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return <Redirect href="/(app)/colonies" />;
  }

  return <Redirect href={`/(app)/colonies?open=${id}`} />;
}
