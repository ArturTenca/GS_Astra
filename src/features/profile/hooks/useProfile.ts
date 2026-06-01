import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { profileRepository } from '@/services/repositories/profile.repository';

export function useProfile() {
  const { userId, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.profile(userId ?? ''),
    queryFn: () => {
      if (!userId) {
        throw new Error('Not authenticated');
      }
      return profileRepository.getByUserId(userId);
    },
    enabled: isAuthenticated && Boolean(userId),
  });
}
