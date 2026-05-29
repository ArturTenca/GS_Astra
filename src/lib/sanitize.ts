/** Strip control characters and trim user-provided text before storage/display. */
export function sanitizeDisplayName(value: string): string {
  return value
    .replace(/[\u0000-\u001F\u007F<>"/\\&]/g, '')
    .trim()
    .slice(0, 64);
}

export function sanitizeEmail(value: string): string {
  return value.trim().toLowerCase().slice(0, 254);
}
