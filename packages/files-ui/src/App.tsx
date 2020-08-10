import React from 'react'
import { Provider } from 'react-redux'
import store from 'src/store/store'
import { ThemeProvider } from 'styled-components'
import { AppThemeProvider } from 'src/HOCs/contexts/ThemeContext'
import Router from 'src/HOCs/routes/Router'
import theme from 'src/assets/styles/theme.json'
import './App.css'
import { ConfiguredWalletProvider } from './HOCs/ConfiguredWalletProvider/ConfiguredWalletProvider'
import { ErrorBoundary } from './HOCs/ErrorBoundary'

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <ConfiguredWalletProvider>
          <ThemeProvider theme={theme}>
            <AppThemeProvider>
              <Router />
            </AppThemeProvider>
          </ThemeProvider>
        </ConfiguredWalletProvider>
      </ErrorBoundary>
    </Provider>
  )
}

export default App
