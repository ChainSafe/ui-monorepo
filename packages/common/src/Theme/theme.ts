import createPalette, {
  IPalette,
  IPaletteInput
} from './ThemeVariables/palette'
import createSpacing, {
  ISpacing,
  ISpacingInput
} from './ThemeVariables/spacing'
import createAnimation, {
  IAnimation,
  IAnimationInput
} from './ThemeVariables/animation'
import createBreakpoints, {
  IBreakpoints,
  IBreakpointsInput
} from './ThemeVariables/breakpoints'
import createConstants, {
  IConstants,
  IConstantsInput
} from './ThemeVariables/constants'
import createTypography, {
  ITypography,
  ITypographyInput
} from './ThemeVariables/typography'

export interface ITheme {
  palette: IPalette
  spacing: ISpacing
  animation: IAnimation
  breakpoints: IBreakpoints
  constants: IConstants
  typography: ITypography
}

export interface IThemeInput {
  palette?: IPaletteInput
  spacing?: ISpacingInput
  animation?: IAnimationInput
  breakpoints?: IBreakpointsInput
  constants?: IConstantsInput
  typography?: ITypographyInput
}

export const createTheme = (options?: IThemeInput): ITheme => {
  const { palette: paletteInput = {} } = options || {}
  const { spacing: spacingInput = {} } = options || {}
  const { animation: animationInput = {} } = options || {}
  const { breakpoints: breakpointsInput = {} } = options || {}
  const { constants: constantsInput = {} } = options || {}
  const { typography: typographyInput = {} } = options || {}

  const palette = createPalette(paletteInput)
  const spacing = createSpacing(spacingInput)
  const animation = createAnimation(animationInput)
  const breakpoints = createBreakpoints(breakpointsInput)
  const constants = createConstants(constantsInput)
  const typography = createTypography(typographyInput)

  return {
    palette,
    spacing,
    animation,
    breakpoints,
    constants,
    typography
  }
}
