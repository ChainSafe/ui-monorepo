import createPalette, { IPalette, IPaletteInput } from './palette'

export interface ITheme {
  palette: IPalette
}

export interface IThemeInput {
  palette?: IPaletteInput
}

export const createTheme = (options?: IThemeInput): ITheme => {
  const { palette: paletteInput = {} } = options || {}

  const palette = createPalette(paletteInput)

  return {
    palette
  }
}
