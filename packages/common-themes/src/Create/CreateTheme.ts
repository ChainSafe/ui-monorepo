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

interface ITheme<IConstantTypes = IConstants> extends IThemeConfig<IConstantTypes> {
  mixins: MixinConfig
  globalStyling: {
    "@global": Record<string, any>
  }
}

interface ICreateThemeProps<IConstantTypes> {
  themeConfig?: DeepPartial<IThemeConfig<IConstantTypes>>
  mixins?: DeepPartial<MixinConfig>
  globalStyling?: Record<string, any>
}

const createTheme = <IConstantTypes extends IConstants>(themeProps?: ICreateThemeProps<IConstantTypes>): ITheme<IConstantTypes> => {
  return {
    ...createThemeConfig<IConstantTypes>(themeProps?.themeConfig),
    globalStyling: {
      "@global": {
        ...(themeProps?.globalStyling
          ? mergeDeep(DefaultGlobalStyling, themeProps.globalStyling)
          : DefaultGlobalStyling)
      }
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
