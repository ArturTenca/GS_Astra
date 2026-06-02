export type ThemeMode = 'light' | 'dark';

export type ThemePalette = {
  bg: string;
  surface: string;
  panel: string;
  border: string;
  primary: string;
  accent: string;
  glow: string;
  danger: string;
  warning: string;
  success: string;
  muted: string;
  text: string;
  gradientStart: string;
  gradientEnd: string;
  tabBar: string;
  tabBarBorder: string;
  tabActive: string;
  tabInactive: string;
  chartCyan: string;
  chartPurple: string;
  chartGreen: string;
};

export const lightPalette: ThemePalette = {
  bg: '#f4f6fb',
  surface: '#ffffff',
  panel: '#f1f5f9',
  border: '#e2e8f0',
  primary: '#2563eb',
  accent: '#6366f1',
  glow: '#818cf8',
  danger: '#dc2626',
  warning: '#d97706',
  success: '#059669',
  muted: '#64748b',
  text: '#0f172a',
  gradientStart: '#2563eb',
  gradientEnd: '#7c3aed',
  tabBar: '#ffffff',
  tabBarBorder: '#e2e8f0',
  tabActive: '#2563eb',
  tabInactive: '#94a3b8',
  chartCyan: '#0ea5e9',
  chartPurple: '#8b5cf6',
  chartGreen: '#10b981',
};

export const darkPalette: ThemePalette = {
  bg: '#060a12',
  surface: '#0f1628',
  panel: '#151f33',
  border: '#243047',
  primary: '#3b82f6',
  accent: '#22d3ee',
  glow: '#818cf8',
  danger: '#f87171',
  warning: '#fbbf24',
  success: '#34d399',
  muted: '#94a3b8',
  text: '#f1f5f9',
  gradientStart: '#22d3ee',
  gradientEnd: '#a855f7',
  tabBar: '#0c1220',
  tabBarBorder: '#243047',
  tabActive: '#22d3ee',
  tabInactive: '#64748b',
  chartCyan: '#22d3ee',
  chartPurple: '#a855f7',
  chartGreen: '#34d399',
};

export function getPalette(mode: ThemeMode): ThemePalette {
  return mode === 'dark' ? darkPalette : lightPalette;
}
