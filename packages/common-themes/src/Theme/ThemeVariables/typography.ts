export interface ITypography {
  body: string
  code: string
}

const typography: ITypography = {
  body: `'Inter',  'sans-serif'`,
  code: 'IBM Plex Mono'
}

export type ITypographyInput = {
  readonly [K in keyof ITypography]+?: ITypography[K]
}

const createTypography = (typographyInput?: ITypographyInput): ITypography => {
  const newTypography: ITypography = {
    ...typography,
    ...typographyInput
  }

  return newTypography
}

export default createTypography
