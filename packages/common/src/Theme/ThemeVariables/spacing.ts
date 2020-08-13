export interface ISpacing {
  contentPadding: string
  unit: number
  em(em: number): string
  px(px: number): string
}

const spacing: ISpacing = {
  contentPadding: '15px 20px',
  unit: 8,
  em: (em: number) => `${em}em`,
  px: (px: number) => `${px}px`
}

export type ISpacingInput = {
  readonly [K in keyof ISpacing]+?: ISpacing[K]
}

const createSpacing = (spacingInput?: ISpacingInput): ISpacing => {
  const newSpacing: ISpacing = {
    ...spacing,
    ...spacingInput
  }

  return newSpacing
}

export default createSpacing
