import {
  IThemeConfig,
  IBreakpoints,
  IFontWeights,
} from "../Create/CreateThemeConfig"
import { DefaultPalette } from "./ColorPalette"

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
  bold: 600,
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
        main: DefaultPalette.gray[10],
      },
      white: {
        main: DefaultPalette.gray[1],
      },
    },
    text: {
      primary: DefaultPalette.gray[10],
    },
    background: {
      default: DefaultPalette.gray[10],
      paper: DefaultPalette.gray[9],
    },
    primary: {
      background: DefaultPalette.blue[DefaultPalette.colorTags.background],
      border: DefaultPalette.blue[DefaultPalette.colorTags.border],
      main: DefaultPalette.blue[DefaultPalette.colorTags.primary],
      hover: DefaultPalette.blue[DefaultPalette.colorTags.hover],
      active: DefaultPalette.blue[7],
    },
    secondary: {
      background: DefaultPalette.blue[DefaultPalette.colorTags.background],
      border: DefaultPalette.blue[DefaultPalette.colorTags.border],
      hover: DefaultPalette.blue[DefaultPalette.colorTags.hover],
      main: DefaultPalette.blue[DefaultPalette.colorTags.primary],
    },
    error: {
      background: DefaultPalette.red[DefaultPalette.colorTags.background],
      border: DefaultPalette.red[DefaultPalette.colorTags.border],
      hover: DefaultPalette.red[DefaultPalette.colorTags.hover],
      main: DefaultPalette.red[DefaultPalette.colorTags.primary],
    },
    warning: {
      background: DefaultPalette.gold[DefaultPalette.colorTags.background],
      border: DefaultPalette.gold[DefaultPalette.colorTags.border],
      hover: DefaultPalette.gold[DefaultPalette.colorTags.hover],
      main: DefaultPalette.gold[DefaultPalette.colorTags.primary],
    },
    success: {
      background: DefaultPalette.green[DefaultPalette.colorTags.background],
      border: DefaultPalette.green[DefaultPalette.colorTags.border],
      hover: DefaultPalette.green[DefaultPalette.colorTags.hover],
      main: DefaultPalette.green[DefaultPalette.colorTags.primary],
    },
    ...DefaultPalette,
  },
  typography: {
    global: {
      "font-family": `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',sans-serif`,
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale",
    },
    fontWeight: defaultFontWeights,
    h1: {
      fontWeight: defaultFontWeights.bold,
      fontSize: 38,
      lineHeight: `46px`,
    },
    h2: {
      fontWeight: defaultFontWeights.bold,
      fontSize: 30,
      lineHeight: `38px`,
    },
    h3: {
      fontWeight: defaultFontWeights.regular,
      fontSize: 24,
      lineHeight: `32px`,
    },
    h4: {
      fontWeight: defaultFontWeights.regular,
      fontSize: 20,
      lineHeight: `28px`,
    },
    h5: {
      fontWeight: defaultFontWeights.regular,
      fontSize: 16,
      lineHeight: `24px`,
    },
    h6: {
      fontWeight: defaultFontWeights.regular,
      fontSize: 30,
      lineHeight: `46px`,
    },
    subtitle1: {
      fontWeight: defaultFontWeights.regular,
      fontSize: 24,
      lineHeight: `32px`,
    },
    subtitle2: {
      fontWeight: defaultFontWeights.regular,
      fontSize: 24,
      lineHeight: `32px`,
    },
    body1: {
      fontWeight: defaultFontWeights.regular,
      fontSize: 14,
      lineHeight: `22px`,
      [`@media (max-width: ${breakpoints.sm}px)`]: {
        fontSize: 16,
        lineHeight: `24px`,
      },
    },
    body2: {
      fontWeight: defaultFontWeights.regular,
      fontSize: 12,
      lineHeight: `20px`,
      [`@media (max-width: ${breakpoints.sm}px)`]: {
        fontSize: 14,
        lineHeight: `22px`,
      },
    },
    button: {
      fontWeight: defaultFontWeights.regular,
      fontSize: 14,
      lineHeight: `22px`,
    },
    caption: {
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
}

export { DefaultThemeConfig }
