import { CreateMixins } from './CreateMixins'
import { CreateThemeConfig } from './CreateThemeConfig'

const CreateTheme = (
  themeConfig?: IThemeConfig,
  mixins?: MixinConfig
): ITheme => {
  return {
    theme: CreateThemeConfig(themeConfig),
    mixins: CreateMixins(mixins)
  }
}

export { CreateTheme }
