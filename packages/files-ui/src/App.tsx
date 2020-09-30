import React from "react"
import { init, ErrorBoundary, showReportDialog } from "@sentry/react"
import { createTheme, ThemeProvider } from "@chainsafe/common-themes"
import { CssBaseline, Router } from "@chainsafe/common-components"
import { Web3Provider } from "@chainsafe/web3-context"
import { DriveProvider, ImployApiProvider } from "@chainsafe/common-contexts"
import FilesRoutes from "./Components/FilesRoutes"
import AppWrapper from "./Components/Layouts/AppWrapper"
if (
  process.env.NODE_ENV === "production" &&
  process.env.REACT_APP_SENTRY_DSN_URL &&
  process.env.REACT_APP_SENTRY_RELEASE
) {
  init({
    dsn: process.env.REACT_APP_SENTRY_DSN_URL,
    release: process.env.REACT_APP_SENTRY_RELEASE,
  })
}

const theme = createTheme()

const App: React.FC<{}> = () => {
  const apiUrl =
    process.env.REACT_APP_API_URL || "http://3.236.79.100:8000/api/v1"

  return (
    <ErrorBoundary
      fallback={({ error, componentStack, eventId, resetError }) => (
        <div>
          <p>
            An error occured and has been logged. If you would like to provide
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Web3Provider networkIds={[1]}>
          <ImployApiProvider apiUrl={apiUrl}>
            <DriveProvider>
              <Router>
                <AppWrapper>
                  <FilesRoutes />
                </AppWrapper>
              </Router>
            </DriveProvider>
          </ImployApiProvider>
        </Web3Provider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
