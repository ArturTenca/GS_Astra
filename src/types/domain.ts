export const APP_ROLES = [
  'viewer',
  'operator',
  'mission_lead',
  'colony_admin',
  'security_officer',
  'system_admin',
] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const PROFILE_STATUSES = ['active', 'suspended', 'pending'] as const;

export type ProfileStatus = (typeof PROFILE_STATUSES)[number];

export type UserProfile = {
  id: string;
  displayName: string;
  role: AppRole;
  status: ProfileStatus;
};
