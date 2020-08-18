// TODO: Set defaults from Figma

const DefaultTheme: IThemeConfig = {
  animation: {
    transform: 200,
    translate: 400
  },
  breakpoints: {},
  constants: {},
  palette: {
    primary: {
      main: ''
    },
    seconday: {
      main: ''
    },
    error: {
      main: ''
    },
    success: {
      main: ''
    }
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
    blocker: 10000
  }
}

const CreateThemeConfig = (themeConfig?: IThemeConfig): IThemeConfig => {
  // No conversion or mapping needed for now
  return {
    ...DefaultTheme,
    ...themeConfig
  }
}

export { CreateThemeConfig, DefaultTheme }
