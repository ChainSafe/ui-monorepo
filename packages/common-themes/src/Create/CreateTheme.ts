import createThemeConfig, {
  IThemeConfig,
  IPaletteColor,
  IPalette,
  IAnimation,
  IBreakpoints,
  IFontWeights,
  IConstants,
  ITypography,
} from "./CreateThemeConfig"
import createMixins, { MixinConfig } from "./CreateMixins"
import { DefaultGlobalStyling } from "../Defaults/GlobalStyling"

interface ITheme extends IThemeConfig {
  mixins: MixinConfig
  globalStyling: {
    "@global": Record<string, any>
  }
}

const createTheme = (
  themeConfig?: Partial<IThemeConfig>,
  mixins?: MixinConfig,
  globalStyling?: Record<string, any>,
): ITheme => {
  return {
    ...createThemeConfig(themeConfig),
    globalStyling: {
      "@global": {
        
        ...DefaultGlobalStyling,
        ...globalStyling,
      },
    },
    mixins: createMixins(mixins),
  }
}

export default createTheme

export {
  ITheme,
  IPaletteColor,
  IPalette,
  IAnimation,
  IBreakpoints,
  IConstants,
  IFontWeights,
  ITypography,
}
