export interface IBreakpoints {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
}

const breakpoints: IBreakpoints = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1920
}

export type IBreakpointsInput = {
  readonly [K in keyof IBreakpoints]+?: IBreakpoints[K]
}

const createBreakpoints = (
  breakpointsInput?: IBreakpointsInput
): IBreakpoints => {
  const newBreakpoints: IBreakpoints = {
    ...breakpoints,
    ...breakpointsInput
  }

  return newBreakpoints
}

export default createBreakpoints
