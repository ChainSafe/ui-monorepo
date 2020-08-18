import { DefaultMixins } from '../Defaults/Mixins'

const CreateMixins = (additionalMixins?: MixinConfig): MixinConfig => {
  // No transforms required yet
  return {
    ...DefaultMixins,
    additionalMixins
  }
}

export { CreateMixins }
