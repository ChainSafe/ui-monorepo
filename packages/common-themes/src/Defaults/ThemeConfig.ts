import {
  IThemeConfig,
  IBreakpoints,
  IFontWeights,
} from "../Create/CreateThemeConfig"
import { DefaultPalette } from "./ColorPalette"
import { fade } from "../utils/colorManipulator"

const defaultFontFamilyStack = {
  fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',sans-serif`,
}

const breakpoints: IBreakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
}

const defaultFontWeights: IFontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}

const DefaultThemeConfig: IThemeConfig = {
  animation: {
    transform: 200,
    translate: 400,
  },
  breakpoints: breakpoints,
  constants: {
    generalUnit: 8,
    icon: {
      width: 25,
      height: 25,
    },
    modal: {
      inner: {
        minWidth: 30,
        minHeight: 30,
        maxWidth: breakpoints.md,
      },
      backgroundFade: 0.4,
    },
  },
  palette: {
    common: {
      black: {
        main: DefaultPalette.additional.gray[10],
      },
      white: {
        main: DefaultPalette.additional.gray[1],
      },
    },
    text: {
      primary: DefaultPalette.additional.gray[10],
    },
    background: {
      default: DefaultPalette.additional.gray[1],
      paper: DefaultPalette.additional.gray[2],
    },
    primary: {
      background: DefaultPalette.additional.blue[DefaultPalette.colorTags.background],
      border: DefaultPalette.additional.blue[DefaultPalette.colorTags.border],
      main: DefaultPalette.additional.blue[DefaultPalette.colorTags.primary],
      hover: DefaultPalette.additional.blue[DefaultPalette.colorTags.hover],
      active: DefaultPalette.additional.blue[7],
    },
    secondary: {
      background: DefaultPalette.additional.blue[DefaultPalette.colorTags.background],
      border: DefaultPalette.additional.blue[DefaultPalette.colorTags.border],
      hover: DefaultPalette.additional.blue[DefaultPalette.colorTags.hover],
      main: DefaultPalette.additional.blue[DefaultPalette.colorTags.primary],
    },
    error: {
      background: DefaultPalette.additional.red[DefaultPalette.colorTags.background],
      border: DefaultPalette.additional.red[DefaultPalette.colorTags.border],
      hover: DefaultPalette.additional.red[DefaultPalette.colorTags.hover],
      main: DefaultPalette.additional.red[DefaultPalette.colorTags.primary],
    },
    warning: {
      background: DefaultPalette.additional.gold[DefaultPalette.colorTags.background],
      border: DefaultPalette.additional.gold[DefaultPalette.colorTags.border],
      hover: DefaultPalette.additional.gold[DefaultPalette.colorTags.hover],
      main: DefaultPalette.additional.gold[DefaultPalette.colorTags.primary],
    },
    success: {
      background: DefaultPalette.additional.green[DefaultPalette.colorTags.background],
      border: DefaultPalette.additional.green[DefaultPalette.colorTags.border],
      hover: DefaultPalette.additional.green[DefaultPalette.colorTags.hover],
      main: DefaultPalette.additional.green[DefaultPalette.colorTags.primary],
    },
    ...DefaultPalette,
  },
  typography: {
    global: {
      ...defaultFontFamilyStack,
    },
    fontWeight: defaultFontWeights,
    h1: {
      ...defaultFontFamilyStack,
      fontWeight: defaultFontWeights.semibold,
      fontSize: 38,
      lineHeight: `46px`,
    },
    h2: {
      ...defaultFontFamilyStack,
      fontWeight: defaultFontWeights.semibold,
      fontSize: 30,
      lineHeight: `38px`,
    },
    h3: {
      ...defaultFontFamilyStack,
      fontWeight: defaultFontWeights.regular,
      fontSize: 24,
      lineHeight: `32px`,
    },
    h4: {
      ...defaultFontFamilyStack,
      fontWeight: defaultFontWeights.regular,
      fontSize: 20,
      lineHeight: `28px`,
    },
    h5: {
      ...defaultFontFamilyStack,
      fontWeight: defaultFontWeights.regular,
      fontSize: 16,
      lineHeight: `24px`,
    },
    h6: {
      ...defaultFontFamilyStack,
      fontWeight: defaultFontWeights.regular,
      fontSize: 30,
      lineHeight: `46px`,
    },
    subtitle1: {
      ...defaultFontFamilyStack,
      fontWeight: defaultFontWeights.regular,
      fontSize: 24,
      lineHeight: `32px`,
    },
    subtitle2: {
      ...defaultFontFamilyStack,
      fontWeight: defaultFontWeights.regular,
      fontSize: 24,
      lineHeight: `32px`,
    },
    body1: {
      ...defaultFontFamilyStack,
      fontWeight: defaultFontWeights.regular,
      fontSize: 14,
      lineHeight: `22px`,
      [`@media (max-width: ${breakpoints.sm}px)`]: {
        fontSize: 16,
        lineHeight: `24px`,
      },
    },
    body2: {
      ...defaultFontFamilyStack,
      fontWeight: defaultFontWeights.regular,
      fontSize: 12,
      lineHeight: `20px`,
      [`@media (max-width: ${breakpoints.sm}px)`]: {
        fontSize: 14,
        lineHeight: `22px`,
      },
    },
    button: {
      ...defaultFontFamilyStack,
      fontWeight: defaultFontWeights.regular,
      fontSize: 14,
      lineHeight: `22px`,
    },
    caption: {
      ...defaultFontFamilyStack,
      fontWeight: defaultFontWeights.regular,
      fontSize: 12,
      lineHeight: `20px`,
    },
  },
  misc: {},
  zIndex: {
    background: -1,
    layer0: 1000,
    layer1: 1500,
    layer2: 2000,
    layer3: 2500,
    layer4: 3000,
    blocker: 10000,
  },
  shadows: {
    shadow1: `0px 1px 4px ${fade(DefaultPalette.additional.gray[10], 0.15)}`,
    shadow2: `0px 2px 8px ${fade(DefaultPalette.additional.gray[10], 0.25)}`,
  },
}

export { DefaultThemeConfig }
