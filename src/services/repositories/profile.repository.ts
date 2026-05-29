import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types/domain';
import { BaseRepository } from './base.repository';

export class ProfileRepository extends BaseRepository {
  async activateIfEmailConfirmed(): Promise<boolean> {
    const { data, error } = await supabase.rpc('activate_own_profile_if_confirmed');

    if (error) {
      this.handleError(error);
    }

    return data === true;
  }

  async getByUserId(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, role, status')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      this.handleError(error);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      displayName: data.display_name ?? '',
      role: data.role,
      status: data.status,
    };
  }
}

export const profileRepository = new ProfileRepository();
