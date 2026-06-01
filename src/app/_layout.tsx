import 'react-native-gesture-handler';
import '@/lib/web-theme-bootstrap';
import '../../global.css';
import { Stack } from 'expo-router';
import { AppProviders } from '@/components/providers/AppProviders';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <Stack screenOptions={{ headerShown: false }} />
      </AppProviders>
    </ErrorBoundary>
  );
}
