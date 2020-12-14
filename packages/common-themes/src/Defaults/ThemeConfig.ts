import { IThemeConfig, IFontWeights } from "../Create/CreateThemeConfig"
import { DefaultPalette } from "./ColorPalette"
import { fade } from "../utils/colorManipulator"
import { createBreakpoints } from "../Create/CreateBreakpoints"

export const defaultFontFamilyStack = {
  fontFamily: "'Archivo', sans-serif",
}

const defaultFontStyles = {}

const defaultFontWeights: IFontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}

const defaultBreakpoints = createBreakpoints({})

const DefaultThemeConfig: IThemeConfig = {
  animation: {
    transform: 200,
    translate: 400,
  },
  breakpoints: defaultBreakpoints,
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
        maxWidth: defaultBreakpoints.keys["md"],
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
      background:
        DefaultPalette.additional.blue[DefaultPalette.colorTags.background],
      border: DefaultPalette.additional.blue[DefaultPalette.colorTags.border],
      main: DefaultPalette.additional.blue[DefaultPalette.colorTags.primary],
      hover: DefaultPalette.additional.blue[DefaultPalette.colorTags.hover],
      active: DefaultPalette.additional.blue[7],
    },
    secondary: {
      background:
        DefaultPalette.additional.blue[DefaultPalette.colorTags.background],
      border: DefaultPalette.additional.blue[DefaultPalette.colorTags.border],
      hover: DefaultPalette.additional.blue[DefaultPalette.colorTags.hover],
      main: DefaultPalette.additional.blue[DefaultPalette.colorTags.primary],
    },
    error: {
      background:
        DefaultPalette.additional.red[DefaultPalette.colorTags.background],
      border: DefaultPalette.additional.red[DefaultPalette.colorTags.border],
      hover: DefaultPalette.additional.red[DefaultPalette.colorTags.hover],
      main: DefaultPalette.additional.red[DefaultPalette.colorTags.primary],
    },
    warning: {
      background:
        DefaultPalette.additional.gold[DefaultPalette.colorTags.background],
      border: DefaultPalette.additional.gold[DefaultPalette.colorTags.border],
      hover: DefaultPalette.additional.gold[DefaultPalette.colorTags.hover],
      main: DefaultPalette.additional.gold[DefaultPalette.colorTags.primary],
    },
    success: {
      background:
        DefaultPalette.additional.green[DefaultPalette.colorTags.background],
      border: DefaultPalette.additional.green[DefaultPalette.colorTags.border],
      hover: DefaultPalette.additional.green[DefaultPalette.colorTags.hover],
      main: DefaultPalette.additional.green[DefaultPalette.colorTags.primary],
    },
    ...DefaultPalette,
  },
  typography: {
    global: {
      ...defaultFontStyles,
    },
    fontWeight: defaultFontWeights,
    h1: {
      ...defaultFontStyles,
      fontWeight: defaultFontWeights.semibold,
      fontSize: 38,
      lineHeight: `46px`,
    },
    h2: {
      ...defaultFontStyles,
      fontWeight: defaultFontWeights.semibold,
      fontSize: 30,
      lineHeight: `38px`,
    },
    h3: {
      ...defaultFontStyles,
      fontWeight: defaultFontWeights.regular,
      fontSize: 24,
      lineHeight: `32px`,
    },
    h4: {
      ...defaultFontStyles,
      fontWeight: defaultFontWeights.regular,
      fontSize: 20,
      lineHeight: `28px`,
    },
    h5: {
      ...defaultFontStyles,
      fontWeight: defaultFontWeights.regular,
      fontSize: 16,
      lineHeight: `24px`,
    },
    h6: {
      ...defaultFontStyles,
      fontWeight: defaultFontWeights.regular,
      fontSize: 30,
      lineHeight: `46px`,
    },
    subtitle1: {
      ...defaultFontStyles,
      fontWeight: defaultFontWeights.regular,
      fontSize: 24,
      lineHeight: `32px`,
    },
    subtitle2: {
      ...defaultFontStyles,
      fontWeight: defaultFontWeights.regular,
      fontSize: 24,
      lineHeight: `32px`,
    },
    body1: {
      ...defaultFontStyles,
      fontWeight: defaultFontWeights.regular,
      fontSize: 14,
      lineHeight: `22px`,
      [defaultBreakpoints.down("sm")]: {
        fontSize: 16,
        lineHeight: `24px`,
      },
    },
    body2: {
      ...defaultFontStyles,
      fontWeight: defaultFontWeights.regular,
      fontSize: 12,
      lineHeight: `20px`,
      [defaultBreakpoints.down("sm")]: {
        fontSize: 14,
        lineHeight: `22px`,
      },
    },
    button: {
      ...defaultFontStyles,
      fontWeight: defaultFontWeights.regular,
      fontSize: 14,
      lineHeight: `22px`,
    },
    caption: {
      ...defaultFontStyles,
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
