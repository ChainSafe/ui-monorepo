import React, { useState } from 'react'
import { ITheme, createTheme } from './theme'
import { ThemeProvider } from 'styled-components'

interface IThemeContext {
  theme: ITheme
  setTheme: (theme: ITheme) => void
}

const initialTheme = createTheme()

export const ThemeContext = React.createContext<IThemeContext>({
  theme: initialTheme,
  setTheme: (): void => undefined
})

export const ThemeConsumer = ThemeContext.Consumer

const AppThemeProvider: React.FC = props => {
  const [theme, setTheme] = useState<ITheme>(createTheme())

  const handleSetTheme = (theme: ITheme) => {
    console.log('here')
    setTheme(createTheme(theme))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}

export { AppThemeProvider as ThemeProvider }
