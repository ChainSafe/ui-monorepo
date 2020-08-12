export interface IPalette {
  primary: string
  secondary: string
}

export type IPaletteInput = {
  readonly [K in keyof IPalette]+?: IPalette[K]
}

const createPalette = (palette: IPaletteInput): IPalette => {
  const { primary = 'white', secondary = 'black' } = palette

  return {
    primary,
    secondary
  }
}

export const lightPalette = createPalette({})
export const darkPalette = createPalette({
  primary: 'black',
  secondary: 'white'
})

export default createPalette
