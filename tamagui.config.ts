import { createTamagui, createTokens, createFont, createTheme, createMedia } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'

// Create our tokens
const tokens = createTokens({
  size: {
    0: 0,
    1: 4,
    2: 8,
    3: 16,
    4: 24,
    5: 32,
    6: 40,
    7: 48,
    8: 56,
    9: 64,
    10: 72,
    true: 1,
  },
  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 16,
    4: 24,
    5: 32,
    6: 40,
    7: 48,
    8: 56,
    9: 64,
    10: 72,
    true: 1,
    '-1': -4,
    '-2': -8,
    '-3': -16,
    '-4': -24,
    '-5': -32,
    '-6': -40,
    '-7': -48,
    '-8': -56,
    '-9': -64,
    '-10': -72,
    xl: 32,
  },
  radius: {
    0: 0,
    1: 4,
    2: 8,
    3: 16,
    4: 24,
    5: 32,
    6: 40,
    7: 48,
    8: 56,
    9: 64,
    10: 72,
    xl: 24,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
  color: {
    white: '#ffffff',
    black: '#000000',
    brand: '#6D4BD8',
    accent: '#FF7A00',
    transparent: 'transparent',
  },
})

// Create our font
const interFont = createInterFont()
const fonts = {
  heading: interFont,
  body: interFont,
}

// Create our themes
const light = createTheme({
  background: '#ffffff',
  color: '#000000',
  brand: tokens.color.brand,
  accent: tokens.color.accent,
})

const dark = createTheme({
  background: '#111111',
  color: '#ffffff',
  brand: tokens.color.brand,
  accent: tokens.color.accent,
})

// Create our media queries
const media = createMedia({
  sm: { maxWidth: 790 },
  md: { maxWidth: 1100 },
  lg: { maxWidth: 1440 },
})

// Create our Tamagui config
export const tamaguiConfig = createTamagui({
  tokens,
  fonts,
  themes: {
    light,
    dark,
  },
  media,
  shorthands: {
    p: 'padding',
    pt: 'paddingTop',
    pr: 'paddingRight',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    m: 'margin',
    mt: 'marginTop',
    mr: 'marginRight',
    mb: 'marginBottom',
    ml: 'marginLeft',
    mx: 'marginHorizontal',
    my: 'marginVertical',
    bg: 'backgroundColor',
    bc: 'borderColor',
    br: 'borderRadius',
    bw: 'borderWidth',
    jc: 'justifyContent',
    ai: 'alignItems',
    ac: 'alignContent',
    as: 'alignSelf',
    fw: 'flexWrap',
    fd: 'flexDirection',
    fs: 'fontSize',
    lh: 'lineHeight',
    ff: 'fontFamily',
    fow: 'fontWeight',
    ta: 'textAlign',
    o: 'opacity',
  },
})

export type AppTamaguiConfig = typeof tamaguiConfig
export default tamaguiConfig
