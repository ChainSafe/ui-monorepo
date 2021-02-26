import createThemeConfig, {
  IThemeConfig,
  IPaletteColor,
  IPalette,
  IAnimation,
  IBreakpoints,
  IFontWeights,
  IConstants,
  ITypography
} from "./CreateThemeConfig"
import createMixins, { MixinConfig } from "./CreateMixins"
import { DefaultGlobalStyling } from "../Defaults/GlobalStyling"
import { DeepPartial } from "ts-essentials"
import { mergeDeep } from "../utils"

interface ITheme extends IThemeConfig {
  mixins: MixinConfig
  globalStyling: {
    "@global": Record<string, any>
  }
}

interface ICreateThemeProps {
  themeConfig?: DeepPartial<IThemeConfig>
  mixins?: DeepPartial<MixinConfig>
  globalStyling?: Record<string, any>
}

const createTheme = (themeProps?: ICreateThemeProps): ITheme => {
  return {
    ...createThemeConfig(themeProps?.themeConfig),
    globalStyling: {
      
      "@global": {
        ...(themeProps?.globalStyling
          ? mergeDeep(DefaultGlobalStyling, themeProps.globalStyling)
          : DefaultGlobalStyling),
      },
    },
    mixins: createMixins(themeProps?.mixins)
  }
}

export default createTheme

export {
  ICreateThemeProps,
  ITheme,
  IPaletteColor,
  IPalette,
  IAnimation,
  IBreakpoints,
  IConstants,
  IFontWeights,
  ITypography
}
