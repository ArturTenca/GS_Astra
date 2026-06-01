/** UI hints only — Supabase RLS is the real gate. */
export function canShowCreateActions(isAuthenticated: boolean): boolean {
  return isAuthenticated;
}

export function canManageMissionRecord(isAuthenticated: boolean): boolean {
  return isAuthenticated;
}

export function canManageColonyRecord(isAuthenticated: boolean): boolean {
  return isAuthenticated;
}

export function canEditIncident(isAuthenticated: boolean, userId: string | null): boolean {
  return isAuthenticated && userId != null;
}

export function canDeleteIncident(isAuthenticated: boolean, userId: string | null): boolean {
  return isAuthenticated && userId != null;
}
