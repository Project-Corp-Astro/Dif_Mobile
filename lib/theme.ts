import tamaguiConfig from '../tamagui.config';

// Extract tokens from tamagui config
const { tokens } = tamaguiConfig;

// Common color mappings from the previous styling to Tamagui tokens
export const colors = {
  primary: tokens.color.brand,
  accent: tokens.color.accent,
  background: {
    light: '#f8fafc',
    dark: '#111111',
  },
  text: {
    primary: '#1e1b4b',
    secondary: '#64748b',
    accent: '#6366f1',
    error: '#ef4444',
    light: '#ffffff',
  },
  border: {
    light: '#e2e8f0',
  },
  card: {
    background: '#ffffff',
  },
  gradient: {
    primary: ['#6366f1', '#8b5cf6'],
  },
};

// Common spacing values
export const spacing = {
  xs: tokens.space[1],
  sm: tokens.space[2],
  md: tokens.space[3],
  lg: tokens.space[4],
  xl: tokens.space[5],
  xxl: tokens.space[6],
};

// Common border radius values
export const radius = {
  sm: tokens.radius[1],
  md: tokens.radius[2],
  lg: tokens.radius[3],
  xl: tokens.radius.xl,
};

// Font sizes
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
};

// Font weights
export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};
