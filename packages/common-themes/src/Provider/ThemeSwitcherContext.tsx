import * as React from "react"
import { ITheme, } from "../Create/CreateTheme"
import { useState, } from "react"
import { ThemeProvider, } from "@material-ui/styles"
import "reset-css"
import "simplebar/dist/simplebar.min.css"

type ThemeSwitcherContext = {
  themeKey: string;
  availableThemes: string[];
  setTheme(themeName: string): void;
};

const ThemeSwitcherContext = React.createContext<
  ThemeSwitcherContext | undefined
>(undefined)

type ThemeSwitcherProps = {
  children: React.ReactNode;
  themes: Record<string, ITheme>;
};

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  children,
  themes,
}: ThemeSwitcherProps) => {
  // TODO: check min 1 theme
  const [current, setCurrent,] = useState<string>(Object.keys(themes)[0])
  return (
    <ThemeSwitcherContext.Provider
      value={{
        themeKey: current,
        availableThemes: Object.keys(themes),
        setTheme: setCurrent,
      }}
    >
      <ThemeProvider theme={themes[current]}>{children}</ThemeProvider>
    </ThemeSwitcherContext.Provider>
  )
}

const useThemeSwitcher = () => {
  const context = React.useContext(ThemeSwitcherContext)
  if (context == undefined) {
    throw new Error(
      "useThemeSwitcher should be called within Theme Context provider"
    )
  }

  return context
}

export { ThemeSwitcher, useThemeSwitcher, }
