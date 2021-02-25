import { DefaultMixins } from "../Defaults/Mixins"
import { mergeDeep } from "../utils/deepMerge"

type MixinConfig = Record<string, any>

const createMixins = (additionalMixins?: MixinConfig): MixinConfig => {
  // No transforms required yet
  return {
    ...mergeDeep(DefaultMixins, additionalMixins as MixinConfig)
  }
}

export default createMixins

export { MixinConfig }
