import { DefaultMixins } from '../Defaults/Mixins'

type MixinConfig = Record<string, any>

const createMixins = (additionalMixins?: MixinConfig): MixinConfig => {
  // No transforms required yet
  return {
    ...DefaultMixins,
    additionalMixins
  }
}

export default createMixins

export { MixinConfig }
