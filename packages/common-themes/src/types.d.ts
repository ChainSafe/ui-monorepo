// Shout out to Material-UI for the ground work of these patterns

// Configs
interface IPaletteColor {
  light?: string
  main: string
  dark?: string
  contrastText?: string
  [key: string]: string | undefined
}

interface IPalette {
  primary: IPaletteColor
  common?: Record<string, IPaletteColor>
  seconday?: IPaletteColor
  error: IPaletteColor
  warning?: IPaletteColor
  info?: IPaletteColor
  success: IPaletteColor
  additional?: Record<string, IPaletteColor>
}

interface ITypography {
  h1?: Record<string, any>
  h2?: Record<string, any>
  h3?: Record<string, any>
  h4?: Record<string, any>
  h5?: Record<string, any>
  h6?: Record<string, any>
  subtitle1?: Record<string, any>
  subtitle2?: Record<string, any>
  body1?: Record<string, any>
  body2?: Record<string, any>
  button?: Record<string, any>
  caption?: Record<string, any>
  overline?: Record<string, any>
  [key: string]: Record<string, any> | undefined
}

// TODO: convert to Map & Sets for efficency
interface IThemeConfig {
  animation: Record<string, any>
  breakpoints: Record<string, any> | number[]
  constants: Record<string, any>
  palette: IPalette
  typography: ITypography
  misc?: any
  zIndex?: {
    background: number
    layer0: number
    layer1: number
    layer2: number
    layer3: number
    layer4: number
    blocker: number
    [key: string]: number
  }
}

// Mixin
type MixinConfig = Record<string, any>

interface ITheme {
  theme: IThemeConfig
  mixins: MixinConfig
}
