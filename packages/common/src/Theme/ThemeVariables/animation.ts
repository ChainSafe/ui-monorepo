export interface IAnimation {
  translate: number
  transform: number
  ms: (timing: number) => string
}

const animation: IAnimation = {
  translate: 400,
  transform: 200,
  ms: (timing: number): string => `${timing}ms`
}

export type IAnimationInput = {
  readonly [K in keyof IAnimation]+?: IAnimation[K]
}

const createAnimation = (animationInput?: IAnimationInput): IAnimation => {
  const newAnimation: IAnimation = {
    ...animation,
    ...animationInput
  }

  return newAnimation
}

export default createAnimation
