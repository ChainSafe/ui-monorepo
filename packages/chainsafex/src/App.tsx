import React, { useEffect } from "react"
import {
  init as initSentry,
  ErrorBoundary,
  showReportDialog,
} from "@sentry/react"
import { ThemeSwitcher } from "@chainsafe/common-theme"
import { CssBaseline, Router } from "@chainsafe/common-components"
import AppWrapper from "./Components/Layouts/AppWrapper"
import { lightTheme } from "./Themes/LightTheme"
import { darkTheme } from "./Themes/DarkTheme"
import { useHotjar } from "react-use-hotjar"
import Routes from "./Components/Routes"

if (
  process.env.NODE_ENV === "production" &&
  process.env.REACT_APP_SENTRY_DSN_URL &&
  process.env.REACT_APP_SENTRY_RELEASE
) {
  initSentry({
    dsn: process.env.REACT_APP_SENTRY_DSN_URL,
    release: process.env.REACT_APP_SENTRY_RELEASE,
  })
}

const App: React.FC<{}> = () => {
  const { initHotjar } = useHotjar()
  const hotjarId = process.env.REACT_APP_HOTJAR_ID

  // const apiUrl =
  //   process.env.REACT_APP_API_URL || "http://3.236.79.100:8000/api/v1"

  useEffect(() => {
    if (hotjarId && process.env.NODE_ENV === "production") {
      initHotjar(hotjarId, "6", () => console.log("Hotjar initialized"))
    }
  }, [hotjarId, initHotjar])

  return (
    <ErrorBoundary
      fallback={({ error, componentStack, eventId, resetError }) => (
        <div>
          <p>
            An error occurred and has been logged. If you would like to provide
            additional info to help us debug and resolve the issue, click the
            "Provide Additional Details" button
          </p>
          <p>{error?.message.toString()}</p>
          <p>{componentStack}</p>
          <p>{eventId}</p>
          <button onClick={() => showReportDialog({ eventId: eventId || "" })}>
            Provide Additional Details
          </button>
          <button onClick={resetError}>Reset error</button>
        </div>
      )}
      onReset={() => window.location.reload()}
    >
      <ThemeSwitcher themes={{ light: lightTheme, dark: darkTheme }}>
        <CssBaseline />
        <Router>
          <AppWrapper>
            <Routes />
          </AppWrapper>
        </Router>
      </ThemeSwitcher>
    </ErrorBoundary>
  )
}

export default App
