import { DesignTokens } from '@app/api/types/project';

// Примеры пресетов для разных индустрий
export const THEME_PRESETS: Record<string, DesignTokens> = {
  healthcare: {
    name: 'Healthcare',
    primaryColor: '#0ea5e9', // sky-500
    surfaceColor: '#ffffff',
    contrastColor: '#0f172a', // slate-900
    borderRadius: '12px',
    fontFamily: { heading: 'Inter', body: 'Inter' },
    typeScale: 1.2,
    baseFontSize: 16,
  },
  grooming: {
    name: 'Pets',
    primaryColor: '#f43f5e', // rose-500
    surfaceColor: '#fffafb',
    contrastColor: '#4c0519',
    borderRadius: '32px', // Очень скругленные
    fontFamily: { heading: 'Fredoka', body: 'Quicksand' },
    typeScale: 1.3,
    baseFontSize: 16,
  },
};
