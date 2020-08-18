// Shout out to Material-UI for the ground work of these patterns

type Dictionary<T> = {
  [key: string]: T
}

interface IPaletteColor {
  light?: string
  main: string
  dark?: string
  contrastText?: string
  [key: string]: string | undefined
}

interface IPalette {
  primary: IPaletteColor
  seconday?: IPaletteColor
  error: IPaletteColor
  warning?: IPaletteColor
  info?: IPaletteColor
  success: IPaletteColor
  additional?: Dictionary<IPaletteColor>
}

interface ITypography {
  h1?: Dictionary<string>
  h2?: Dictionary<string>
  h3?: Dictionary<string>
  h4?: Dictionary<string>
  h5?: Dictionary<string>
  h6?: Dictionary<string>
  subtitle1?: Dictionary<string>
  subtitle2?: Dictionary<string>
  body1?: Dictionary<string>
  body2?: Dictionary<string>
  [key: string]: Dictionary<string> | undefined
}

// TODO: convert to Map & Sets for efficency
interface ITheme {
  animation: Dictionary<any>
  breakpoints: Dictionary<any> | number[]
  constants: Dictionary<any>
  palette: IPalette
  typography: ITypography
  misc?: any
}
