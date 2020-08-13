import React, { useEffect, useState } from 'react'
import { IAppTheme } from '../../types'
import { getThemeLocal, setThemeLocal } from '../../util/localstorage'

import darkVars from '../../assets/styles/dark.json'
import lightVars from '../../assets/styles/light.json'

interface IThemeContext {
  theme: IAppTheme
  setTheme: (theme: IAppTheme) => void
}

export const ThemeContext = React.createContext<IThemeContext | null>(null)

interface IMyProps {
  children: any
}

export const AppThemeProvider: React.FC<IMyProps> = props => {
  const [themeState, setThemeState] = useState<IAppTheme>('light')

  if ((window as any).less && (window as any).less.modifyVars) {
    ;(window as any).less
      .modifyVars(lightVars)
      .then(() => {
        // necessary states and storage
      })
      .catch(() => {
        // createToast("Failed to change theme", "error");
      })
  }

  useEffect(() => {
    const localTheme = getThemeLocal() || 'light'
    const finalTheme: IAppTheme = localTheme === 'dark' ? 'dark' : 'light'

    const vars = localTheme === 'light' ? lightVars : darkVars
    // change less variables
    if ((window as any).less && (window as any).less.modifyVars) {
      ;(window as any).less
        .modifyVars(vars)
        .then(() => {
          // necessary states and storage
          setThemeState(finalTheme)
          setThemeLocal(finalTheme)
        })
        .catch(() => {
          // createToast("Failed to change theme", "error");
        })
    }
  }, [])

  const setTheme = (theme: IAppTheme) => {
    const vars = theme === 'light' ? lightVars : darkVars
      // change less variables
    ;(window as any).less
      .modifyVars(vars)
      .then(() => {
        // necessary states and storage
        setThemeLocal(theme)
        setThemeState(theme)
      })
      .catch(() => {
        // createToast("Failed to change theme", "error");
      })

    // change styled components provider
  }

  return (
    <ThemeContext.Provider value={{ theme: themeState, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  )
}
