import { isAlertActive, isAlertExpired, formatDisplayDate } from '@/lib/dates/alert-dates';
import { alertSeverityVariant } from '@/lib/formatters/status';
import type { Alert } from '@/types/alert.types';

export function getAlertListBadge(alert: Alert): {
  label: string;
  variant: 'default' | 'success' | 'warning' | 'danger' | 'info';
} {
  if (alert.acknowledgedAt) {
    return { label: 'ack', variant: 'success' };
  }
  if (isAlertExpired(alert)) {
    return { label: 'expired', variant: 'default' };
  }
  return { label: alert.severity, variant: alertSeverityVariant(alert.severity) };
}

export function getAlertStatusLine(alert: Alert): string {
  if (alert.acknowledgedAt) {
    return 'Acknowledged';
  }
  if (isAlertExpired(alert)) {
    return `Expired · deadline ${formatDisplayDate(alert.activeUntil)}`;
  }
  if (isAlertActive(alert)) {
    return alert.activeUntil
      ? `Active until ${formatDisplayDate(alert.activeUntil)}`
      : 'Active · no deadline';
  }
  return 'Inactive';
}
