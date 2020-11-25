import React from "react"
import { ThemeProvider, createTheme } from "@chainsafe/common-theme"
import { LanguageProvider } from "./LanguageContext"
import { CssBaseline, Router } from "@chainsafe/common-components"
import Routes from "./Components/Routes"

const theme = createTheme({
  globalStyling: {
    body: {
      color: "#fafafa",
    },
    a: {
      color: "#fafafa",
    },
  },
  themeConfig: {
    breakpoints: {
      xxl: "3500px",
    },
  },
})

const App: React.FC<{}> = () => {
  return (
    <ThemeProvider theme={theme}>
      <LanguageProvider availableLanguages={[{ id: "en", label: "English" }]}>
        <CssBaseline />
        <Router>
          <Routes />
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
