// TODO: Set defaults from Figma

import { DefaultThemeConfig } from '../Defaults/ThemeConfig'

const CreateThemeConfig = (themeConfig?: IThemeConfig): IThemeConfig => {
  // No conversion or mapping needed for now
  return {
    ...DefaultThemeConfig,
    ...themeConfig
  }
}

export { CreateThemeConfig }
