/** Local calendar date as YYYY-MM-DD (matches CalendarPicker selection). */
export function toLocalISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayLocalISODate(): string {
  return toLocalISODate(new Date());
}

export function parseISODate(iso: string): Date {
  const parts = iso.split('-').map(Number);
  const y = parts[0] ?? 2000;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  return new Date(y, m - 1, d);
}

export function formatDisplayDate(iso: string | null): string {
  if (!iso) return 'No deadline';
  try {
    return parseISODate(iso).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function isAlertActive(alert: {
  acknowledgedAt: string | null;
  activeUntil: string | null;
}): boolean {
  if (alert.acknowledgedAt != null) return false;
  if (alert.activeUntil == null) return true;
  return alert.activeUntil >= todayLocalISODate();
}

export function isAlertExpired(alert: {
  acknowledgedAt: string | null;
  activeUntil: string | null;
}): boolean {
  if (alert.acknowledgedAt != null) return false;
  if (alert.activeUntil == null) return false;
  return alert.activeUntil < todayLocalISODate();
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function startWeekday(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}
