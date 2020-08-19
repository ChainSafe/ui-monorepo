import { IThemeConfig } from "../Create/CreateThemeConfig"

const DefaultThemeConfig: IThemeConfig = {
  animation: {
    transform: 200,
    translate: 400,
  },
  breakpoints: {},
  constants: {},
  palette: {
    primary: {
      main: "",
    },
    secondary: {
      main: "",
    },
    error: {
      main: "",
    },
    success: {
      main: "",
    },
  },
  typography: {},
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
