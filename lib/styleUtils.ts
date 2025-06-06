/**
 * Utility functions to help with migrating from React Native StyleSheet to Tamagui
 */
import tamaguiConfig from '../tamagui.config';

// Extract tokens from the Tamagui config
const tokens = tamaguiConfig.tokens;

type ColorKey = keyof typeof tokens.color;
type SpaceKey = keyof typeof tokens.space;
type SizeKey = keyof typeof tokens.size;
type RadiusKey = keyof typeof tokens.radius;
type ZIndexKey = keyof typeof tokens.zIndex;

/**
 * Maps common color hex values to Tamagui token names
 * @param hexColor The hex color to map to a token
 * @returns The closest matching Tamagui color token or the original hex if no match
 */
export const mapColorToToken = (hexColor: string): string => {
  // Convert hex to lowercase for comparison
  const normalizedHex = hexColor.toLowerCase();
  
  // Common color mappings
  const colorMap: Record<string, string> = {
    '#ffffff': '$background',
    '#fff': '$background',
    '#000000': '$color',
    '#000': '$color',
    '#f9fafb': '$backgroundHover',
    '#f3f4f6': '$backgroundPress',
    '#e5e7eb': '$borderColor',
    '#d1d5db': '$borderColorHover',
    '#6366f1': '$primary',
    '#4f46e5': '$primaryHover',
    '#4338ca': '$primaryPress',
    '#ef4444': '$red10',
    '#dc2626': '$red11',
    '#10b981': '$green10',
    '#059669': '$green11',
    '#3b82f6': '$blue10',
    '#2563eb': '$blue11',
    '#f59e0b': '$yellow10',
    '#d97706': '$yellow11',
    '#64748b': '$gray10',
    '#475569': '$gray11',
    '#1e293b': '$gray12',
    '#1e1b4b': '$purple12',
  };
  
  return colorMap[normalizedHex] || hexColor;
};

/**
 * Maps pixel spacing values to Tamagui space tokens
 * @param pixels The pixel value to map to a token
 * @returns The closest matching Tamagui space token or the original number
 */
export const mapSpacingToToken = (pixels: number): string | number => {
  // Common spacing mappings (based on 4-point grid)
  const spacingMap: Record<number, string> = {
    0: '$0',
    2: '$0.5',
    4: '$1',
    8: '$2',
    12: '$3',
    16: '$4',
    20: '$5',
    24: '$6',
    32: '$8',
    40: '$10',
    48: '$12',
    56: '$14',
    64: '$16',
  };
  
  return spacingMap[pixels] || pixels;
};

/**
 * Maps pixel border radius values to Tamagui radius tokens
 * @param pixels The pixel value to map to a token
 * @returns The closest matching Tamagui radius token or the original number
 */
export const mapRadiusToToken = (pixels: number): string | number => {
  // Common radius mappings
  const radiusMap: Record<number, string> = {
    0: '$0',
    2: '$1',
    4: '$2',
    8: '$3',
    12: '$4',
    16: '$5',
    24: '$6',
    32: '$7',
    999: '$8', // For fully rounded corners
  };
  
  return radiusMap[pixels] || pixels;
};

/**
 * Maps font size values to Tamagui size tokens
 * @param pixels The pixel value to map to a token
 * @returns The closest matching Tamagui size token or the original number
 */
export const mapFontSizeToToken = (pixels: number): string | number => {
  // Common font size mappings
  const fontSizeMap: Record<number, string> = {
    10: '$1',
    12: '$2',
    14: '$3',
    16: '$4',
    18: '$5',
    20: '$6',
    24: '$7',
    28: '$8',
    32: '$9',
    40: '$10',
    48: '$11',
    56: '$12',
    64: '$13',
    72: '$14',
  };
  
  return fontSizeMap[pixels] || pixels;
};

/**
 * Maps font weight values to Tamagui font weight tokens
 * @param weight The font weight value to map to a token
 * @returns The closest matching Tamagui font weight token or the original value
 */
export const mapFontWeightToToken = (weight: string | number): string | number => {
  // Common font weight mappings
  const fontWeightMap: Record<string | number, string> = {
    '100': '$1',
    '200': '$2',
    '300': '$3',
    '400': '$4',
    '500': '$5',
    '600': '$6',
    '700': '$7',
    '800': '$8',
    '900': '$9',
    'normal': '$4',
    'bold': '$7',
  };
  
  return fontWeightMap[weight] || weight;
};

/**
 * Converts a React Native style object to Tamagui style props
 * @param rnStyle The React Native style object
 * @returns An object with Tamagui style props
 */
export const convertToTamaguiStyle = (rnStyle: Record<string, any>): Record<string, any> => {
  const tamaguiStyle: Record<string, any> = {};
  
  // Map each style property to its Tamagui equivalent
  Object.entries(rnStyle).forEach(([key, value]) => {
    switch (key) {
      // Colors
      case 'backgroundColor':
      case 'color':
      case 'borderColor':
      case 'borderTopColor':
      case 'borderRightColor':
      case 'borderBottomColor':
      case 'borderLeftColor':
        tamaguiStyle[key] = typeof value === 'string' ? mapColorToToken(value) : value;
        break;
        
      // Spacing
      case 'margin':
      case 'marginTop':
      case 'marginRight':
      case 'marginBottom':
      case 'marginLeft':
      case 'marginHorizontal':
      case 'marginVertical':
      case 'padding':
      case 'paddingTop':
      case 'paddingRight':
      case 'paddingBottom':
      case 'paddingLeft':
      case 'paddingHorizontal':
      case 'paddingVertical':
        tamaguiStyle[key] = typeof value === 'number' ? mapSpacingToToken(value) : value;
        break;
        
      // Border radius
      case 'borderRadius':
      case 'borderTopLeftRadius':
      case 'borderTopRightRadius':
      case 'borderBottomLeftRadius':
      case 'borderBottomRightRadius':
        tamaguiStyle[key] = typeof value === 'number' ? mapRadiusToToken(value) : value;
        break;
        
      // Font sizes
      case 'fontSize':
        tamaguiStyle[key] = typeof value === 'number' ? mapFontSizeToToken(value) : value;
        break;
        
      // Font weights
      case 'fontWeight':
        tamaguiStyle[key] = mapFontWeightToToken(value);
        break;
        
      // Pass through other properties unchanged
      default:
        tamaguiStyle[key] = value;
    }
  });
  
  return tamaguiStyle;
};

/**
 * Helper function to create a style with Tamagui tokens
 * @param style The style object with raw values
 * @returns A style object with Tamagui tokens where applicable
 */
export const createTamaguiStyle = (style: Record<string, any>): Record<string, any> => {
  return convertToTamaguiStyle(style);
};

export default {
  mapColorToToken,
  mapSpacingToToken,
  mapRadiusToToken,
  mapFontSizeToToken,
  mapFontWeightToToken,
  convertToTamaguiStyle,
  createTamaguiStyle,
};
