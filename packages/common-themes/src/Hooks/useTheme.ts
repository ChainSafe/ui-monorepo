import { useTheme as useThemeMui } from "@material-ui/styles"
import { ITheme } from ".."

const useTheme = () => useThemeMui<ITheme>()

export { useTheme }
