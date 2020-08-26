import { useThemeSwitcher, ThemeSwitcher } from "./Provider/ThemeContext"
import { useOnClickOutside } from "./Hooks"
import { IDefaultPalette } from "./Defaults/ColorPalette"

export {
  default as createTheme,
  ITheme,
  IPaletteColor,
  IPalette,
  IBreakpoints,
  IConstants,
  IAnimation,
  IFontWeights,
  ITypography,
} from "./Create/CreateTheme"
export { useThemeSwitcher, ThemeSwitcher, useOnClickOutside, IDefaultPalette }
