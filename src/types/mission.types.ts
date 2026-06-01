import type { MissionStatus } from './domain';

export type CreateMissionInput = {
  name: string;
  code: string;
  description?: string | null;
  status: MissionStatus;
  startAt?: string | null;
  endAt?: string | null;
};

export type UpdateMissionInput = {
  id: string;
  name?: string;
  code?: string;
  description?: string | null;
  status?: MissionStatus;
  startAt?: string | null;
  endAt?: string | null;
};
