import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/lib/auth';
import { queryClient } from '@/lib/query-client';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
