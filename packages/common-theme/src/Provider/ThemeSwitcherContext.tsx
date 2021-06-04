import * as React from "react"
import { ITheme } from "../Create/CreateTheme"
import { useState, useEffect } from "react"
import { ThemeProvider } from "@material-ui/styles"
import "reset-css"
import "simplebar/dist/simplebar.min.css"
import { useMediaQuery } from "../Hooks"
import { createBreakpoints } from "../Create/CreateBreakpoints"
import { useLocalStorage } from "@chainsafe/browser-storage-hooks"

type ThemeSwitcherContext = {
  desktop: boolean
  themeKey: string
  availableThemes: string[]
  setTheme(themeName: string): void
};

const ThemeSwitcherContext = React.createContext<ThemeSwitcherContext | undefined>(undefined)

type ThemeSwitcherProps = {
  children: React.ReactNode
  storageKey?: string
  themes: Record<string, ITheme>
};

const ThemeSwitcher = ({ children, themes, storageKey = "cs.themeKey" }: ThemeSwitcherProps) => {
  const breakpoints = createBreakpoints({})
  const desktop = useMediaQuery(breakpoints.up("md"))
  const { canUseLocalStorage, localStorageGet, localStorageSet } = useLocalStorage()

  // TODO: check min 1 theme
  const [current, setCurrent] = useState<string>("")

  useEffect(() => {
    if (canUseLocalStorage) {
      const cached = localStorageGet(storageKey)
      if (!cached) {
        localStorageSet(storageKey, Object.keys(themes)[0])
        setCurrent(Object.keys(themes)[0])
      } else {
        setCurrent(cached)
      }
    } else {
      setCurrent(Object.keys(themes)[0])
    }
  }, [themes, setCurrent, canUseLocalStorage, storageKey, localStorageGet, localStorageSet])

  useEffect(() => {
    current != "" && localStorageSet(storageKey, current)

    // Update CSS vars 
    if (current != "" && themes[current].globalStyling["@global"][":root"]) {
      Object.keys(themes[current].globalStyling["@global"][":root"]).map(
        key => document.documentElement.style.setProperty(key, themes[current].globalStyling["@global"][":root"][key])
      )
    }
  }, [current, storageKey, canUseLocalStorage, themes, localStorageSet])

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
