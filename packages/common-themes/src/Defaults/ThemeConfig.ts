import { IThemeConfig } from "../Create/CreateThemeConfig"
import { DefaultPalette } from "./ColorPalette"

const DefaultThemeConfig: IThemeConfig = {
  animation: {
    transform: 200,
    translate: 400,
  },
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
  constants: {
    generalUnit: 8,
  },
  palette: {
    common: {
      black: {
        main: DefaultPalette.gray[1],
      },
      white: {
        main: DefaultPalette.gray[10],
      },
    },
    primary: {
      main: DefaultPalette.blue[6],
    },
    secondary: {
      main: DefaultPalette.blue[6],
    },
    error: {
      main: DefaultPalette.red[6],
    },
    warning: {
      main: DefaultPalette.gold[6],
    },
    success: {
      main: DefaultPalette.green[6],
    },
  },
  typography: {
    h1: {},
    h2: {},
    h3: {},
    h4: {},
    h5: {},
    h6: {},
    subtitle1: {},
    subtitle2: {},
    body1: {},
    body2: {},
    button: {},
    caption: {},
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
