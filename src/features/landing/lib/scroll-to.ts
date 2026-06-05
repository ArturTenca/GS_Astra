import { Platform } from 'react-native';

export function scrollToSection(sectionId: string): void {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
}
