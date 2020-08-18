const DefaultTheme: ITheme = {
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
  misc: {}
}

const CreateTheme = (
  themeConfig: ITheme = DefaultTheme,
  globalStyling: Dictionary<string> = {}
) => {
  // TODO: store theme
  // TODO: inject global
}

export { CreateTheme, DefaultTheme }
