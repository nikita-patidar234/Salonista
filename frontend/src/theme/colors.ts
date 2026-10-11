export const colors = {
  primary: '#B85C75',
  primaryDark: '#93435A',
  background: '#FFF9F7',
  surface: '#FFFFFF',
  text: '#292126',
  textSecondary: '#766B72',
  border: '#EFE3E6',
  accent: '#E8B86D',
  success: '#2E8064',
  error: '#C64646',
  overlay: 'rgba(41, 33, 38, 0.38)',
  mutedSurface: '#FAF1F3',
  disabled: '#D9CDD1',
  white: '#FFFFFF',
} as const;

export type ColorName = keyof typeof colors;
