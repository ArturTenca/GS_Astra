import { supabase } from '@/lib/supabase';
import { mapMission } from '@/services/mappers/domain.mappers';
import type { Mission } from '@/types/domain';
import { BaseRepository } from './base.repository';

export class MissionRepository extends BaseRepository {
  async listForCurrentUser(): Promise<Mission[]> {
    const { data, error } = await supabase
      .from('missions')
      .select('id, name, code, description, status, start_at, end_at, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      this.handleError(error);
    }

    return (data ?? []).map(mapMission);
  }

  async getById(id: string): Promise<Mission | null> {
    const { data, error } = await supabase
      .from('missions')
      .select('id, name, code, description, status, start_at, end_at, created_at')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      this.handleError(error);
    }

    return data ? mapMission(data) : null;
  }
}

export const missionRepository = new MissionRepository();
