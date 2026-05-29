import { supabase } from '@/lib/supabase';
import { mapColony } from '@/services/mappers/domain.mappers';
import type { Colony } from '@/types/domain';
import { BaseRepository } from './base.repository';

export class ColonyRepository extends BaseRepository {
  async listForCurrentUser(missionId?: string): Promise<Colony[]> {
    let query = supabase
      .from('colonies')
      .select(
        'id, mission_id, name, code, location_label, status, environment_summary, created_at',
      )
      .order('name', { ascending: true });

    if (missionId) {
      query = query.eq('mission_id', missionId);
    }

    const { data, error } = await query;

    if (error) {
      this.handleError(error);
    }

    return (data ?? []).map(mapColony);
  }

  async getById(id: string): Promise<Colony | null> {
    const { data, error } = await supabase
      .from('colonies')
      .select(
        'id, mission_id, name, code, location_label, status, environment_summary, created_at',
      )
      .eq('id', id)
      .maybeSingle();

    if (error) {
      this.handleError(error);
    }

    return data ? mapColony(data) : null;
  }
}

export const colonyRepository = new ColonyRepository();
