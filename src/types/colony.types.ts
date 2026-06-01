import type { ColonyStatus } from './domain';

export type CreateColonyInput = {
  missionId: string;
  name: string;
  code: string;
  locationLabel?: string | null;
  environmentSummary?: string | null;
  status: ColonyStatus;
};

export type UpdateColonyInput = {
  id: string;
  name?: string;
  code?: string;
  locationLabel?: string | null;
  environmentSummary?: string | null;
  status?: ColonyStatus;
};
