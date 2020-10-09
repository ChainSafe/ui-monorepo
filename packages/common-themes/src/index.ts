import {
  useThemeSwitcher,
  ThemeSwitcher,
} from "./Provider/ThemeSwitcherContext"
import { IDefaultPalette } from "./Defaults/ColorPalette"

export {
  default as createTheme,
  ICreateThemeProps,
  ITheme,
  IPaletteColor,
  IPalette,
  IBreakpoints,
  IConstants,
  IAnimation,
  IFontWeights,
  ITypography,
} from "./Create/CreateTheme"

export { ThemeProvider, createStyles, makeStyles } from "@material-ui/styles"

export { useThemeSwitcher, ThemeSwitcher, IDefaultPalette }
export * from "./Hooks"
export * from "./utils"
