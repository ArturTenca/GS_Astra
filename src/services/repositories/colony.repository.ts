import { supabase } from '@/lib/supabase';
import { mapColony } from '@/services/mappers/domain.mappers';
import type { Colony } from '@/types/domain';
import type { CreateColonyInput, UpdateColonyInput } from '@/types/colony.types';
import { BaseRepository } from './base.repository';

const COLONY_SELECT =
  'id, mission_id, name, code, location_label, status, environment_summary, created_at';

export class ColonyRepository extends BaseRepository {
  async listForCurrentUser(missionId?: string): Promise<Colony[]> {
    let query = supabase
      .from('colonies')
      .select(COLONY_SELECT)
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
      .select(COLONY_SELECT)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      this.handleError(error);
    }

    return data ? mapColony(data) : null;
  }

  async create(input: CreateColonyInput): Promise<Colony> {
    const { data, error } = await supabase
      .from('colonies')
      .insert({
        mission_id: input.missionId,
        name: input.name,
        code: input.code,
        location_label: input.locationLabel?.trim() || null,
        environment_summary: input.environmentSummary?.trim() || null,
        status: input.status,
      })
      .select(COLONY_SELECT)
      .single();

    if (error) {
      this.handleError(error);
    }

    return mapColony(data);
  }

  async update(input: UpdateColonyInput): Promise<Colony> {
    const { data, error } = await supabase
      .from('colonies')
      .update({
        ...(input.name != null ? { name: input.name } : {}),
        ...(input.code != null ? { code: input.code } : {}),
        ...(input.locationLabel !== undefined
          ? { location_label: input.locationLabel?.trim() || null }
          : {}),
        ...(input.environmentSummary !== undefined
          ? { environment_summary: input.environmentSummary?.trim() || null }
          : {}),
        ...(input.status != null ? { status: input.status } : {}),
      })
      .eq('id', input.id)
      .select(COLONY_SELECT)
      .single();

    if (error) {
      this.handleError(error);
    }

    return mapColony(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('colonies').delete().eq('id', id);

    if (error) {
      this.handleError(error);
    }
  }
}

export const colonyRepository = new ColonyRepository();
