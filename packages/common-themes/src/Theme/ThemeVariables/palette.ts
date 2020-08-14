export interface IPalette {
  brand: {
    darkest: string
    dark: string
    main: string
    light: string
    lightest: string
    background: string
  }
  gray: {
    darkest: string
    dark: string
    main: string
    light: string
    lightest: string
  }
  functional: {
    success1: string
    success2: string
    successFade: string
    warning1: string
    warning2: string
    warning3: string
    warningFade: string
    danger1: string
    danger2: string
  }
  overlay: string
  shadow: {
    1: string
    2: string
    3: string
    4: string
    5: string
  }
  misc: {
    light: string
  }
  gradients: {
    background: string
  }
}

const palette: IPalette = {
  brand: {
    darkest: '#170087',
    dark: '#0024BD',
    main: '#1348E4',
    light: '#6DC7F7',
    lightest: '#DCEFFE',
    background: 'white'
  },
  gray: {
    darkest: '#152935',
    dark: '#6C7D89',
    main: '#8C9BA5',
    light: '#EBF0F7',
    lightest: '#F7F8F8'
  },
  functional: {
    success1: '#00AA5E',
    success2: '#D4F7E7',
    successFade: '#A6E0C5',
    warning1: '#EFC100',
    warning2: '#FBF3D0',
    warning3: '#E3A30C',
    warningFade: '#F6E184',
    danger1: '#DB2C3E',
    danger2: '#FAE6E8'
  },
  overlay: 'rgba(21, 41, 53, 0.3)',
  shadow: {
    1: '0px 1px 2px rgba(21, 41, 53, 0.24), 0px 1px 3px rgba(21, 41, 53, 0.12)',
    2: '0px 3px 6px rgba(21, 41, 53, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.16)',
    3: '0px 3px 6px rgba(21, 41, 53, 0.1), 0px 10px 20px rgba(21, 41, 53, 0.15)',
    4: '0px 5px 10px rgba(21, 41, 53, 0.05), 0px 15px 25px rgba(21, 41, 53, 0.15)',
    5: '0px 20px 40px rgba(21, 41, 53, 0.1)'
  },
  misc: {
    light: '#FFFFFF'
  },
  gradients: {
    background: 'linear-gradient(270deg, #1348E4 0%, #170087 100%)'
  }
}

export type IPaletteInput = {
  readonly [K in keyof IPalette]+?: IPalette[K]
}

const createPalette = (paletteInput?: IPaletteInput): IPalette => {
  const newPalette: IPalette = {
    ...palette,
    ...paletteInput
  }

  return newPalette
}

export const lightPalette = createPalette()
export const darkPalette = createPalette({
  brand: {
    darkest: '#170087',
    dark: '#0024BD',
    main: 'white',
    light: '#6DC7F7',
    lightest: '#DCEFFE',
    background: 'black'
  }
})

export default createPalette
