import { ITheme, useTheme, useMediaQuery } from "@chainsafe/common-theme"
import React from "react"

export type ThemeConfigContext = {
  desktop: boolean
}

type ThemeConfigProviderProps = {
  children: React.ReactNode | React.ReactNode[]
}

const ThemeConfigContext = React.createContext<ThemeConfigContext | undefined>(
  undefined,
)

const ThemeConfigProvider = ({ children }: ThemeConfigProviderProps) => {
  const { breakpoints }: ITheme = useTheme()
  const desktop = useMediaQuery(breakpoints.up("md"))

  return (
    <ThemeConfigContext.Provider
      value={{
        desktop: desktop,
      }}
    >
      {children}
    </ThemeConfigContext.Provider>
  )
}

function useThemeConfig() {
  const context = React.useContext(ThemeConfigContext)
  if (context === undefined) {
    throw new Error("useThemeConfig must be used within a ThemeConfigProvider")
  }
  return context
}

export { ThemeConfigProvider, useThemeConfig }
