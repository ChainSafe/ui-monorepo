import createThemeConfig, { IThemeConfig } from "./CreateThemeConfig"
import createMixins, { MixinConfig } from "./CreateMixins"

interface ITheme extends IThemeConfig {
  mixins: MixinConfig
}

const createTheme = (
  themeConfig?: Partial<IThemeConfig>,
  mixins?: MixinConfig,
): ITheme => {
  return {
    ...createThemeConfig(themeConfig),
    mixins: createMixins(mixins),
  }
}

export default createTheme

export { ITheme }
