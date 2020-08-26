import { useThemeSwitcher, ThemeSwitcher } from "./Provider/ThemeContext"
import { useOnClickOutside } from "./Hooks"

export {
  default as createTheme,
  ITheme,
  IPaletteColor,
  IPalette,
  IBreakpoints,
  IConstants,
  IFontWeights,
  ITypography,
} from "./Create/CreateTheme"
export { useThemeSwitcher, ThemeSwitcher, useOnClickOutside }
