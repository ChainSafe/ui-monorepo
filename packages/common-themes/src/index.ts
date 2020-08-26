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
  IFontWeights,
  ITypography,
} from "./Create/CreateTheme"

export {
  ThemeProvider,
  createStyles,
  makeStyles,
  useTheme,
} from "@material-ui/styles"

export { useThemeSwitcher, ThemeSwitcher, useOnClickOutside, IDefaultPalette }
