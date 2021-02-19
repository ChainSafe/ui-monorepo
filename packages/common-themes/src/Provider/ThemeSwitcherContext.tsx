import * as React from "react"
import { ITheme } from "../Create/CreateTheme"
import { useState, useEffect } from "react"
import { ThemeProvider } from "@material-ui/styles"
import "reset-css"
import "simplebar/dist/simplebar.min.css"
import { testLocalStorage } from "../utils/localStorage"

type ThemeSwitcherContext = {
  themeKey: string
  availableThemes: string[]
  setTheme(themeName: string): void
}

const ThemeSwitcherContext = React.createContext<
  ThemeSwitcherContext | undefined
>(undefined)

type ThemeSwitcherProps = {
  children: React.ReactNode
  storageKey?: string
  themes: Record<string, ITheme>
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  children,
  themes,
  storageKey = "cs.themeKey",
}: ThemeSwitcherProps) => {
  // TODO: check min 1 theme
  const [current, setCurrent] = useState<string>("")

  useEffect(() => {
    const canUseLocalStorage = testLocalStorage()
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
  }, [themes, setCurrent])

  useEffect(() => {
    const canUseLocalStorage = testLocalStorage()
    if (canUseLocalStorage && current != "") {
      localStorage.setItem(storageKey, current)
    }
  }, [current])

  return (
    <ThemeSwitcherContext.Provider
      value={{
        themeKey: current,
        availableThemes: Object.keys(themes),
        setTheme: setCurrent,
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
      "useThemeSwitcher should be called within Theme Context provider",
    )
  }

  return context
}

export { ThemeSwitcher, useThemeSwitcher }
