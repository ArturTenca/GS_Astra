import { supabase } from '@/lib/supabase';
import { mapMission } from '@/services/mappers/domain.mappers';
import type { Mission } from '@/types/domain';
import type { CreateMissionInput, UpdateMissionInput } from '@/types/mission.types';
import { BaseRepository } from './base.repository';

const MISSION_SELECT =
  'id, name, code, description, status, start_at, end_at, created_at';

export class MissionRepository extends BaseRepository {
  async listForCurrentUser(): Promise<Mission[]> {
    const { data, error } = await supabase
      .from('missions')
      .select(MISSION_SELECT)
      .order('created_at', { ascending: false });

    if (error) {
      this.handleError(error);
    }

    return (data ?? []).map(mapMission);
  }

  async getById(id: string): Promise<Mission | null> {
    const { data, error } = await supabase
      .from('missions')
      .select(MISSION_SELECT)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      this.handleError(error);
    }

    return data ? mapMission(data) : null;
  }

  async create(input: CreateMissionInput): Promise<Mission> {
    const { data, error } = await supabase
      .from('missions')
      .insert({
        name: input.name,
        code: input.code,
        description: input.description?.trim() || null,
        status: input.status,
        start_at: input.startAt ?? null,
        end_at: input.endAt ?? null,
      })
      .select(MISSION_SELECT)
      .single();

    if (error) {
      this.handleError(error);
    }

    return mapMission(data);
  }

  async update(input: UpdateMissionInput): Promise<Mission> {
    const { data, error } = await supabase
      .from('missions')
      .update({
        ...(input.name != null ? { name: input.name } : {}),
        ...(input.code != null ? { code: input.code } : {}),
        ...(input.description !== undefined
          ? { description: input.description?.trim() || null }
          : {}),
        ...(input.status != null ? { status: input.status } : {}),
        ...(input.startAt !== undefined ? { start_at: input.startAt } : {}),
        ...(input.endAt !== undefined ? { end_at: input.endAt } : {}),
      })
      .eq('id', input.id)
      .select(MISSION_SELECT)
      .single();

    if (error) {
      this.handleError(error);
    }

    return mapMission(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('missions').delete().eq('id', id);

    if (error) {
      this.handleError(error);
    }
  }
}

export const missionRepository = new MissionRepository();
