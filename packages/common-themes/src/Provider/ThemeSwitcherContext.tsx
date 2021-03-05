import * as React from "react"
import { ITheme } from "../Create/CreateTheme"
import { useState, useEffect } from "react"
import { ThemeProvider } from "@material-ui/styles"
import "reset-css"
import "simplebar/dist/simplebar.min.css"
import { testLocalStorage } from "../utils/localStorage"
import { useMediaQuery } from ".."
import { createBreakpoints } from "../Create/CreateBreakpoints"

type ThemeSwitcherContext = {
  desktop: boolean
  themeKey: string
  availableThemes: string[]
  setTheme(themeName: string): void
};

const ThemeSwitcherContext = React.createContext<
  ThemeSwitcherContext | undefined
>(undefined)

type ThemeSwitcherProps = {
  children: React.ReactNode
  storageKey?: string
  themes: Record<string, ITheme>
};

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  children,
  themes,
  storageKey = "cs.themeKey"
}: ThemeSwitcherProps) => {
  const breakpoints = createBreakpoints({})
  const desktop = useMediaQuery(breakpoints.up("md"))

  // TODO: check min 1 theme
  const [current, setCurrent] = useState<string>("")
  const canUseLocalStorage = React.useMemo(() => testLocalStorage(), [])

  useEffect(() => {
    if (canUseLocalStorage) {
      const cached = localStorage.getItem(storageKey)
      if (!cached) {
        localStorage.setItem(storageKey, Object.keys(themes)[0])
        setCurrent(Object.keys(themes)[0])
      } else {
        setCurrent(cached)
      }
    } else {
      setCurrent(Object.keys(themes)[0])
    }
  }, [themes, setCurrent, canUseLocalStorage, storageKey])

  useEffect(() => {
    if (canUseLocalStorage && current != "") {
      localStorage.setItem(storageKey, current)
    }
    
    // Update CSS vars 
    if (current != "" && themes[current].globalStyling["@global"][":root"]) {
      Object.keys(themes[current].globalStyling["@global"][":root"]).map(
        key => document.documentElement.style.setProperty(key, themes[current].globalStyling["@global"][":root"][key])
      )
    }
  }, [current, storageKey, canUseLocalStorage, themes])

  return (
    <ThemeSwitcherContext.Provider
      value={{
        desktop: desktop,
        themeKey: current,
        availableThemes: Object.keys(themes),
        setTheme: setCurrent
      }}
    >
      <ThemeProvider
        theme={themes[current != "" ? current : Object.keys(themes)[0]]}
      >
        {children}
      </ThemeProvider>
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

export { ThemeSwitcher, useThemeSwitcher }
